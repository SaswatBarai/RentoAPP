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

Configure your frontend to communicate securely with the Auth API:

1. Set your base URL in `.env`:
```env
VITE_API_URL=http://localhost:5000/api/auth/user
```

2. Use the shared Axios instance (`client/src/services/auth.service.js`):
```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;
const api = axios.create({ baseURL: API_URL });

// Attach Authorization header from localStorage
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api;
```

3. Register a new user:
```javascript
import api from './auth.service';

const register = async (user) => {
  const response = await api.post('/register', user);
  return response.data.data;  // created user object
};
```

4. Login and store tokens:
```javascript
const login = async (credentials) => {
  const response = await api.post('/login', credentials);
  const { accessToken, refreshToken, user } = response.data.data;
  localStorage.setItem('accessToken', accessToken);
  return user;
};
```

5. Refresh access token:
```javascript
const refresh = async () => {
  const response = await api.post('/get-accessToken');
  const { accessToken, refreshToken } = response.data.data;
  localStorage.setItem('accessToken', accessToken);
  return accessToken;
};
```

6. Google OAuth flow:
```javascript
const googleSignIn = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/google`;
};
```

7. Logout:
```javascript
const logout = async () => {
  await api.get('/logout');
  localStorage.removeItem('accessToken');
};
```

8. Optional React hook for data fetching (`useFetch` in `auth.service.js`):
```javascript
const [data, loading, error] = useFetch('/some-protected-route', { method: 'GET' });
```

This setup ensures HTTP-only cookies for refresh flows, a persistent access token header, and simple calls for all auth endpoints.

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