from sqlalchemy import Column, Integer, String, Date, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

    profile_photo = Column(String, nullable=True)

    patients = relationship("Patient", back_populates="user")
    doctor_profile = relationship("Doctor", back_populates="user", uselist=False)
    chat_messages = relationship("ChatMessage", back_populates="user", cascade="all, delete")


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    specialization = Column(String, nullable=True)
    license_number = Column(String, nullable=True)
    experience_years = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=True)

    user = relationship("User", back_populates="doctor_profile")
    visits = relationship("Visit", back_populates="doctor")


class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    date_of_birth = Column(Date, nullable=True)
    gender = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
    height_cm = Column(Float, nullable=True)
    weight_kg = Column(Float, nullable=True)
    allergies = Column(Text, nullable=True)
    chronic_conditions = Column(Text, nullable=True)
    emergency_contact_name = Column(String, nullable=True)
    emergency_contact_phone = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=True)
    allow_ai_full_history = Column(Boolean, default=True, nullable=True)
    share_with_doctors = Column(Boolean, default=True, nullable=True)

    user = relationship("User", back_populates="patients")
    visits = relationship("Visit", back_populates="patient")


class Visit(Base):
    __tablename__ = "visits"

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patients.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)

    visit_date = Column(DateTime, nullable=True)
    chief_complaint = Column(Text, nullable=True)
    diagnosis = Column(Text, nullable=True)
    treatment_plan = Column(Text, nullable=True)
    follow_up_date = Column(Date, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=True)
    is_deleted = Column(Boolean, default=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=True)

    patient = relationship("Patient", back_populates="visits")
    doctor = relationship("Doctor", back_populates="visits")
    prescriptions = relationship("Prescription", back_populates="visit")
    vitals = relationship("Vital", back_populates="visit", uselist=False)


class Prescription(Base):
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True)
    visit_id = Column(Integer, ForeignKey("visits.id"), nullable=False)

    medicine_name = Column(String, nullable=True)
    dosage = Column(String, nullable=True)
    frequency = Column(String, nullable=True)
    duration = Column(String, nullable=True)
    instructions = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=True)

    visit = relationship("Visit", back_populates="prescriptions")


class Vital(Base):
    __tablename__ = "vitals"

    id = Column(Integer, primary_key=True)
    visit_id = Column(Integer, ForeignKey("visits.id"), nullable=False)

    temperature = Column(Float, nullable=True)
    blood_pressure = Column(String, nullable=True)
    heart_rate = Column(Integer, nullable=True)
    oxygen_saturation = Column(Integer, nullable=True)
    respiratory_rate = Column(Integer, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=True)

    visit = relationship("Visit", back_populates="vitals")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)

    role = Column(String, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    user = relationship("User", back_populates="chat_messages")
