from datetime import date, datetime

from auth import hash_password
from database import SessionLocal
from models import ChatMessage, Doctor, Patient, Prescription, User, Visit, Vital


DUMMY_HASH = "$argon2id$dummyhash"
SEEDED_PASSWORD = "Health@123"


DOCTORS = [
    {
        "name": "Dr. Aakash Singh",
        "email": "xyz@gmail.com",
        "password": None,
        "specialization": "Primary Care",
        "license_number": "DL-PC-17220",
        "experience_years": 7,
    },
    {
        "name": "Dr. Aisha Mehta",
        "email": "aisha.mehta@hospital.com",
        "password": SEEDED_PASSWORD,
        "specialization": "General Medicine",
        "license_number": "MH-GM-20481",
        "experience_years": 11,
    },
    {
        "name": "Dr. Rohan Iyer",
        "email": "rohan.iyer@hospital.com",
        "password": SEEDED_PASSWORD,
        "specialization": "Internal Medicine",
        "license_number": "KA-IM-19432",
        "experience_years": 9,
    },
    {
        "name": "Dr. Kavya Nair",
        "email": "kavya.nair@hospital.com",
        "password": SEEDED_PASSWORD,
        "specialization": "Family Medicine",
        "license_number": "KL-FM-22814",
        "experience_years": 8,
    },
    {
        "name": "Dr. Arjun Rao",
        "email": "arjun.rao@hospital.com",
        "password": SEEDED_PASSWORD,
        "specialization": "Sports Medicine",
        "license_number": "TS-SM-18105",
        "experience_years": 10,
    },
]


