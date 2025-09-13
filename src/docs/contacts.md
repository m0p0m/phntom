# Contacts API

This document outlines the API endpoints for managing contacts. All endpoints are protected and require a valid JWT token in the `Authorization` header.

---

## 1. Get All Contacts

Retrieves a list of all contacts.

- **URL:** `/api/contacts`
- **Method:** `GET`
- **Access:** `Private`

### Query Parameters

- `select` (String): Comma-separated list of fields to include in the result. Example: `?select=name,phoneNumber`
- `sort` (String): Field to sort by. Add a `-` prefix for descending order. Example: `?sort=-createdAt`
- `page` (Number): Page number for pagination. Default: `1`.
- `limit` (Number): Number of results per page. Default: `25`.

### Success Response

- **Code:** `200 OK`
- **Content:** A paginated object containing an array of contact objects.

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
      "name": "Jules Verne",
      "phoneNumber": "+1234567890",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 2. Create a New Contact

Adds a new contact to the database.

- **URL:** `/api/contacts`
- **Method:** `POST`
- **Access:** `Private`

### Request Body

```json
{
  "name": "John Doe",
  "phoneNumber": "+0987654321",
  "deviceId": "device-456"
}
```

### Success Response

- **Code:** `201 Created`
- **Content:** The newly created contact object.

### Error Responses

- **Code:** `400 Bad Request` if required fields are missing.
- **Code:** `400 Bad Request` if the phone number already exists for the given device.
- **Code:** `401 Unauthorized` if the token is missing or invalid.

---

## 3. Get a Single Contact

Retrieves a specific contact by its ID.

- **URL:** `/api/contacts/:id`
- **Method:** `GET`
- **Access:** `Private`

### Success Response

- **Code:** `200 OK`
- **Content:** The contact object.

### Error Responses

- **Code:** `404 Not Found` if the contact with the specified ID does not exist.
- **Code:** `401 Unauthorized` if the token is missing or invalid.

---

## 4. Update a Contact

Updates the details of a specific contact.

- **URL:** `/api/contacts/:id`
- **Method:** `PUT`
- **Access:** `Private`

### Request Body

Any subset of the contact's fields.

```json
{
  "name": "John Doe Updated"
}
```

### Success Response

- **Code:** `200 OK`
- **Content:** The updated contact object.

### Error Responses

- **Code:** `404 Not Found` if the contact does not exist.
- **Code:** `401 Unauthorized` if the token is missing or invalid.

---

## 5. Delete a Contact

Removes a contact from the database.

- **URL:** `/api/contacts/:id`
- **Method:** `DELETE`
- **Access:** `Private`

### Success Response

- **Code:** `200 OK`
- **Content:**

```json
{
  "id": "60d5f1b4e6b3f1a1b8f3a3a1",
  "message": "Contact removed"
}
```

### Error Responses

- **Code:** `404 Not Found` if the contact does not exist.
- **Code:** `401 Unauthorized` if the token is missing or invalid.
