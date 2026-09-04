import pytest

def test_login_patient(client):
    res = client.post("/api/auth/login", json={
        "email": "john.doe@patient.com",
        "password": "Password123!"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "PATIENT"
    assert data["email"] == "john.doe@patient.com"

def test_login_doctor(client):
    res = client.post("/api/auth/login", json={
        "email": "sarah.jenkins@healthcare.com",
        "password": "Password123!"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "DOCTOR"
    assert data["doctor_id"] is not None

def test_login_admin(client):
    res = client.post("/api/auth/login", json={
        "email": "admin@healthcare.com",
        "password": "Password123!"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "ADMIN"

def test_login_invalid_password(client):
    res = client.post("/api/auth/login", json={
        "email": "admin@healthcare.com",
        "password": "WrongPassword!"
    })
    assert res.status_code == 401

def test_patient_registration(client):
    res = client.post("/api/auth/register", json={
        "email": "new.patient@test.com",
        "password": "Password123!",
        "full_name": "New Test Patient",
        "phone": "+1 555 999 1234",
        "role": "PATIENT",
        "blood_group": "O+"
    })
    assert res.status_code == 201
    data = res.json()
    assert data["role"] == "PATIENT"
    assert "access_token" in data
