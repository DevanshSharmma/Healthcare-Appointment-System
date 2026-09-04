def get_auth_token(client, email, password):
    res = client.post("/api/auth/login", json={"email": email, "password": password})
    return res.json()["access_token"]

def test_medical_record_and_prescription_flow(client):
    token_doctor = get_auth_token(client, "sarah.jenkins@healthcare.com", "Password123!")
    headers_doctor = {"Authorization": f"Bearer {token_doctor}"}

    token_patient = get_auth_token(client, "john.doe@patient.com", "Password123!")
    headers_patient = {"Authorization": f"Bearer {token_patient}"}

    # Appointment #1 in seed data is already completed for John Doe and Dr. Sarah Jenkins
    # Create another prescription or medical record check
    res_records = client.get("/api/medical-records/patient/1", headers=headers_patient)
    assert res_records.status_code == 200
    rec_data = res_records.json()
    assert rec_data["total"] >= 1
    assert "diagnosis" in rec_data["records"][0]
    assert "symptoms" in rec_data["records"][0]

    # Check prescriptions
    res_rx = client.get("/api/prescriptions/patient/1", headers=headers_patient)
    assert res_rx.status_code == 200
    rx_data = res_rx.json()
    assert rx_data["total"] >= 1
    assert len(rx_data["prescriptions"][0]["items"]) >= 1
    item0 = rx_data["prescriptions"][0]["items"][0]
    assert "medicine_name" in item0
    assert "dosage" in item0
    assert "frequency" in item0
