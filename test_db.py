import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie, Document
from pydantic import EmailStr

class User(Document):
    email: EmailStr
    class Settings:
        name = "users_test"

async def test():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client["test_db"]
    print(f"DB type: {type(db)}")
    try:
        await init_beanie(database=db, document_models=[User])
        print("Success!")
    except Exception as e:
        print(f"Failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
