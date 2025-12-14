
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_sweet():
    """Test creating a sweet - This will FAIL initially"""
    # First register and login
    user_data = {
        "username": "sweetuser",
        "email": "sweet@example.com",
        "password": "sweetpass123"
    }
    client.post("/api/auth/register", json=user_data)
    
    # login_data = {
    #     "username": "sweet@example.com",
    #     "password": "sweetpass123"
    # }
    response = client.post(
        "/api/auth/login",
        data={
            "username": "sweet@example.com", 
            "password": "sweetpass123"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token = response.json()["access_token"]
    
    # Try to create a sweet
    sweet_data = {
        "name": "Chocolate Bar",
        "category": "Chocolate",
        "price": 2.99,
        "quantity": 50
    }
    
    response = client.post(
        "/api/sweets/create",
        json=sweet_data,
        headers={"Authorization": f"Bearer {token}"},
    )
    
    # These will FAIL initially
    assert response.status_code == 200
    assert response.json()["name"] == "Chocolate Bar"
    assert response.json()["category"] == "Chocolate"