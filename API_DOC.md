# Task Management API Documentation

## Base URL

- Local: `http://localhost:3000/api`
- Production: `https://week22-task-management-deploy-1gkw.onrender.com`

---

## Authentication

- All endpoints except registration and login require JWT authentication.
- Send your token in the `Authorization` header:  
  `Authorization: Bearer <JWT_TOKEN>`
- Obtain your token via `/api/auth/register` or `/api/auth/login`.
- Token expires in 24 hours.
- Error responses:  
  - `401 Unauthorized` if token is missing/invalid/expired  
  - `403 Forbidden` if access denied

---

## Endpoints

### Auth Endpoints

#### Register User
- `POST /api/auth/register`
- Request Body:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- Response:
  - `201 Created`
  ```json
  {
    "success": true,
    "message": "student Registered successfully",
    "data": {
      "user": { "id": "...", "name": "...", "email": "...", "createdAt": "..." },
      "token": "<JWT_TOKEN>"
    }
  }
  ```
- Errors: `400 Bad Request`, `500 Internal Server Error`

#### Login User
- `POST /api/auth/login`
- Request Body:
  ```json
  {
    "email": "john@example.com",
    "password": "yourpassword"
  }
  ```
- Response:
  - `200 OK`
  ```json
  {
    "success": true,
    "message": "login successful",
    "data": {
      "user": { "id": "...", "name": "...", "email": "...", "createdAt": "..." },
      "token": "<JWT_TOKEN>"
    }
  }
  ```
- Errors: `400 Bad Request`, `404 Not Found`, `401 Unauthorized`, `500 Internal Server Error`

#### Get Current User
- `GET /api/auth/me`
- Headers:
  - `Authorization: Bearer <JWT_TOKEN>`
- Response:
  - `200 OK`
  ```json
  {
    "success": true,
    "data": { "id": "...", "name": "...", "email": "...", "createdAt": "..." }
  }
  ```
- Errors: `401 Unauthorized`

---

### Task Endpoints

> All endpoints below require authentication.

#### Get All Tasks
- `GET /api/tasks`
- Response:
  - `200 OK`
  ```json
  {
    "success": true,
    "count": 2,
    "data": [ ... ]
  }
  ```

#### Get Task by ID
- `GET /api/tasks/:id`
- Response:
  - `200 OK` or `404 Not Found`
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

#### Create Task
- `POST /api/tasks`
- Request Body:
  ```json
  {
    "title": "Task Title",
    "description": "Task description",
    "status": "pending",
    "priority": "high",
    "dueDate": "2025-09-20T12:00:00.000Z",
    "assignedTo": "John Doe",
    "subtasks": [ { "title": "Subtask 1", "description": "..." } ]
  }
  ```
- Response:
  - `201 Created`
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- Errors: `400 Bad Request`, `500 Internal Server Error`

#### Update Task
- `PUT /api/tasks/:id`
- Request Body:
  ```json
  {
    "title": "Updated Title",
    "status": "completed"
  }
  ```
- Response:
  - `200 OK`
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- Errors: `404 Not Found`, `400 Bad Request`

#### Delete Task
- `DELETE /api/tasks/:id`
- Response:
  - `200 OK`
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- Errors: `404 Not Found`, `500 Internal Server Error`

---

### Subtask Endpoints

#### Get All Subtasks for a Task
- `GET /api/tasks/:taskId/subtasks`
- Response:
  - `200 OK`
  ```json
  {
    "success": true,
    "count": 2,
    "data": [ ... ]
  }
  ```
- Errors: `404 Not Found`, `500 Internal Server Error`

#### Get Subtask by ID
- `GET /api/subtasks/:id`
- Response:
  - `200 OK`
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- Errors: `404 Not Found`, `500 Internal Server Error`

#### Create Subtask
- `POST /api/tasks/:taskId/subtasks`
- Request Body:
  ```json
  {
    "title": "Subtask Title",
    "description": "Subtask description"
  }
  ```
- Response:
  - `201 Created`
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- Errors: `404 Not Found`, `400 Bad Request`

#### Update Subtask
- `PUT /api/subtasks/:id`
- Request Body:
  ```json
  {
    "title": "Updated Subtask Title",
    "completed": true
  }
  ```
- Response:
  - `200 OK`
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- Errors: `404 Not Found`, `400 Bad Request`

#### Delete Subtask
- `DELETE /api/subtasks/:id`
- Response:
  - `200 OK`
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- Errors: `404 Not Found`, `500 Internal Server Error`

---

## Error Handling

- All error responses:
  ```json
  {
    "success": false,
    "error": "Error message"
  }
  ```
- Common status codes:  
  - `200 OK`: Successful GET/PUT/DELETE
  - `201 Created`: Successful POST
  - `400 Bad Request`: Validation error
  - `401 Unauthorized`: Missing/invalid token
  - `404 Not Found`: Resource not found
  - `500 Internal Server Error`: Server error

---

## Data Models

- **User**
  ```json
  { "id": "...", "name": "...", "email": "...", "createdAt": "..." }
  ```
- **Task**
  ```json
  { "id": "...", "title": "...", "description": "...", "status": "...", "priority": "...", "dueDate": "...", "assignedTo": "...", "subtasks": [ ... ] }
  ```
- **Subtask**
  ```json
  { "id": "...", "title": "...", "description": "...", "completed": false }
  ```

---

## Example Usage

Use Postman or any API client to send requests to the endpoints above. Set the method, URL, headers, and body as described for each endpoint.

---

For further details, see the README or contact the maintainer.
