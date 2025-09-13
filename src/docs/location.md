# Location API

This document outlines the API endpoints for managing device location data. All endpoints are protected and require a valid JWT token.

---

## 1. Update Device Location

Creates or updates the last known location for a specific device. This endpoint uses an "upsert" operation: if a location document for the `deviceId` exists, it's updated; otherwise, a new one is created.

- **URL:** `/api/location`
- **Method:** `POST`
- **Access:** `Private`

### Request Body

```json
{
  "deviceId": "device-123",
  "latitude": 34.052235,
  "longitude": -118.243683,
  "timestamp": "2023-10-27T10:00:00Z"
}
```
- `timestamp` (Date, optional): The ISO 8601 timestamp of when the location was recorded. Defaults to the current time if not provided.

### Success Response

- **Code:** `200 OK`
- **Content:** The created or updated location object.

### Error Responses
- **Code:** `400 Bad Request` if required fields (`deviceId`, `latitude`, `longitude`) are missing.
- **Code:** `401 Unauthorized` if the token is missing or invalid.

---

## 2. Get Latest Device Location

Retrieves the last known location for a specific device.

- **URL:** `/api/location/:deviceId`
- **Method:** `GET`
- **Access:** `Private`

### URL Parameters

- `deviceId` (String, required): The ID of the device.

### Success Response

- **Code:** `200 OK`
- **Content:** The location object.

```json
{
    "_id": "653b9f3e8f8a8b8e8a8b8e8a",
    "deviceId": "device-123",
    "latitude": 34.052235,
    "longitude": -118.243683,
    "timestamp": "2023-10-27T10:00:00.000Z",
    "createdAt": "2023-10-27T10:00:00.000Z",
    "updatedAt": "2023-10-27T10:00:00.000Z"
}
```

### Error Responses

- **Code:** `404 Not Found` if no location data exists for the specified device.
- **Code:** `401 Unauthorized` if the token is missing or invalid.
