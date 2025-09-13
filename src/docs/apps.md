# Installed Apps API

This document outlines the API endpoints for managing a device's list of installed applications. All endpoints are protected.

---

## 1. Get Installed Apps for a Device

Retrieves the last known list of installed applications for a specific device.

- **URL:** `/api/apps/:deviceId`
- **Method:** `GET`
- **Access:** `Private`

### URL Parameters
- `deviceId` (String, required): The ID of the device.

### Success Response
- **Code:** `200 OK`
- **Content:** An array of installed app objects.

```json
[
  {
    "_id": "60d5f1b4e6b3f1a1b8f3a3a1",
    "deviceId": "device-123",
    "appName": "Example App",
    "packageName": "com.example.app",
    "version": "1.2.3",
    "installedAt": "2023-01-01T12:00:00.000Z",
    "createdAt": "2023-01-02T10:00:00.000Z",
    "updatedAt": "2023-01-02T10:00:00.000Z"
  }
]
```

---

## 2. Synchronize Installed Apps

Receives a complete list of installed applications from a device. The backend will then synchronize its database with this list by adding new apps, updating existing ones, and removing any apps that are no longer on the device.

- **URL:** `/api/apps/sync`
- **Method:** `POST`
- **Access:** `Private`

### Request Body

```json
{
  "deviceId": "device-123",
  "apps": [
    {
      "appName": "Example App",
      "packageName": "com.example.app",
      "version": "1.2.4",
      "installedAt": "2023-01-01T12:00:00.000Z"
    },
    {
      "appName": "New Utility",
      "packageName": "com.utility.new",
      "version": "1.0.0",
      "installedAt": "2023-10-27T10:00:00.000Z"
    }
  ]
}
```

### Success Response

- **Code:** `200 OK`
- **Content:**
```json
{
  "message": "Sync successful"
}
```

### Error Responses
- **Code:** `400 Bad Request` if `deviceId` or `apps` array is missing.
- **Code:** `401 Unauthorized` if the token is missing or invalid.
