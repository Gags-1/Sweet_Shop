from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)

def test_register_user():
    """Test user registration - This will FAIL initially"""
    user_data = {
        "username": "testuser",
        "email": "test@example.com", 
        "password": "testpass123"
    }
    
    response = client.post("/api/auth/register", json=user_data)
    
    assert response.status_code == 200
    assert "id" in response.json()
    assert response.json()["email"] == "test@example.com"

def test_login_user():
    # First register a user
    user_data = {
        "username": "loginuser",
        "email": "login@example.com",
        "password": "loginpass123"
    }
    client.post("/api/auth/register", json=user_data)

    # Login MUST use form data now
    response = client.post(
        "/api/auth/login",
        data={
            "username": "login@example.com",  # OAuth2 uses this field name
            "password": "loginpass123"
        },
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )

    assert response.status_code == 200
    assert "access_token" in response.json()