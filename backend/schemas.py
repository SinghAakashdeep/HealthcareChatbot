from pydantic import BaseModel
from typing import Optional


class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    role: str


class LoginRequest(BaseModel):
    email: str
    password: str


# -----------------------------
# Patient Settings (V1)
# -----------------------------

class PatientSettingsResponse(BaseModel):
    name: str
    email: str
    profile_photo: Optional[str]

    height_cm: Optional[int]
    weight_kg: Optional[int]
    allergies: Optional[str]
    chronic_conditions: Optional[str]
    emergency_contact_name: Optional[str]
    emergency_contact_phone: Optional[str]


class PatientSettingsUpdate(BaseModel):
    name: Optional[str] = None
    profile_photo: Optional[str] = None

    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    allergies: Optional[str] = None
    chronic_conditions: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str