PATIENTS = [
    {
        "name": "Aakash",
        "email": "abc@gmail.com",
        "password": None,
        "date_of_birth": date(1997, 8, 14),
        "gender": "Male",
        "blood_group": "B+",
        "height_cm": 176.0,
        "weight_kg": 78.4,
        "allergies": "Dust allergy",
        "chronic_conditions": "None",
        "emergency_contact_name": "Ritika Verma",
        "emergency_contact_phone": "9876543210",
        "visits": [
            {
                "doctor_email": "aisha.mehta@hospital.com",
                "visit_date": datetime(2026, 1, 12, 10, 0),
                "chief_complaint": "Fever, sore throat, and body ache for 2 days",
                "diagnosis": "Acute viral upper respiratory infection",
                "treatment_plan": "Rest, fluids, steam inhalation, and antipyretics as needed",
                "notes": "No shortness of breath. Advised return if fever persists beyond 3 days.",
                "vitals": {
                    "temperature": 100.2,
                    "blood_pressure": "118/76",
                    "heart_rate": 94,
                    "oxygen_saturation": 98,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Paracetamol",
                        "dosage": "650 mg",
                        "frequency": "Every 8 hours as needed",
                        "duration": "3 days",
                        "instructions": "Take after food for fever or body ache.",
                    },
                    {
                        "medicine_name": "Cetirizine",
                        "dosage": "10 mg",
                        "frequency": "Once at night",
                        "duration": "5 days",
                        "instructions": "May cause mild drowsiness.",
                    },
                ],
            },
            {
                "doctor_email": "arjun.rao@hospital.com",
                "visit_date": datetime(2026, 3, 5, 18, 15),
                "chief_complaint": "Lower back pain after heavy gym workout",
                "diagnosis": "Mechanical lower back strain",
                "treatment_plan": "Relative rest, posture correction, warm compress, and anti-inflammatory medication",
                "notes": "No numbness, bowel/bladder symptoms, or radiating pain.",
                "vitals": {
                    "temperature": 98.4,
                    "blood_pressure": "122/80",
                    "heart_rate": 78,
                    "oxygen_saturation": 99,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Ibuprofen",
                        "dosage": "400 mg",
                        "frequency": "Twice daily",
                        "duration": "5 days",
                        "instructions": "Take after meals. Stop if gastritis develops.",
                    }
                ],
            },
        ],
        "chat_messages": [
            ("user", "Hey"),
            ("assistant", "## Welcome\n\nHello! I'm your AI Health Assistant.\n\nYou can describe any symptoms you're experiencing, and I'll guide you with possible causes, self-care advice, and when to seek medical attention.\n\nHow can I help you today?"),
            ("user", "I am having a sore throat and mild fever since yesterday"),
            ("assistant", "## Current Symptoms\nMild fever and sore throat since yesterday\n\n## Possible Cause\nThis can happen with a viral upper respiratory infection.\n\n## What You Can Do\n- Drink warm fluids and stay hydrated\n- Rest and monitor your temperature\n- Use paracetamol if fever or throat pain increases\n\n## Seek Medical Attention If\n- You have trouble breathing or swallowing\n- Fever becomes high or lasts more than 3 days\n- You develop severe weakness or dehydration\n\n## Next Step\nIf symptoms continue tomorrow, consider a doctor visit for an in-person throat exam."),
        ],
    },
    {
        "name": "Aakash",
        "email": "aakash@gmail.com",
        "password": None,
        "date_of_birth": date(1999, 3, 20),
        "gender": "Male",
        "blood_group": "O+",
        "height_cm": 173.0,
        "weight_kg": 74.0,
        "allergies": "None",
        "chronic_conditions": "None",
        "emergency_contact_name": "Neha Singh",
        "emergency_contact_phone": "9898989898",
        "visits": [
            {
                "doctor_email": "rohan.iyer@hospital.com",
                "visit_date": datetime(2026, 1, 10, 9, 30),
                "chief_complaint": "Fever and headache for 2 days",
                "diagnosis": "Likely viral fever",
                "treatment_plan": "Hydration, home rest, and fever monitoring",
                "notes": "No neck stiffness, vomiting, or respiratory distress.",
                "vitals": {
                    "temperature": 100.4,
                    "blood_pressure": "118/76",
                    "heart_rate": 92,
                    "oxygen_saturation": 98,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Paracetamol",
                        "dosage": "500 mg",
                        "frequency": "Twice daily",
                        "duration": "5 days",
                        "instructions": "Take after meals.",
                    }
                ],
            },
            {
                "doctor_email": "arjun.rao@hospital.com",
                "visit_date": datetime(2026, 2, 5, 18, 0),
                "chief_complaint": "Lower back pain after gym workout",
                "diagnosis": "Muscle strain",
                "treatment_plan": "NSAIDs, stretching, and temporary activity modification",
                "notes": "Improvement expected over 1 week with conservative management.",
                "vitals": {
                    "temperature": 98.6,
                    "blood_pressure": "120/80",
                    "heart_rate": 78,
                    "oxygen_saturation": 99,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Ibuprofen",
                        "dosage": "400 mg",
                        "frequency": "Twice daily",
                        "duration": "7 days",
                        "instructions": "Take after food.",
                    }
                ],
            },
        ],
        "chat_messages": [
            ("user", "hey"),
            ("assistant", "## Welcome\n\nHello! I'm your AI Health Assistant.\n\nYou can describe any symptoms you're experiencing, and I'll guide you with possible causes, self-care advice, and when to seek medical attention.\n\nHow can I help you today?"),
            ("user", "I am experiencing some discomfort around the lower back area. I hit the gym yesterday"),
            ("assistant", "## Current Symptoms\nLower back discomfort after gym workout\n\n## Possible Cause\nThis sounds consistent with a mild muscle strain from recent exercise.\n\n## What You Can Do\n- Apply a warm compress to the area\n- Avoid heavy lifting for the next 48 hours\n- Use an over-the-counter anti-inflammatory after food if needed\n\n## Seek Medical Attention If\n- Pain travels down the leg or causes numbness\n- You develop weakness, fever, or bladder symptoms\n- Pain keeps getting worse instead of better\n\n## Next Step\nTry self-care for 24 to 48 hours and book an appointment if pain persists."),
        ],
    },
    {
        "name": "Meera Shah",
        "email": "meera.shah@healthdemo.com",
        "password": SEEDED_PASSWORD,
        "date_of_birth": date(1988, 11, 2),
        "gender": "Female",
        "blood_group": "A+",
        "height_cm": 161.0,
        "weight_kg": 66.5,
        "allergies": "Penicillin",
        "chronic_conditions": "Type 2 diabetes mellitus",
        "emergency_contact_name": "Rahul Shah",
        "emergency_contact_phone": "9811122233",
        "visits": [
            {
                "doctor_email": "kavya.nair@hospital.com",
                "visit_date": datetime(2026, 1, 18, 11, 0),
                "chief_complaint": "Routine diabetes follow-up with occasional post-lunch fatigue",
                "diagnosis": "Type 2 diabetes, fairly controlled",
                "treatment_plan": "Continue diet plan, regular exercise, and glucose monitoring",
                "notes": "Discussed meal timing and walking after dinner.",
                "vitals": {
                    "temperature": 98.1,
                    "blood_pressure": "126/82",
                    "heart_rate": 80,
                    "oxygen_saturation": 99,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Metformin",
                        "dosage": "500 mg",
                        "frequency": "Twice daily",
                        "duration": "30 days",
                        "instructions": "Take with breakfast and dinner.",
                    }
                ],
            },
            {
                "doctor_email": "kavya.nair@hospital.com",
                "visit_date": datetime(2026, 3, 14, 11, 20),
                "chief_complaint": "Mild burning sensation in feet at night",
                "diagnosis": "Early diabetic neuropathy symptoms",
                "treatment_plan": "Improve glucose control and start vitamin supplementation",
                "notes": "Foot care counseling provided.",
                "vitals": {
                    "temperature": 98.3,
                    "blood_pressure": "128/84",
                    "heart_rate": 82,
                    "oxygen_saturation": 99,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Methylcobalamin",
                        "dosage": "1500 mcg",
                        "frequency": "Once daily",
                        "duration": "30 days",
                        "instructions": "Take after breakfast.",
                    }
                ],
            },
        ],
        "chat_messages": [],
    },
    {
        "name": "Karan Malhotra",
        "email": "karan.malhotra@healthdemo.com",
        "password": SEEDED_PASSWORD,
        "date_of_birth": date(1979, 6, 25),
        "gender": "Male",
        "blood_group": "AB+",
        "height_cm": 170.0,
        "weight_kg": 83.0,
        "allergies": "None",
        "chronic_conditions": "Hypertension",
        "emergency_contact_name": "Nidhi Malhotra",
        "emergency_contact_phone": "9822233344",
        "visits": [
            {
                "doctor_email": "rohan.iyer@hospital.com",
                "visit_date": datetime(2026, 1, 7, 8, 45),
                "chief_complaint": "Home blood pressure readings have been high for 1 week",
                "diagnosis": "Essential hypertension, suboptimal control",
                "treatment_plan": "Reduce salt intake, check BP log, continue medication adherence",
                "notes": "No chest pain, headache, or neurological deficit.",
                "vitals": {
                    "temperature": 98.2,
                    "blood_pressure": "148/94",
                    "heart_rate": 86,
                    "oxygen_saturation": 98,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Amlodipine",
                        "dosage": "5 mg",
                        "frequency": "Once daily",
                        "duration": "30 days",
                        "instructions": "Take at the same time every day.",
                    }
                ],
            },
            {
                "doctor_email": "rohan.iyer@hospital.com",
                "visit_date": datetime(2026, 3, 2, 9, 10),
                "chief_complaint": "Follow-up for blood pressure review",
                "diagnosis": "Hypertension improving on treatment",
                "treatment_plan": "Continue current dose and weekly BP log",
                "notes": "Reading improved after better adherence and diet changes.",
                "vitals": {
                    "temperature": 98.0,
                    "blood_pressure": "132/84",
                    "heart_rate": 78,
                    "oxygen_saturation": 99,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Amlodipine",
                        "dosage": "5 mg",
                        "frequency": "Once daily",
                        "duration": "30 days",
                        "instructions": "Continue without interruption.",
                    }
                ],
            },
        ],
        "chat_messages": [],
    },
    {
        "name": "Sneha Patel",
        "email": "sneha.patel@healthdemo.com",
        "password": SEEDED_PASSWORD,
        "date_of_birth": date(1994, 9, 15),
        "gender": "Female",
        "blood_group": "O-",
        "height_cm": 158.0,
        "weight_kg": 57.0,
        "allergies": "Pollen",
        "chronic_conditions": "Migraine",
        "emergency_contact_name": "Jay Patel",
        "emergency_contact_phone": "9833344455",
        "visits": [
            {
                "doctor_email": "aisha.mehta@hospital.com",
                "visit_date": datetime(2026, 2, 3, 16, 0),
                "chief_complaint": "Throbbing headache with light sensitivity",
                "diagnosis": "Migraine without aura",
                "treatment_plan": "Hydration, sleep hygiene, and trigger control",
                "notes": "Episodes associated with poor sleep and skipped meals.",
                "vitals": {
                    "temperature": 98.5,
                    "blood_pressure": "114/72",
                    "heart_rate": 74,
                    "oxygen_saturation": 100,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Sumatriptan",
                        "dosage": "50 mg",
                        "frequency": "At onset of headache",
                        "duration": "As needed for 10 doses",
                        "instructions": "Use at migraine onset, not more than advised.",
                    }
                ],
            },
            {
                "doctor_email": "aisha.mehta@hospital.com",
                "visit_date": datetime(2026, 3, 22, 16, 30),
                "chief_complaint": "Seasonal sneezing and nasal congestion",
                "diagnosis": "Allergic rhinitis",
                "treatment_plan": "Allergen avoidance and nasal saline use",
                "notes": "Symptoms worse in the morning and after dust exposure.",
                "vitals": {
                    "temperature": 98.4,
                    "blood_pressure": "112/70",
                    "heart_rate": 76,
                    "oxygen_saturation": 99,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Levocetirizine",
                        "dosage": "5 mg",
                        "frequency": "Once daily at night",
                        "duration": "14 days",
                        "instructions": "Continue if symptoms improve.",
                    }
                ],
            },
        ],
        "chat_messages": [],
    },
    {
        "name": "Dev Khanna",
        "email": "dev.khanna@healthdemo.com",
        "password": SEEDED_PASSWORD,
        "date_of_birth": date(1985, 2, 9),
        "gender": "Male",
        "blood_group": "B-",
        "height_cm": 180.0,
        "weight_kg": 88.0,
        "allergies": "Shellfish",
        "chronic_conditions": "Gastritis",
        "emergency_contact_name": "Pooja Khanna",
        "emergency_contact_phone": "9844455566",
        "visits": [
            {
                "doctor_email": "arjun.rao@hospital.com",
                "visit_date": datetime(2026, 1, 27, 13, 15),
                "chief_complaint": "Burning upper abdominal pain after spicy meals",
                "diagnosis": "Acid peptic symptoms / gastritis",
                "treatment_plan": "Avoid spicy food, late-night meals, and caffeine excess",
                "notes": "No red flag signs such as vomiting blood or weight loss.",
                "vitals": {
                    "temperature": 98.2,
                    "blood_pressure": "124/82",
                    "heart_rate": 84,
                    "oxygen_saturation": 99,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Pantoprazole",
                        "dosage": "40 mg",
                        "frequency": "Once daily before breakfast",
                        "duration": "14 days",
                        "instructions": "Take 30 minutes before food.",
                    }
                ],
            },
            {
                "doctor_email": "arjun.rao@hospital.com",
                "visit_date": datetime(2026, 3, 19, 13, 0),
                "chief_complaint": "Review after gastritis treatment",
                "diagnosis": "Gastritis improved",
                "treatment_plan": "Continue lifestyle measures and taper medication",
                "notes": "Symptoms much better after regular meals and reduced caffeine.",
                "vitals": {
                    "temperature": 98.1,
                    "blood_pressure": "122/80",
                    "heart_rate": 80,
                    "oxygen_saturation": 99,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Pantoprazole",
                        "dosage": "40 mg",
                        "frequency": "Once daily before breakfast",
                        "duration": "7 days",
                        "instructions": "Stop after 1 week if asymptomatic.",
                    }
                ],
            },
        ],
        "chat_messages": [],
    },
    {
        "name": "Priya Naidu",
        "email": "priya.naidu@healthdemo.com",
        "password": SEEDED_PASSWORD,
        "date_of_birth": date(1991, 12, 1),
        "gender": "Female",
        "blood_group": "A-",
        "height_cm": 164.0,
        "weight_kg": 61.0,
        "allergies": "None",
        "chronic_conditions": "Iron deficiency anemia",
        "emergency_contact_name": "Suresh Naidu",
        "emergency_contact_phone": "9855566677",
        "visits": [
            {
                "doctor_email": "kavya.nair@hospital.com",
                "visit_date": datetime(2026, 2, 11, 12, 10),
                "chief_complaint": "Fatigue and reduced exercise tolerance",
                "diagnosis": "Iron deficiency anemia under treatment",
                "treatment_plan": "Continue iron therapy and improve dietary iron intake",
                "notes": "No active bleeding symptoms reported.",
                "vitals": {
                    "temperature": 98.0,
                    "blood_pressure": "108/70",
                    "heart_rate": 88,
                    "oxygen_saturation": 100,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Ferrous Ascorbate",
                        "dosage": "100 mg elemental iron",
                        "frequency": "Once daily",
                        "duration": "30 days",
                        "instructions": "Take with water or citrus juice if tolerated.",
                    }
                ],
            }
        ],
        "chat_messages": [],
    },
    {
        "name": "Farhan Ali",
        "email": "farhan.ali@healthdemo.com",
        "password": SEEDED_PASSWORD,
        "date_of_birth": date(1983, 5, 17),
        "gender": "Male",
        "blood_group": "O+",
        "height_cm": 175.0,
        "weight_kg": 92.0,
        "allergies": "None",
        "chronic_conditions": "Hyperlipidemia",
        "emergency_contact_name": "Sara Ali",
        "emergency_contact_phone": "9866677788",
        "visits": [
            {
                "doctor_email": "rohan.iyer@hospital.com",
                "visit_date": datetime(2026, 2, 21, 17, 45),
                "chief_complaint": "Annual preventive visit and lipid review",
                "diagnosis": "Dyslipidemia with overweight",
                "treatment_plan": "Diet modification, brisk walking, and repeat lipid profile in 3 months",
                "notes": "Motivated to start a weight-loss plan.",
                "vitals": {
                    "temperature": 98.4,
                    "blood_pressure": "130/86",
                    "heart_rate": 82,
                    "oxygen_saturation": 99,
                },
                "prescriptions": [
                    {
                        "medicine_name": "Rosuvastatin",
                        "dosage": "10 mg",
                        "frequency": "Once daily at night",
                        "duration": "30 days",
                        "instructions": "Take in the evening and report muscle pain if it occurs.",
                    }
                ],
            }
        ],
        "chat_messages": [],
    },
]


