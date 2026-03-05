from fastapi import Depends, HTTPException
from auth import get_current_user


def doctor_only(user = Depends(get_current_user)):

    if user.role != "doctor":
        raise HTTPException(status_code=403, detail="Forbidden")

    return user


def patient_only(user = Depends(get_current_user)):

    if user.role != "patient":
        raise HTTPException(status_code=403, detail="Forbidden")

    return user
