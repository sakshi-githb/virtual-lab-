# API Documentation: VIRTUAL-LAB

This document details the REST API endpoints available on the Express backend server.

---

## 1. Authentication Routes

### Register User
*   **Method**: `POST`
*   **Path**: `/api/auth/register`
*   **Request Body**:
    ```json
    {
      "name": "Isaac Newton",
      "email": "isaac@physics.edu",
      "password": "securepassword123"
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "message": "User registered successfully",
      "token": "eyJhbGciOiJIUzI1Ni..."
    }
    ```

### Login User
*   **Method**: `POST`
*   **Path**: `/api/auth/login`
*   **Request Body**:
    ```json
    {
      "email": "isaac@physics.edu",
      "password": "securepassword123"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1Ni...",
      "user": { "name": "Isaac Newton", "email": "isaac@physics.edu" }
    }
    ```

---

## 2. Experiment CRUD Routes

### List Saved Experiments (Requires Auth Header)
*   **Method**: `GET`
*   **Path**: `/api/experiments`
*   **Headers**: `Authorization: Bearer <JWT_TOKEN>`
*   **Response (200 OK)**:
    ```json
    [
      {
        "_id": "60d5ec4b123456789",
        "title": "Projectile Demo",
        "createdAt": "2026-06-07T10:00:00Z"
      }
    ]
    ```

### Save Sandbox Experiment (Requires Auth Header)
*   **Method**: `POST`
*   **Path**: `/api/experiments`
*   **Headers**: `Authorization: Bearer <JWT_TOKEN>`
*   **Request Body**:
    ```json
    {
      "title": "Projectile Demo",
      "gravity": { "x": 0, "y": 1 },
      "bodies": [
        { "id": "b1", "shapeType": "box", "x": 400, "y": 200, "mass": 2.5, "isStatic": false }
      ]
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "message": "Experiment saved successfully",
      "experimentId": "60d5ec4b123456789"
    }
    ```
