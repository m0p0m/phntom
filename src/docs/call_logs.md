# Call Logs API

This document outlines the API endpoints for managing a device's call logs. All endpoints are protected.

---

## 1. Get Call Logs for a Device

Retrieves a list of all call logs for a specific device, sorted by the most recent call date.

- **URL:** `/api/devices/:deviceId/call-logs`
- **Method:** `GET`
- **Access:** `Private`

### URL Parameters
- `deviceId` (String, required): The `_id` of the device.

### Query Parameters
- `select` (String): Comma-separated list of fields to include.
- `sort` (String): Field to sort by (e.g., `sort=-callDate`).
- `page` (Number): Page number for pagination.
- `limit` (Number): Number of results per page.

### Success Response
- **Code:** `200 OK`
- **Content:** A paginated object containing an array of call log objects.

```json
{
  "success": true,
  "count": 1,
  "pagination": {
    "total": 1,
    "pages": 1,
    "currentPage": 1
  },
  "data": [
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
}
```

---

## 2. Add a New Call Log

Adds a new call log record to the database for a specific device. This would typically be sent from the device after a call has ended.

- **URL:** `/api/devices/:deviceId/call-logs`
- **Method:** `POST`
- **Access:** `Private`

### URL Parameters
- `deviceId` (String, required): The `_id` of the device.

### Request Body

```json
{
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
