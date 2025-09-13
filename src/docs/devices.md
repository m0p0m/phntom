# Devices API & Real-time Events

This document outlines the API endpoints and WebSocket events for device management.

---

## REST API Endpoints

All endpoints are protected and require a valid JWT token.

### 1. Get All Registered Devices

Retrieves a list of all devices and their last known specifications.

- **URL:** `/api/devices`
- **Method:** `GET`
- **Access:** `Private`

### Success Response
- **Code:** `200 OK`
- **Content:** An array of device objects. The `status` field is a virtual property calculated on the fly.

```json
[
  {
    "_id": "60d5f1b4e6b3f1a1b8f3a3a1",
    "uniqueIdentifier": "android-device-uuid-123",
    "deviceName": "Pixel 5",
    "platform": "android",
    "storage": { "total": 128, "free": 50 },
    "ram": { "total": 8, "free": 3 },
    "ipAddress": "192.168.1.100",
    "lastSeen": "2023-10-27T10:00:00.000Z",
    "createdAt": "2023-10-27T09:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z",
    "status": "online"
  }
]
```

### 2. Register a New Device

Used by a device agent to register itself with the server for the first time.

- **URL:** `/api/devices/register`
- **Method:** `POST`
- **Access:** `Private`

### Request Body
```json
{
  "uniqueIdentifier": "android-device-uuid-123",
  "deviceName": "Pixel 5",
  "platform": "android",
  "storage": { "total": 128, "free": 60 },
  "ram": { "total": 8, "free": 4 }
}
```

### 3. Send Device Heartbeat

Used by a device agent to periodically report its status and update dynamic information.

- **URL:** `/api/devices/heartbeat`
- **Method:** `POST`
- **Access:** `Private`

### Request Body
```json
{
  "uniqueIdentifier": "android-device-uuid-123",
  "storage": { "free": 55 },
  "ram": { "free": 3.5 }
}
```

---

## WebSocket Events

The server emits events that a client dashboard can listen to for real-time updates.

### `device:registered`
- **Description:** Emitted when a new device successfully registers.
- **Payload:** The full device object of the newly registered device.

### `device:status_update`
- **Description:** Emitted whenever a device sends a heartbeat, updating its status.
- **Payload:** The full, updated device object.