def remove_unwanted_seed_data(db):
    users_to_remove = []
    for user in db.query(User).all():
        if user.password == DUMMY_HASH or user.email.startswith("codex_"):
            users_to_remove.append(user.id)

    if not users_to_remove:
        return

    doctor_ids = [
        doctor.id
        for doctor in db.query(Doctor).filter(Doctor.user_id.in_(users_to_remove)).all()
    ]

    patient_ids = [
        patient.id
        for patient in db.query(Patient).filter(Patient.user_id.in_(users_to_remove)).all()
    ]

    visit_ids = []
    if patient_ids or doctor_ids:
        visit_ids = [
            visit.id
            for visit in db.query(Visit).filter(
                (Visit.patient_id.in_(patient_ids)) | (Visit.doctor_id.in_(doctor_ids))
            ).all()
        ]

    if visit_ids:
        db.query(Prescription).filter(Prescription.visit_id.in_(visit_ids)).delete(synchronize_session=False)
        db.query(Vital).filter(Vital.visit_id.in_(visit_ids)).delete(synchronize_session=False)

    if patient_ids:
        db.query(Patient).filter(Patient.id.in_(patient_ids)).delete(synchronize_session=False)

    db.query(ChatMessage).filter(ChatMessage.user_id.in_(users_to_remove)).delete(synchronize_session=False)
    if visit_ids:
        db.query(Visit).filter(Visit.id.in_(visit_ids)).delete(synchronize_session=False)
    if doctor_ids:
        db.query(Doctor).filter(Doctor.id.in_(doctor_ids)).delete(synchronize_session=False)
    db.query(User).filter(User.id.in_(users_to_remove)).delete(synchronize_session=False)


