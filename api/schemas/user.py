from pydantic import BaseModel, EmailStr
from datetime import datetime
from beanie import PydanticObjectId

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: PydanticObjectId
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True
