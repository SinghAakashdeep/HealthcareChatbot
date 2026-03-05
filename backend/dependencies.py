from fastapi import Depends, HTTPException, Request
from jose import jwt

from auth import SECRET_KEY, ALGORITHM


def get_current_user(request: Request):

    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(401, "Not authenticated")

    try:
        payload = jwt.decode(
            token, SECRET_KEY, algorithms=[ALGORITHM]
        )

        return payload

    except:
        raise HTTPException(401, "Invalid token")
