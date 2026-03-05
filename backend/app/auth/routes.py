from fastapi import APIRouter, Depends, Response, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.database import SessionLocal
from app.models import User
from app.auth.jwt import create_access_token
from app.auth.deps import get_current_user
from fastapi import Depends
from pydantic import BaseModel, EmailStr
from uuid import UUID
from typing import Literal

class MeResponse(BaseModel):
    sub: UUID
    email: EmailStr
    role: Literal["doctor", "patient"]

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
class LogoutResponse(BaseModel):
    message: str
# ---------- REGISTER ----------
@router.post("/register", status_code=201)
def register(data: dict, response: Response):
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password or not role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email, password, and role are required",
        )

    if role not in {"doctor", "patient"}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid role",
        )

    db: Session = SessionLocal()

    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    hashed_password = pwd_context.hash(password)

    user = User(
        email=email,
        password_hash=hashed_password,
        role=role,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "role": user.role,
    })

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False,  # True in production
        max_age=60 * 60 * 24,
    )

    return {
        "id": user.id,
        "email": user.email,
        "role": user.role,
    }

# ---------- LOGIN ----------
@router.post("/login")
def login(data: dict, response: Response):
    db: Session = SessionLocal()

    user = db.query(User).filter(User.email == data["email"]).first()
    if not user or not pwd_context.verify(data["password"], user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": user.id,
        "email": user.email,
        "role": user.role
    })

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax",
        secure=False
    )

    return {
        "id": user.id,
        "email": user.email,
        "role": user.role
    }

# ---------- ME ----------
@router.get("/me", response_model=MeResponse)
def me(user=Depends(get_current_user)):
    return user


# ---------- LOGOUT ----------
@router.post("/logout", response_model=LogoutResponse)
def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out"}
