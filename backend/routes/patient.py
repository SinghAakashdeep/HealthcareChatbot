from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from pydantic import BaseModel

from database import get_db
from models import Patient, Visit, Prescription, Vital, User
from auth import get_current_user, verify_password, hash_password
from schemas import PatientSettingsUpdate, ChangePasswordRequest

router = APIRouter(prefix="/patient", tags=["Patient"])


# -------------------------
# RECORDS
# -------------------------

@router.get("/records")
def get_patient_records(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    patient = db.query(Patient).filter(
        Patient.user_id == current_user.id
    ).first()

    if not patient:
        return {"patient": None, "records": []}

    visits = db.query(Visit).filter(
        Visit.patient_id == patient.id,
        Visit.is_deleted == False
    ).order_by(Visit.visit_date.desc()).all()

    records = []

    for visit in visits:
        prescriptions = db.query(Prescription).filter(
            Prescription.visit_id == visit.id
        ).all()

        vitals = db.query(Vital).filter(
            Vital.visit_id == visit.id
        ).first()

        records.append({
            "visit_id": visit.id,
            "visit_date": visit.visit_date.isoformat() if visit.visit_date else None,
            "diagnosis": visit.diagnosis,
            "chief_complaint": visit.chief_complaint,
            "treatment_plan": visit.treatment_plan,
            "notes": visit.notes,
            "prescriptions": [
                {
                    "medicine_name": p.medicine_name,
                    "dosage": p.dosage,
                    "frequency": p.frequency,
                    "duration": p.duration
                }
                for p in prescriptions
            ],
            "vitals": {
                "temperature": vitals.temperature,
                "blood_pressure": vitals.blood_pressure,
                "heart_rate": vitals.heart_rate,
                "oxygen_saturation": vitals.oxygen_saturation
            } if vitals else None
        })

    return {
        "patient": {
            "dob": patient.date_of_birth.isoformat() if patient.date_of_birth else None,
            "gender": patient.gender,
            "blood_group": patient.blood_group
        },
        "records": records
    }


# -------------------------
# SETTINGS
# -------------------------

@router.get("/settings")
def get_settings(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    patient = db.query(Patient).filter(
        Patient.user_id == current_user.id
    ).first()

    return {
        "name": current_user.name,
        "email": current_user.email,
        "profile_photo": current_user.profile_photo,
        "height_cm": patient.height_cm if patient else None,
        "weight_kg": patient.weight_kg if patient else None,
        "allergies": patient.allergies if patient else None,
        "chronic_conditions": patient.chronic_conditions if patient else None,
        "emergency_contact_name": patient.emergency_contact_name if patient else None,
        "emergency_contact_phone": patient.emergency_contact_phone if patient else None
    }


@router.put("/settings")
def update_settings(
    data: PatientSettingsUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    patient = db.query(Patient).filter(
        Patient.user_id == current_user.id
    ).first()

    if data.name is not None:
        current_user.name = data.name

    if data.profile_photo is not None:
        current_user.profile_photo = data.profile_photo

    if patient:
        if data.height_cm is not None:
            patient.height_cm = data.height_cm
        if data.weight_kg is not None:
            patient.weight_kg = data.weight_kg
        if data.allergies is not None:
            patient.allergies = data.allergies
        if data.chronic_conditions is not None:
            patient.chronic_conditions = data.chronic_conditions
        if data.emergency_contact_name is not None:
            patient.emergency_contact_name = data.emergency_contact_name
        if data.emergency_contact_phone is not None:
            patient.emergency_contact_phone = data.emergency_contact_phone

    db.commit()

    return {"message": "Settings updated successfully"}


@router.put("/change-password")
def change_password(
    data: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    if not verify_password(data.old_password, current_user.password):
        raise HTTPException(status_code=400, detail="Old password incorrect")

    current_user.password = hash_password(data.new_password)
    db.commit()

    return {"message": "Password changed successfully"}


@router.post("/upload-profile-photo")
def upload_profile_photo(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    try:
        from services.storage import upload_profile_image

        url = upload_profile_image(file.file)
    except Exception:
        raise HTTPException(status_code=500, detail="Upload failed")

    current_user.profile_photo = url
    db.commit()

    return {"profile_photo": url}


# -------------------------
# AI ASSISTANT (Groq)
# -------------------------

class ChatRequest(BaseModel):
    message: str


@router.post("/assistant")
def patient_assistant(
    data: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    from services.assistant import generate_patient_response

    if current_user.role != "patient":
        raise HTTPException(status_code=403, detail="Only patients can use the assistant")

    patient = db.query(Patient).filter(
        Patient.user_id == current_user.id
    ).first()

    if not patient:
        patient = Patient(user_id=current_user.id)
        db.add(patient)
        db.commit()
        db.refresh(patient)

    result = generate_patient_response(
        db=db,
        user_id=current_user.id,
        user_message=data.message
    )
    return result
