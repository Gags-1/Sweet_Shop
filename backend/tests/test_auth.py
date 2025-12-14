from fastapi.testclient import TestClient
from app.main import app
client = TestClient(app)

def test_register_user():
    """Test user registration - This will FAIL initially"""
    user_data = {
        "username": "testuser2",
        "email": "test@example2.com", 
        "password": "testpass123"
    }
    
    response = client.post("/api/auth/register", json=user_data)
    
    assert response.status_code == 200
    assert "id" in response.json()
    assert response.json()["email"] == "test@example2.com"

def test_login_user():
    # """Test user login - This will FAIL initially"""
    # First register a user
    user_data = {
        "username": "loginuser",
        "email": "login@example.com",
        "password": "loginpass123"
    }
    client.post("/api/auth/register", json=user_data)
    
    login_data = {
        "username":"loginuser",
        "email": "login@example.com",
        "password": "loginpass123"
    }
    
    response = client.post("/api/auth/login", json=login_data)
    
    assert response.status_code == 200
    assert "access_token" in response.json()