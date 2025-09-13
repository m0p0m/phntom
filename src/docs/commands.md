# Commands API

This document outlines the API endpoints for sending commands to a device. All endpoints are protected.

---

## 1. Queue a New Command

Adds a new command to the queue for a specific device.

- **URL:** `/api/commands/:deviceId`
- **Method:** `POST`
- **Access:** `Private` (Intended for an admin user)

### URL Parameters
- `deviceId` (String, required): The ID of the target device.

### Request Body
```json
{
  "type": "SHOW_MESSAGE",
  "payload": {
    "title": "Message from Admin",
    "message": "Please contact support."
  }
}
```
- `type` (String, required): The type of command. Enum: `RING`, `SHOW_MESSAGE`, `WIPE_DATA`.
- `payload` (Object, optional): Any data the device needs to execute the command.

### Success Response
- **Code:** `201 Created`
- **Content:** The newly created command object.

---

## 2. Get Pending Commands

Used by a device to fetch its queue of pending commands.

- **URL:** `/api/commands/:deviceId/pending`
- **Method:** `GET`
- **Access:** `Private` (Intended for the device agent)

### URL Parameters
- `deviceId` (String, required): The ID of the device checking for commands.

### Success Response
- **Code:** `200 OK`
- **Content:** An array of pending command objects.

---

## 3. Update Command Status

Used by a device to report the result of a command execution.

- **URL:** `/api/commands/:commandId`
- **Method:** `PUT`
- **Access:** `Private` (Intended for the device agent)

### URL Parameters
- `commandId` (String, required): The `_id` of the command being updated.

### Request Body
```json
{
  "status": "EXECUTED"
}
```
or
```json
{
  "status": "FAILED",
  "errorMessage": "User did not have permission."
}
```

### Success Response
- **Code:** `200 OK`
- **Content:** The updated command object.
