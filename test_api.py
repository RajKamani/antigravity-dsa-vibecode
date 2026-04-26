from fastapi.testclient import TestClient
from api.index import app
import sys

client = TestClient(app)
try:
    response = client.post("/api/auth/register", json={"email": "test4@test.com", "password": "pass"})
    print(response.status_code)
    print(response.json())
except Exception as e:
    import traceback
    traceback.print_exc()
