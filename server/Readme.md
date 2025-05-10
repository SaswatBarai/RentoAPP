# Authentication API Documentation

This document describes the authentication endpoints and how frontend developers should interact with them.

## Base URL
All endpoints are prefixed with:
```
http://<HOST>:<PORT>/api/auth/user
```

## Endpoints

### 1. Register User
- **URL:** `POST /register`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "fullname": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "statusCode": 201,
    "data": {
      "_id": "605c...eaf",
      "fullname": "John Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "role": "user",
      "bookings": []
    },
    "message": "User register successfully",
    "succees": true
  }
  ```
- **Error Responses:**
  - **400 Bad Request** (missing or invalid fields)
    ```json
    {
      "statusCode": 400,
      "message": "All fields are required",
      "succees": false
    }
    ```
  - **500 Server Error**
    ```json
    {
      "statusCode": 500,
      "message": "Server Failed",
      "succees": false
    }
    ```

### 2. Login User
- **URL:** `POST /login`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Behavior:**
  - On success, sets two HTTP-only, secure cookies: `accessToken` and `refreshToken`.
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "user": {
        "_id": "605c...eaf",
        "fullname": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "role": "user",
        "bookings": []
      },
      "accessToken": "<JWT_ACCESS_TOKEN>",
      "refreshToken": "<JWT_REFRESH_TOKEN>"
    },
    "message": "Successfully Login",
    "succees": true
  }
  ```
- **Error Responses:**
  - **401 Unauthorized** (invalid credentials)
    ```json
    {
      "statusCode": 401,
      "message": "Invalid credentials",
      "succees": false
    }
    ```
  - **500 Server Error**

### 3. Refresh Access Token
- **URL:** `POST /get-accessToken`
- **Headers:**
  - `Content-Type: application/json`
- **Request:**
  - Include one of the following:
    - HTTP-only cookie `refreshToken`
    - Request body JSON `{ "refreshToken": "<TOKEN>" }`
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "data": {
      "accessToken": "<NEW_JWT_ACCESS_TOKEN>",
      "refreshToken": "<NEW_JWT_REFRESH_TOKEN>"
    },
    "message": "Access token refreshed",
    "succees": true
  }
  ```
- **Error Responses:**
  - **401 Unauthorized** (missing or invalid token)
    ```json
    {
      "statusCode": 401,
      "message": "Unauthorized request",
      "succees": false
    }
    ```

### 4. Google OAuth
- **Initiate OAuth Flow**
  - **URL:** GET `/google`
  - **Description:** Redirects the user to Google’s consent screen with `profile` and `email` scopes.

- **Callback Endpoint**
  - **URL:** GET `/google/callback`
  - **Description:** Handles Google’s response. Passport verifies and then calls `googleCallback`:
    - Sets HTTP-only, secure cookies: `accessToken`, `refreshToken`.
    - Returns a JSON response:
      ```json
      {
        "statusCode": 200,
        "data": {
          "user": { /* user details */ },
          "accessToken": "<JWT_ACCESS_TOKEN>",
          "refreshToken": "<JWT_REFRESH_TOKEN>"
        },
        "message": "Successfully Login",
        "success": true
      }
      ```
  - **Failure Redirect:** Redirects to `/login` on authentication failure.

#### Frontend Integration
Redirect the browser to the backend endpoint to start the flow. Example:
```html
<a href="http://localhost:5000/api/auth/user/google">
  <button>Sign in with Google</button>
</a>
```

### 5. Logout
- **URL:** `GET /logout`
- **Headers:**
  - Include valid `accessToken` cookie or `Authorization: Bearer <TOKEN>` header.
- **Success Response (200):**
  ```json
  {
    "statusCode": 200,
    "data": {},
    "message": "Logged out successfully",
    "succees": true
  }
  ```
- **Error Responses:**
  - **500 Server Error**

## Frontend Integration Guide

Use `fetch` or `axios` with `credentials: 'include'` to handle cookies.

#### Example using `fetch`
```javascript
fetch('http://localhost:5000/api/auth/user/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email: 'john@example.com', password: 'password123' })
})
  .then(async res => {
    const body = await res.json();
    if (!res.ok) throw new Error(body.message);
    console.log('Logged in user:', body.data.user);
  })
  .catch(err => console.error('Error:', err.message));
```

#### Example using `axios`
```javascript
import axios from 'axios';
axios.defaults.withCredentials = true;

axios.post('http://localhost:5000/api/auth/user/register', {
  fullname: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  password: 'password123'
})
.then(response => console.log(response.data))
.catch(error => console.error(error.response.data));
```

## Error Format
All error responses follow:
```json
{
  "statusCode": <HTTP_STATUS_CODE>,
  "message": "<Error message>",
  "succees": false
}
```

## Common Error Messages
- "All fields are required" (400)
- "Invalid credentials" (401)
- "Unauthorized request" (401)
- "Invalid refresh token" (401)
- "Server Failed" (500)

---

_End of authentication documentation._