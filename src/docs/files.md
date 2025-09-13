# Files API

This document outlines the API endpoints for managing file metadata. All endpoints are protected and require a valid JWT token.

---

## 1. Get File Metadata for a Device

Retrieves a list of all file metadata records for a specific device. Can optionally filter by a base path.

- **URL:** `/api/files/:deviceId`
- **Method:** `GET`
- **Access:** `Private`

### URL Parameters
- `deviceId` (String, required): The ID of the device.

### Query Parameters
- `path` (String, optional): A base path to filter files. For example, `/api/files/device-123?path=/DCIM/Camera` would return all files within that directory.

### Success Response
- **Code:** `200 OK`
- **Content:** An array of file metadata objects.

```json
[
  {
    "_id": "60d5f1b4e6b3f1a1b8f3a3a1",
    "deviceId": "device-123",
    "fileName": "IMG_2023.jpg",
    "filePath": "/DCIM/Camera/IMG_2023.jpg",
    "fileType": "image/jpeg",
    "size": 4500000,
    "storageUrl": "https://s3.example.com/device-123/IMG_2023.jpg",
    "createdAt": "2023-01-02T10:00:00.000Z",
    "updatedAt": "2023-01-02T10:00:00.000Z"
  }
]
```

---

## 2. Add New File Metadata

Adds a new file metadata record to the database.

- **URL:** `/api/files`
- **Method:** `POST`
- **Access:** `Private`

### Request Body

```json
{
  "deviceId": "device-123",
  "fileName": "report.pdf",
  "filePath": "/Documents/report.pdf",
  "fileType": "application/pdf",
  "size": 120000,
  "storageUrl": "https://s3.example.com/device-123/report.pdf"
}
```

### Success Response

- **Code:** `201 Created`
- **Content:** The newly created file metadata object.

### Error Responses
- **Code:** `400 Bad Request` if required fields are missing.
- **Code:** `400 Bad Request` if the `filePath` already exists for the device.
- **Code:** `401 Unauthorized` if the token is missing or invalid.

---

## 3. Delete File Metadata

Removes a file metadata record from the database. Note: This does not delete the file from the actual storage (e.g., S3).

- **URL:** `/api/files/:id`
- **Method:** `DELETE`
- **Access:** `Private`

### URL Parameters
- `id` (String, required): The `_id` of the file metadata record to delete.

### Success Response

- **Code:** `200 OK`
- **Content:**
```json
{
  "id": "60d5f1b4e6b3f1a1b8f3a3a1",
  "message": "File metadata removed"
}
```

### Error Responses
- **Code:** `404 Not Found` if the metadata record does not exist.
- **Code:** `401 Unauthorized` if the token is missing or invalid.
