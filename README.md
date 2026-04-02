# Healthcare Chatbot

A full-stack healthcare assistant platform with patient and doctor workspaces, medical records, appointments, and an AI symptom-guidance chat experience.

## Overview

This repository contains:

- `backend/`: FastAPI API, authentication, database models, patient/doctor routes, AI assistant service, and seed scripts
- `healthcare-frontend/`: Next.js frontend for the public site, auth flow, patient workspace, and doctor workspace

## Main Features

- Patient and doctor login/register flow
- Patient dashboard, records, settings, appointments, and AI assistant
- Doctor dashboard with patient-facing clinical data access
- Medical visits, vitals, prescriptions, and chat history in the database
- AI assistant that returns structured symptom guidance and triage cues
- Curated seed data for demo/testing

## Tech Stack

### Backend

- FastAPI
- SQLAlchemy
- PostgreSQL / Neon via `DATABASE_URL`
- Pydantic
- Passlib / JWT auth
- Groq API integration for assistant responses
- Cloudinary support for profile image upload

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Project Structure

```text
HealthcareChatbot/
|-- backend/
|   |-- main.py
|   |-- run_dev.py
|   |-- database.py
|   |-- models.py
|   |-- schemas.py
|   |-- auth.py
|   |-- guards.py
|   |-- requirements.txt
|   |-- seed_meaningful_data.py
|   |-- routes/
|   |   |-- auth.py
|   |   |-- doctor.py
|   |   `-- patient.py
|   `-- services/
|       |-- assistant.py
|       `-- storage.py
|-- healthcare-frontend/
|   |-- app/
|   |-- components/
|   |-- lib/
|   |-- package.json
|   `-- next.config.ts
`-- README.md
```

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm

## Backend Setup

1. Go to the backend folder:

```bash
cd backend
```

2. Create a virtual environment:

```bash
python -m venv venv
```

3. Activate it:

```bash
# Windows PowerShell
.\venv\Scripts\Activate.ps1

# Windows CMD
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

4. Install dependencies:

```bash
pip install -r requirements.txt
```

5. Create `backend/.env` with the required values:

```env
DATABASE_URL=your_database_url
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

6. Start the backend:

```bash
python run_dev.py
```

Backend URLs:

- API: `http://127.0.0.1:8000`
- Docs: `http://127.0.0.1:8000/docs`

## Frontend Setup

1. Go to the frontend folder:

```bash
cd healthcare-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create `healthcare-frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

4. Start the frontend:

```bash
npm run dev
```

Frontend URL:

- App: `http://localhost:3000`

## Database Notes

The backend uses relational models for:

- `users`
- `doctors`
- `patients`
- `visits`
- `prescriptions`
- `vitals`
- `chat_messages`

To seed meaningful demo data:

```bash
cd backend
python seed_meaningful_data.py
```

## Key Routes

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`

### Patient

- `GET /patient/records`
- `GET /patient/settings`
- `PUT /patient/settings`
- `PUT /patient/change-password`
- `POST /patient/upload-profile-photo`
- `POST /patient/assistant`

### Doctor

- `GET /doctor/dashboard`

## Development Notes

- Start the backend from `backend/` using `python run_dev.py`
- Start the frontend from `healthcare-frontend/` using `npm run dev`
- The frontend expects the backend at `NEXT_PUBLIC_API_BASE_URL`
- The backend assistant gracefully falls back when the LLM provider is unavailable

## Verification Commands

### Backend

```bash
cd backend
python -m py_compile main.py routes\auth.py routes\doctor.py routes\patient.py services\assistant.py
```

### Frontend

```bash
cd healthcare-frontend
npm run build
npm run lint
```

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
