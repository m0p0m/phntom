# Authentication API

This document outlines the API endpoints related to user authentication.

---

## Login User

Authenticates a user and returns a JSON Web Token (JWT) if the credentials are valid.

- **URL:** `/api/auth/login`
- **Method:** `POST`
- **Access:** `Public`

### Request Body

The request body must be a JSON object with the following fields:

```json
{
  "username": "your_admin_username",
  "password": "your_admin_password"
}
```

- `username` (String, required): The admin username.
- `password` (String, required): The admin password.

### Success Response

- **Code:** `200 OK`
- **Content:**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Response

If the credentials are incorrect:

- **Code:** `401 Unauthorized`
- **Content:**

```json
{
  "message": "Invalid username or password"
}
```
