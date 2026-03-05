from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import SessionLocal
from app.auth.deps import require_role
from app.auth.roles import DOCTOR
from app.models import Patient, MedicalRecord, DoctorProfile


router = APIRouter(
    prefix="/doctor",
    tags=["doctor"],
    dependencies=[Depends(require_role(DOCTOR))]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/dashboard")
def doctor_dashboard():
    return {
        "status": "ok",
        "message": "Doctor dashboard access granted"
    }


@router.get("/patients")
def list_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).all()
    return patients


@router.get("/patients/{patient_id}")
def get_patient(patient_id: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    records = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.patient_id == patient_id)
        .order_by(MedicalRecord.created_at.desc())
        .all()
    )

    return {
        "patient": patient,
        "medical_records": records
    }


@router.post("/patients/{patient_id}/diagnosis")
def add_diagnosis(
    patient_id: str,
    payload: dict,
    db: Session = Depends(get_db),
    user=Depends(require_role(DOCTOR))
):
    doctor = (
        db.query(DoctorProfile)
        .filter(DoctorProfile.user_id == user["sub"])
        .first()
    )

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor profile not found")

    patient = db.query(Patient).filter(Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    if "diagnosis" not in payload or not payload["diagnosis"]:
        raise HTTPException(status_code=400, detail="Diagnosis is required")

    record = MedicalRecord(
        patient_id=patient.id,
        doctor_id=doctor.id,
        diagnosis=payload["diagnosis"],
        created_at=datetime.utcnow()
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    return record


@router.post("/chat")
def doctor_chat(payload: dict):
    if "question" not in payload or not payload["question"]:
        raise HTTPException(status_code=400, detail="Question is required")

    return {
        "question": payload["question"],
        "answer": "Chatbot integration pending"
    }
