# Gallery API

This document outlines the API endpoints for managing gallery items. All endpoints are protected and require a valid JWT token.

---

## 1. Get Gallery Items for a Device

Retrieves a list of all gallery item metadata for a specific device.

- **URL:** `/api/gallery/:deviceId`
- **Method:** `GET`
- **Access:** `Private`

### URL Parameters

- `deviceId` (String, required): The ID of the device to fetch gallery items for.

### Query Parameters

- `select` (String): Comma-separated list of fields to include.
- `sort` (String): Field to sort by (e.g., `sort=-takenAt`).
- `page` (Number): Page number for pagination.
- `limit` (Number): Number of results per page.

### Success Response

- **Code:** `200 OK`
- **Content:** A paginated object containing an array of gallery item objects.

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
      "imageUrl": "https://example.com/image.jpg",
      "caption": "A beautiful sunset",
      "sourceApp": "Instagram",
      "takenAt": "2023-01-01T18:00:00.000Z",
      "createdAt": "2023-01-02T10:00:00.000Z",
      "updatedAt": "2023-01-02T10:00:00.000Z"
    }
  ]
}
```

---

## 2. Add a New Gallery Item

Adds metadata for a new gallery item to the database.

- **URL:** `/api/gallery`
- **Method:** `POST`
- **Access:** `Private`

### Request Body

```json
{
  "deviceId": "device-123",
  "imageUrl": "https://example.com/new_image.png",
  "caption": "Fun at the beach",
  "sourceApp": "TikTok",
  "takenAt": "2023-07-15T14:30:00.000Z"
}
```

### Success Response

- **Code:** `201 Created`
- **Content:** The newly created gallery item object.

### Error Responses

- **Code:** `400 Bad Request` if required fields (`deviceId`, `imageUrl`) are missing.
- **Code:** `401 Unauthorized` if the token is missing or invalid.
