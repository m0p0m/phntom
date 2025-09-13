# Files API

This document outlines the API endpoints for managing file metadata. All endpoints are protected and require a valid JWT token.

---

## 1. Get File Metadata for a Device

Retrieves a list of all file metadata records for a specific device. Can optionally filter by a base path.

- **URL:** `/api/devices/:deviceId/files`
- **Method:** `GET`
- **Access:** `Private`

### URL Parameters
- `deviceId` (String, required): The `_id` of the device.

### Query Parameters
- `filePath` (String, optional): Filter by exact file path. To filter by directory, you can use `filePath[regex]=^/DCIM/Camera`.
- `select` (String): Comma-separated list of fields to include.
- `sort` (String): Field to sort by (e.g., `sort=filePath`).
- `page` (Number): Page number for pagination.
- `limit` (Number): Number of results per page.

### Success Response
- **Code:** `200 OK`
- **Content:** A paginated object containing an array of file metadata objects.

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
      "fileName": "IMG_2023.jpg",
      "filePath": "/DCIM/Camera/IMG_2023.jpg",
      "fileType": "image/jpeg",
      "size": 4500000,
      "storageUrl": "https://s3.example.com/device-123/IMG_2023.jpg",
      "createdAt": "2023-01-02T10:00:00.000Z",
      "updatedAt": "2023-01-02T10:00:00.000Z"
    }
  ]
}
```

---

## 2. Add New File Metadata

Adds a new file metadata record to the database for a specific device.

- **URL:** `/api/devices/:deviceId/files`
- **Method:** `POST`
- **Access:** `Private`

### URL Parameters
- `deviceId` (String, required): The `_id` of the device.

### Request Body

```json
{
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

---

## 4. Upload a File

Uploads a file directly to the server. The request must be `multipart/form-data`.

- **URL:** `/api/devices/:deviceId/files/upload`
- **Method:** `POST`
- **Access:** `Private`

### Form Data
- `file`: The file to be uploaded.

### Success Response
- **Code:** `201 Created`
- **Content:** An object containing a success message and the new file metadata record.
```json
{
    "message": "File uploaded successfully",
    "file": {
        "device": "60d5f1b4e6b3f1a1b8f3a3a1",
        "fileName": "my-test-file.txt",
        "filePath": "/my-test-file.txt",
        "fileType": "text/plain",
        "size": 123,
        "storageUrl": "/uploads/file-1624634301234.txt",
        "_id": "60d5f1b4e6b3f1a1b8f3a3a2",
        "createdAt": "2023-10-27T10:05:00.000Z",
        "updatedAt": "2023-10-27T10:05:00.000Z"
    }
}
```
