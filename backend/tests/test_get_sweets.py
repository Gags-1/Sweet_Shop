from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_all_sweets_unauthorized():
    response = client.get("/api/sweets")

    assert response.status_code == 401


from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_all_sweets():
    # Register user
    user_data = {
        "username": "listuser",
        "email": "list@example.com",
        "password": "listpass123"
    }
    client.post("/api/auth/register", json=user_data)

    # Login (OAuth2 form data)
    login_response = client.post(
        "/api/auth/login",
        data={
            "username": "list@example.com",
            "password": "listpass123",
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    token = login_response.json()["access_token"]

    # Create a sweet first
    sweet_data = {
        "name": "Ladoo",
        "category": "Indian",
        "price": 10.0,
        "quantity": 100
    }

    client.post(
        "/api/sweets/create",
        json=sweet_data,
        headers={"Authorization": f"Bearer {token}"},
    )

    # Get all sweets
    response = client.get(
        "/api/sweets",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    body = response.json()

    assert isinstance(body, list)
    assert len(body) >= 1
    names = [sweet["name"] for sweet in body]
    assert "Ladoo" in names