def get_or_create_user(db, name, email, role, password=None):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        user = User(name=name, email=email, role=role, password=hash_password(password or SEEDED_PASSWORD))
        db.add(user)
        db.flush()
        return user

    user.name = name
    user.role = role
    if password:
        user.password = hash_password(password)
    return user


def get_or_create_patient(db, user, payload):
    patient = db.query(Patient).filter(Patient.user_id == user.id).first()
    if not patient:
        patient = Patient(user_id=user.id)
        db.add(patient)
        db.flush()

    patient.date_of_birth = payload["date_of_birth"]
    patient.gender = payload["gender"]
    patient.blood_group = payload["blood_group"]
    patient.height_cm = payload["height_cm"]
    patient.weight_kg = payload["weight_kg"]
    patient.allergies = payload["allergies"]
    patient.chronic_conditions = payload["chronic_conditions"]
    patient.emergency_contact_name = payload["emergency_contact_name"]
    patient.emergency_contact_phone = payload["emergency_contact_phone"]
    patient.allow_ai_full_history = True
    patient.share_with_doctors = True
    return patient


def get_or_create_doctor(db, user, payload):
    doctor = db.query(Doctor).filter(Doctor.user_id == user.id).first()
    if not doctor:
        doctor = Doctor(user_id=user.id)
        db.add(doctor)
        db.flush()

    doctor.specialization = payload["specialization"]
    doctor.license_number = payload["license_number"]
    doctor.experience_years = payload["experience_years"]
    return doctor


