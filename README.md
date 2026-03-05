# Healthcare Chatbot

A comprehensive full-stack healthcare platform enabling secure communication between patients and doctors, with real-time chat functionality and medical record management.

## Features

- **User Authentication & Authorization**
  - Secure JWT-based authentication
  - Role-based access control (Doctor, Patient)
  - User registration and login

- **Doctor Dashboard**
  - View list of assigned patients
  - Access patient medical records
  - Real-time chat with patients
  - Monitor patient health information

- **Patient Dashboard**
  - Connect with healthcare providers
  - View medical history
  - Real-time messaging with doctors
  - Manage personal health information

- **Medical Records**
  - Secure storage of diagnoses and medical data
  - Doctor-patient medical documentation
  - Timestamped records for compliance

- **Real-time Communication**
  - Instant messaging between doctors and patients
  - Message history and chat persistence

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.x
- **Database**: SQLAlchemy ORM with SQL support
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: Built-in Swagger UI

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS, SCSS
- **Package Manager**: npm/yarn

## Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn
- Git

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`  
API documentation: `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd healthcare-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file (if needed) with the following:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
HealthcareChatbot/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py              # FastAPI app entry point
│   │   ├── database.py          # Database configuration
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── schemas.py           # Pydantic schemas
│   │   ├── auth/                # Authentication logic
│   │   │   ├── jwt.py
│   │   │   ├── roles.py
│   │   │   ├── deps.py
│   │   │   └── routes.py
│   │   └── routes/              # API routes
│   │       ├── doctor.py
│   │       └── patient.py
│   └── requirements.txt
├── healthcare-frontend/
│   ├── app/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── middleware.ts        # Next.js middleware
│   │   ├── components/          # Reusable components
│   │   │   ├── auth/            # Auth guards
│   │   │   ├── doctor/          # Doctor components
│   │   │   └── background/      # UI components
│   │   ├── doctor/              # Doctor pages
│   │   ├── patient/             # Patient pages
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── context/             # React Context
│   │   ├── lib/                 # Utilities
│   │   └── styles/              # Global styles
│   ├── public/                  # Static assets
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Database Models

The application uses the following core models:

- **User**: Authentication and user management
  - email, password_hash, role
  
- **Patient**: Patient profile information
  - full_name, age, gender
  
- **DoctorProfile**: Doctor information
  - full_name, specialization
  
- **MedicalRecord**: Patient medical documentation
  - diagnosis, created_at

## API Endpoints

### Authentication Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Doctor Routes
- `GET /doctor/patients` - Get list of patients
- `GET /doctor/patient/{patient_id}` - Get patient details
- `GET /doctor/patient/{patient_id}/records` - Get patient medical records

### Patient Routes
- `GET /patient/profile` - Get patient profile
- `GET /patient/doctors` - Get assigned doctors
- `GET /patient/records` - Get personal medical records

## Environment Variables

Create a `.env` file in the backend directory:
```
DATABASE_URL=sqlite:///./healthcare.db
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd healthcare-frontend
npm test
```

## Development

### Build the frontend for production:
```bash
npm run build
npm start
```

### Lint code:
```bash
npm run lint
```

## Security Features

- JWT-based authentication with secure tokens
- Role-based access control (RBAC)
- CORS configured for secure cross-origin requests
- Password hashing for user credentials
- Protected API endpoints with role guards

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@healthcarechatbot.com or open an issue on GitHub.

## Authors

- Aakash Singh (SinghAakashdeep)

## Acknowledgments

- FastAPI for the excellent Python web framework
- Next.js for the modern React framework
- The open-source community for amazing tools and libraries