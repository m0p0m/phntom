# Call Logs API

This document outlines the API endpoints for managing a device's call logs. All endpoints are protected.

---

## 1. Get Call Logs for a Device

Retrieves a list of all call logs for a specific device, sorted by the most recent call date.

- **URL:** `/api/call-logs/:deviceId`
- **Method:** `GET`
- **Access:** `Private`

### URL Parameters
- `deviceId` (String, required): The ID of the device.

### Success Response
- **Code:** `200 OK`
- **Content:** An array of call log objects.

```json
[
  {
    "_id": "60d5f1b4e6b3f1a1b8f3a3a1",
    "deviceId": "device-123",
    "phoneNumber": "+1-555-123-4567",
    "type": "INCOMING",
    "duration": 120,
    "callDate": "2023-10-27T10:00:00.000Z",
    "createdAt": "2023-10-27T10:02:00.000Z",
    "updatedAt": "2023-10-27T10:02:00.000Z"
  }
]
```

---

## 2. Add a New Call Log

Adds a new call log record to the database. This would typically be sent from the device after a call has ended.

- **URL:** `/api/call-logs`
- **Method:** `POST`
- **Access:** `Private`

### Request Body

```json
{
  "deviceId": "device-123",
  "phoneNumber": "+1-555-987-6543",
  "type": "OUTGOING",
  "duration": 300,
  "callDate": "2023-10-27T11:00:00.000Z"
}
```

### Success Response

- **Code:** `201 Created`
- **Content:** The newly created call log object.

### Error Responses
- **Code:** `400 Bad Request` if required fields are missing.
- **Code:** `401 Unauthorized` if the token is missing or invalid.