def clear_patient_history(db, user_id, patient_id):
    visit_ids = [visit.id for visit in db.query(Visit).filter(Visit.patient_id == patient_id).all()]
    if visit_ids:
        db.query(Prescription).filter(Prescription.visit_id.in_(visit_ids)).delete(synchronize_session=False)
        db.query(Vital).filter(Vital.visit_id.in_(visit_ids)).delete(synchronize_session=False)
        db.query(Visit).filter(Visit.id.in_(visit_ids)).delete(synchronize_session=False)

    db.query(ChatMessage).filter(ChatMessage.user_id == user_id).delete(synchronize_session=False)


def seed_patient_history(db, patient, user, doctor_lookup, payload):
    clear_patient_history(db, user.id, patient.id)

    for visit_payload in payload["visits"]:
        visit = Visit(
            patient_id=patient.id,
            doctor_id=doctor_lookup[visit_payload["doctor_email"]].id,
            visit_date=visit_payload["visit_date"],
            chief_complaint=visit_payload["chief_complaint"],
            diagnosis=visit_payload["diagnosis"],
            treatment_plan=visit_payload["treatment_plan"],
            notes=visit_payload["notes"],
            is_deleted=False,
        )
        db.add(visit)
        db.flush()

        vitals = visit_payload.get("vitals")
        if vitals:
            db.add(
                Vital(
                    visit_id=visit.id,
                    temperature=vitals["temperature"],
                    blood_pressure=vitals["blood_pressure"],
                    heart_rate=vitals["heart_rate"],
                    oxygen_saturation=vitals["oxygen_saturation"],
                    respiratory_rate=vitals.get("respiratory_rate"),
                )
            )

        for prescription in visit_payload.get("prescriptions", []):
            db.add(
                Prescription(
                    visit_id=visit.id,
                    medicine_name=prescription["medicine_name"],
                    dosage=prescription["dosage"],
                    frequency=prescription["frequency"],
                    duration=prescription["duration"],
                    instructions=prescription["instructions"],
                )
            )

    for role, content in payload.get("chat_messages", []):
        db.add(ChatMessage(user_id=user.id, role=role, content=content))


def main():
    db = SessionLocal()

    try:
        remove_unwanted_seed_data(db)

        doctor_lookup = {}
        for doctor in DOCTORS:
            doctor_user = get_or_create_user(
                db,
                doctor["name"],
                doctor["email"],
                "doctor",
                doctor["password"],
            )
            doctor_profile = get_or_create_doctor(db, doctor_user, doctor)
            doctor_lookup[doctor["email"]] = doctor_profile

        for patient_payload in PATIENTS:
            user = get_or_create_user(
                db,
                patient_payload["name"],
                patient_payload["email"],
                "patient",
                patient_payload["password"],
            )
            patient = get_or_create_patient(db, user, patient_payload)
            seed_patient_history(db, patient, user, doctor_lookup, patient_payload)

        db.commit()

        print("Meaningful seed data applied successfully.")
        print(f"Seeded doctor password for demo accounts: {SEEDED_PASSWORD}")

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
