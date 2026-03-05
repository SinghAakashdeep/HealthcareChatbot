from fastapi import APIRouter, Depends
from guards import doctor_only

router = APIRouter(prefix="/doctor")


@router.get("/dashboard")
def dashboard(user=Depends(doctor_only)):
    return {
        "message": "Doctor dashboard",
        "user": user,
    }
