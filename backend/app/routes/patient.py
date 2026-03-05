from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.auth.deps import require_role, get_current_user
from app.auth.roles import PATIENT
from app.models import Patient, MedicalRecord

router = APIRouter(
    prefix="/patient",
    tags=["patient"],
    dependencies=[Depends(require_role(PATIENT))]
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- DASHBOARD ----------------
@router.get("/dashboard")
def patient_dashboard():
    return {
        "message": "Patient dashboard access granted"
    }


# ---------------- MEDICAL RECORDS ----------------
@router.get("/records")
def get_my_medical_records(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    patient = (
        db.query(Patient)
        .filter(Patient.user_id == user["sub"])
        .first()
    )

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    records = (
        db.query(MedicalRecord)
        .filter(MedicalRecord.patient_id == patient.id)
        .order_by(MedicalRecord.created_at.desc())
        .all()
    )

    return records
