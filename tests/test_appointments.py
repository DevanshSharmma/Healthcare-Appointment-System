from datetime import datetime, timedelta

def get_auth_token(client, email, password):
    res = client.post("/api/auth/login", json={"email": email, "password": password})
    return res.json()["access_token"]

def test_doctor_availability_slots(client):
    # Find next Monday (weekday 0)
    today = datetime.now().date()
    target = today + timedelta(days=(7 - today.weekday()) % 7 or 7)
    date_str = target.strftime("%Y-%m-%d")

    res = client.get(f"/api/availability/doctor/1/slots?date={date_str}")
    assert res.status_code == 200
    data = res.json()
    assert data["is_working_day"] is True
    assert len(data["slots"]) > 0
    # Every slot must have time and availability flag
    assert "time" in data["slots"][0]
    assert "is_available" in data["slots"][0]

def test_appointment_lifecycle(client):
    token_patient = get_auth_token(client, "john.doe@patient.com", "Password123!")
    headers_patient = {"Authorization": f"Bearer {token_patient}"}

    token_doctor = get_auth_token(client, "sarah.jenkins@healthcare.com", "Password123!")
    headers_doctor = {"Authorization": f"Bearer {token_doctor}"}

    today = datetime.now().date()
    # Next Tuesday
    days_ahead = (1 - today.weekday()) % 7 or 7
    target = today + timedelta(days=days_ahead)
    date_str = target.strftime("%Y-%m-%d")

    # Step 1: Book Appointment (PENDING)
    res_book = client.post(
        "/api/appointments",
        headers=headers_patient,
        json={
            "doctor_id": 1,
            "appointment_date": date_str,
            "appointment_time": "14:30",
            "reason": "Cardiology annual checkup and test."
        }
    )
    assert res_book.status_code == 201
    appt = res_book.json()
    appt_id = appt["id"]
    assert appt["status"] == "PENDING"

    # Step 2: Doctor confirms appointment (CONFIRMED)
    res_confirm = client.put(
        f"/api/appointments/{appt_id}/status",
        headers=headers_doctor,
        json={
            "status": "CONFIRMED",
            "doctor_notes": "Confirmed. Fasting required for 8 hours prior."
        }
    )
    assert res_confirm.status_code == 200
    assert res_confirm.json()["status"] == "CONFIRMED"

    # Step 3: Doctor completes appointment (COMPLETED)
    res_complete = client.put(
        f"/api/appointments/{appt_id}/status",
        headers=headers_doctor,
        json={
            "status": "COMPLETED",
            "doctor_notes": "Consultation finished. Vitals normal."
        }
    )
    assert res_complete.status_code == 200
    assert res_complete.json()["status"] == "COMPLETED"
