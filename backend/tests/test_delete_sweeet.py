from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User, Sweet
import uuid

client = TestClient(app)

def test_delete_sweet():
    # Ensure admin exists and is admin
    db = SessionLocal()
    admin_user = db.query(User).filter(User.email == "gagan@example.com").first()
    assert admin_user is not None
    admin_user.is_admin = 1
    db.commit()
    db.close()

    # Login as admin (OAuth2 form)
    login_response = client.post(
        "/api/auth/login",
        data={
            "username": "gagan@example.com",
            "password": "string"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # Create a UNIQUE sweet (avoid duplicates)
    unique_name = f"Gulab Jamun {uuid.uuid4()}"

    sweet_data = {
        "name": unique_name,
        "category": "Indian",
        "price": 15.0,
        "quantity": 20
    }

    create_response = client.post(
        "/api/sweets/create",
        json=sweet_data,
        headers=auth_headers,
    )

    assert create_response.status_code == 200
    sweet_id = create_response.json()["id"]

    # Delete the sweet (ADMIN ONLY)
    delete_response = client.delete(
        f"/api/sweets/{sweet_id}",
        headers=auth_headers,
    )

    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == "Sweet deleted successfully"

    # Verify deletion directly from DB (correct way)
    db = SessionLocal()
    deleted_sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    db.close()

    assert deleted_sweet is None
