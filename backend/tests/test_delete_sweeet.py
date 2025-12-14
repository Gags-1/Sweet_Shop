from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_delete_sweet():
    # Register user
    user_data = {
        "username": "deleteuser",
        "email": "delete@example.com",
        "password": "deletepass123"
    }
    client.post("/api/auth/register", json=user_data)

    # Login
    login_response = client.post(
        "/api/auth/login",
        data={
            "username": "delete@example.com",
            "password": "deletepass123"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token = login_response.json()["access_token"]

    auth_headers = {"Authorization": f"Bearer {token}"}

    # Create a sweet
    sweet_data = {
        "name": "Gulab Jamun",
        "category": "Indian",
        "price": 15.0,
        "quantity": 20
    }

    create_response = client.post(
        "/api/sweets/create",
        json=sweet_data,
        headers=auth_headers,
    )

    sweet_id = create_response.json()["id"]

    # Delete the sweet
    delete_response = client.delete(
        f"/api/sweets/{sweet_id}",
        headers=auth_headers,
    )

    assert delete_response.status_code == 200
    assert delete_response.json()["message"] == "Sweet deleted successfully"

    # Verify deletion
    get_response = client.get(
        f"/api/sweets/{sweet_id}",
        headers=auth_headers,
    )
    assert get_response.status_code == 404
