import random
import string
import os
import time
from datetime import datetime
from dotenv import load_dotenv

import psycopg2
from psycopg2.extras import execute_values
from faker import Faker
from tqdm import tqdm


# ----------------------------
# CONFIG
# ----------------------------
NUM_PATIENTS = 1200
BATCH_SIZE = 200

# ----------------------------
# ENV + DB
# ----------------------------
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found")

conn = psycopg2.connect(DATABASE_URL, sslmode="require")
cur = conn.cursor()

fake = Faker()

# ----------------------------
# HELPERS
# ----------------------------
def random_phone():
    return "".join(random.choices(string.digits, k=10))

def random_blood_group():
    return random.choice(["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"])

def random_gender():
    return random.choice(["Male", "Female", "Other"])

def random_height():
    return round(random.uniform(150, 190), 2)

def random_weight():
    return round(random.uniform(50, 100), 2)

def random_dob():
    return fake.date_between(start_date="-60y", end_date="-18y")

def random_visit_date():
    return fake.date_time_between(start_date="-2y", end_date="now")


start_time = time.time()

try:
    for batch_start in tqdm(range(0, NUM_PATIENTS, BATCH_SIZE), desc="Seeding"):

        users_data = []
        patients_data = []
        visits_data = []
        prescriptions_data = []
        vitals_data = []

        # ----------------------------
        # 1️⃣ Generate Users
        # ----------------------------
        for _ in range(BATCH_SIZE):
            users_data.append((
                fake.name(),
                fake.unique.email(),
                "$argon2id$dummyhash",
                "patient"
            ))

        execute_values(
            cur,
            """
            INSERT INTO users (name, email, password, role)
            VALUES %s
            RETURNING id
            """,
            users_data
        )

        user_ids = [row[0] for row in cur.fetchall()]

        # ----------------------------
        # 2️⃣ Generate Patients
        # ----------------------------
        for user_id in user_ids:
            patients_data.append((
                user_id,
                random_dob(),
                random_gender(),
                random_blood_group(),
                random_height(),
                random_weight(),
                fake.word(),
                fake.word(),
                fake.name(),
                random_phone()
            ))

        execute_values(
            cur,
            """
            INSERT INTO patients (
                user_id,
                date_of_birth,
                gender,
                blood_group,
                height_cm,
                weight_kg,
                allergies,
                chronic_conditions,
                emergency_contact_name,
                emergency_contact_phone
            )
            VALUES %s
            RETURNING id
            """,
            patients_data
        )

        patient_ids = [row[0] for row in cur.fetchall()]

        # ----------------------------
        # 3️⃣ Generate Visits + Children
        # ----------------------------
        for patient_id in patient_ids:

            for _ in range(random.randint(1, 5)):

                visits_data.append((
                    patient_id,
                    None,
                    random_visit_date(),
                    fake.sentence(),
                    fake.sentence(),
                    fake.sentence(),
                    fake.date_between(start_date="today", end_date="+30d"),
                    fake.sentence()
                ))

        if visits_data:
            execute_values(
                cur,
                """
                INSERT INTO visits (
                    patient_id,
                    doctor_id,
                    visit_date,
                    chief_complaint,
                    diagnosis,
                    treatment_plan,
                    follow_up_date,
                    notes
                )
                VALUES %s
                RETURNING id
                """,
                visits_data
            )

            visit_ids = [row[0] for row in cur.fetchall()]

            for visit_id in visit_ids:

                for _ in range(random.randint(1, 3)):
                    prescriptions_data.append((
                        visit_id,
                        fake.word().capitalize(),
                        "500mg",
                        "Twice Daily",
                        "5 days",
                        fake.sentence()
                    ))

                vitals_data.append((
                    visit_id,
                    round(random.uniform(36.5, 39.0), 1),
                    f"{random.randint(100,140)}/{random.randint(60,90)}",
                    random.randint(60,100),
                    random.randint(95,100)
                ))

        # ----------------------------
        # 4️⃣ Bulk Insert Children
        # ----------------------------
        if prescriptions_data:
            execute_values(
                cur,
                """
                INSERT INTO prescriptions (
                    visit_id,
                    medicine_name,
                    dosage,
                    frequency,
                    duration,
                    instructions
                )
                VALUES %s
                """,
                prescriptions_data
            )

        if vitals_data:
            execute_values(
                cur,
                """
                INSERT INTO vitals (
                    visit_id,
                    temperature,
                    blood_pressure,
                    heart_rate,
                    oxygen_saturation
                )
                VALUES %s
                """,
                vitals_data
            )

        conn.commit()

    total_time = round(time.time() - start_time, 2)
    print(f"\n✅ Finished seeding {NUM_PATIENTS} patients in {total_time} seconds")

except Exception as e:
    conn.rollback()
    print("\n❌ Error:", e)

finally:
    cur.close()
    conn.close()
