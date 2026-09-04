from datetime import datetime, timedelta

def test_double_booking_prevention(client):
    # Log in patient
    res_login = client.post("/api/auth/login", json={"email": "john.doe@patient.com", "password": "Password123!"})
    token = res_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    today = datetime.now().date()
    # Pick next Wednesday
    days_ahead = (2 - today.weekday()) % 7 or 7
    target = today + timedelta(days=days_ahead)
    date_str = target.strftime("%Y-%m-%d")
    slot_time = "15:00"

    # 1. First booking attempt -> MUST SUCCEED
    res1 = client.post(
        "/api/appointments",
        headers=headers,
        json={
            "doctor_id": 1,
            "appointment_date": date_str,
            "appointment_time": slot_time,
            "reason": "First appointment attempt"
        }
    )
    assert res1.status_code == 201
    assert res1.json()["status"] == "PENDING"

    # 2. Immediate duplicate booking attempt for the exact same slot -> MUST FAIL WITH 409 CONFLICT
    res2 = client.post(
        "/api/appointments",
        headers=headers,
        json={
            "doctor_id": 1,
            "appointment_date": date_str,
            "appointment_time": slot_time,
            "reason": "Duplicate collision attempt"
        }
    )
    assert res2.status_code == 409
    data2 = res2.json()
    assert "detail" in data2
    assert "already booked" in data2["detail"].lower() or "conflict" in data2["detail"].lower()
