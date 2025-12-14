from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models import User, Sweet
import uuid

client = TestClient(app)


def test_purchase_sweet():
    # Register user (safe if already exists)
    user_data = {
        "username": "purchaseuser",
        "email": "purchase@example.com",
        "password": "purchasepass123"
    }
    client.post("/api/auth/register", json=user_data)

    # Login
    login_response = client.post(
        "/api/auth/login",
        data={
            "username": "purchase@example.com",
            "password": "purchasepass123"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # Create UNIQUE sweet
    unique_name = f"Gummy Bears {uuid.uuid4()}"

    sweet_data = {
        "name": unique_name,
        "category": "Gummies",
        "price": 1.99,
        "quantity": 100
    }

    create_response = client.post(
        "/api/sweets/create",
        json=sweet_data,
        headers=auth_headers,
    )

    assert create_response.status_code == 200
    sweet_id = create_response.json()["id"]

    # Purchase sweets
    purchase_data = {"quantity": 5}

    response = client.post(
        f"/api/sweets/{sweet_id}/purchase",
        json=purchase_data,
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["quantity"] == 95


def test_restock_sweet():
    # Ensure admin exists and is admin
    db = SessionLocal()
    admin_user = db.query(User).filter(User.email == "gagan@example.com").first()
    assert admin_user is not None
    admin_user.is_admin = 1
    db.commit()
    db.close()

    # Login as admin
    login_response = client.post(
        "/api/auth/login",
        data={
            "username": "johndoe@john.com",
            "password": "12345"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # Create UNIQUE sweet
    unique_name = f"Sour Patch {uuid.uuid4()}"

    sweet_data = {
        "name": unique_name,
        "category": "Sour",
        "price": 2.49,
        "quantity": 20
    }

    create_response = client.post(
        "/api/sweets/create",
        json=sweet_data,
        headers=auth_headers,
    )

    assert create_response.status_code == 200
    sweet_id = create_response.json()["id"]

    # Restock sweet
    restock_data = {"quantity": 30}

    response = client.post(
        f"/api/sweets/{sweet_id}/restock",
        json=restock_data,
        headers=auth_headers,
    )

    assert response.status_code == 200
    assert response.json()["quantity"] == 50

    # Verify in DB
    db = SessionLocal()
    updated_sweet = db.query(Sweet).filter(Sweet.id == sweet_id).first()
    db.close()

    assert updated_sweet.quantity == 50
