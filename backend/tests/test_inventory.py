from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_purchase_sweet():
    # Register user
    user_data = {
        "username": "purchaseuser",
        "email": "purchase@example.com",
        "password": "purchasepass123"
    }
    client.post("/api/auth/register", json=user_data)

    # Login (OAuth2 form data)
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

    # Create sweet
    sweet_data = {
        "name": "Gummy Bears",
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


from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_restock_sweet():
    # Register user
    user_data = {
        "username": "restockuser",
        "email": "restock@example.com",
        "password": "restockpass123"
    }
    client.post("/api/auth/register", json=user_data)

    # Login (OAuth2 form data)
    login_response = client.post(
        "/api/auth/login",
        data={
            "username": "restock@example.com",
            "password": "restockpass123"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    auth_headers = {"Authorization": f"Bearer {token}"}

    # Create sweet
    sweet_data = {
        "name": "Sour Patch",
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
    assert response.json()["quantity"] == 50  # 20 + 30
