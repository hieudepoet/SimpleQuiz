# Quiz Application - REST API Documentation

Complete API documentation for testing with Insomnia or Postman.

**Base URL:** `http://localhost:3000/api`

---

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Quizzes](#quizzes)
4. [Questions](#questions)
5. [Environment Setup for Insomnia](#environment-setup-for-insomnia)

---

## Authentication

### 1. Sign Up (Register New User)

Create a new user account.

- **Endpoint:** `POST /api/auth/signup`
- **Authentication:** None
- **Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123",
  "admin": false
}
```

**Note:** Set `admin: true` to create an admin user (for testing purposes).

- **Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "_id": "65f1234567890abcdef12345",
    "username": "john_doe",
    "admin": false
  }
}
```

- **Error Response (409 - User exists):**
```json
{
  "success": false,
  "message": "Username already exists"
}
```

---

### 2. Login

Login and receive JWT token.

- **Endpoint:** `POST /api/auth/login`
- **Authentication:** None
- **Request Body:**
```json
{
  "username": "john_doe",
  "password": "password123"
}
```

- **Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65f1234567890abcdef12345",
    "username": "john_doe",
    "admin": false
  }
}
```

**Important:** Save the `token` value for authenticated requests!

- **Error Response (401 - Invalid credentials):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

## Users

### 1. Get All Users (Admin Only)

Retrieve list of all registered users.

- **Endpoint:** `GET /api/users`
- **Authentication:** Required (Admin only)
- **Headers:**
```
Authorization: Bearer <your_jwt_token_here>
```

- **Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "_id": "65f1234567890abcdef12345",
      "username": "john_doe",
      "admin": false,
      "createdAt": "2024-02-03T15:30:00.000Z",
      "updatedAt": "2024-02-03T15:30:00.000Z"
    },
    {
      "_id": "65f1234567890abcdef54321",
      "username": "admin_user",
      "admin": true,
      "createdAt": "2024-02-03T14:00:00.000Z",
      "updatedAt": "2024-02-03T14:00:00.000Z"
    }
  ]
}
```

- **Error Response (401 - Not authenticated):**
```json
{
  "success": false,
  "message": "Unauthorized! Invalid or missing token."
}
```

- **Error Response (403 - Not admin):**
```json
{
  "success": false,
  "message": "You are not authorized to perform this operation!"
}
```

---

## Quizzes

### 1. Get All Quizzes (Public)

Retrieve all quizzes.

- **Endpoint:** `GET /api/quizzes`
- **Authentication:** None
- **Success Response (200):**
```json
[
  {
    "_id": "65f9876543210fedcba98765",
    "title": "JavaScript Basics",
    "description": "Test your JavaScript knowledge",
    "questions": ["65fa111111111111111111", "65fa222222222222222222"]
  }
]
```

---

### 2. Get Quiz by ID (Public)

Retrieve a specific quiz.

- **Endpoint:** `GET /api/quizzes/:quizId`
- **Authentication:** None
- **Success Response (200):**
```json
{
  "_id": "65f9876543210fedcba98765",
  "title": "JavaScript Basics",
  "description": "Test your JavaScript knowledge",
  "questions": ["65fa111111111111111111", "65fa222222222222222222"]
}
```

---

### 3. Get Quiz with Populated Questions (Public)

Retrieve quiz with full question details.

- **Endpoint:** `GET /api/quizzes/:quizId/populate`
- **Authentication:** None
- **Success Response (200):**
```json
{
  "_id": "65f9876543210fedcba98765",
  "title": "JavaScript Basics",
  "description": "Test your JavaScript knowledge",
  "questions": [
    {
      "_id": "65fa111111111111111111",
      "text": "What is closures?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "keywords": ["javascript", "closures"],
      "correctAnswerIndex": 1,
      "author": "65f1234567890abcdef12345"
    }
  ]
}
```

---

### 4. Create Quiz (Admin Only)

Create a new quiz.

- **Endpoint:** `POST /api/quizzes`
- **Authentication:** Required (Admin)
- **Headers:**
```
Authorization: Bearer <admin_jwt_token_here>
Content-Type: application/json
```
- **Request Body:**
```json
{
  "title": "React Fundamentals",
  "description": "Learn React basics",
  "questions": []
}
```

- **Success Response (201):**
```json
{
  "_id": "65f9999999999999999999",
  "title": "React Fundamentals",
  "description": "Learn React basics",
  "questions": []
}
```

---

### 5. Update Quiz (Admin Only)

Update an existing quiz.

- **Endpoint:** `PUT /api/quizzes/:quizId`
- **Authentication:** Required (Admin)
- **Headers:**
```
Authorization: Bearer <admin_jwt_token_here>
Content-Type: application/json
```
- **Request Body:**
```json
{
  "title": "React Advanced",
  "description": "Advanced React concepts"
}
```

---

### 6. Delete Quiz (Admin Only)

Delete a quiz.

- **Endpoint:** `DELETE /api/quizzes/:quizId`
- **Authentication:** Required (Admin)
- **Headers:**
```
Authorization: Bearer <admin_jwt_token_here>
```

- **Success Response (200):**
```json
{
  "message": "Quiz deleted successfully"
}
```

---

### 7. Add Single Question to Quiz (Admin Only)

Create and add a question to a quiz.

- **Endpoint:** `POST /api/quizzes/:quizId/question`
- **Authentication:** Required (Admin)
- **Headers:**
```
Authorization: Bearer <admin_jwt_token_here>
Content-Type: application/json
```
- **Request Body:**
```json
{
  "text": "What is useState hook?",
  "options": ["A hook for state", "A hook for effect", "A hook for ref", "A hook for context"],
  "keywords": ["react", "hooks", "useState"],
  "correctAnswerIndex": 0
}
```

**Note:** The `author` field is automatically set to the authenticated admin user.

---

### 8. Add Multiple Questions to Quiz (Admin Only)

Create and add multiple questions to a quiz.

- **Endpoint:** `POST /api/quizzes/:quizId/questions`
- **Authentication:** Required (Admin)
- **Headers:**
```
Authorization: Bearer <admin_jwt_token_here>
Content-Type: application/json
```
- **Request Body (Array):**
```json
[
  {
    "text": "What is useEffect?",
    "options": ["For side effects", "For state", "For ref", "For context"],
    "keywords": ["react", "hooks"],
    "correctAnswerIndex": 0
  },
  {
    "text": "What is JSX?",
    "options": ["JavaScript XML", "Java Syntax", "JSON XML", "None"],
    "keywords": ["react", "jsx"],
    "correctAnswerIndex": 0
  }
]
```

---

## Questions

### 1. Get All Questions (Public)

Retrieve all questions.

- **Endpoint:** `GET /api/questions`
- **Authentication:** None
- **Success Response (200):**
```json
[
  {
    "_id": "65fa111111111111111111",
    "text": "What is closures?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "keywords": ["javascript", "closures"],
    "correctAnswerIndex": 1,
    "author": "65f1234567890abcdef12345"
  }
]
```

---

### 2. Get Question by ID (Public)

Retrieve a specific question.

- **Endpoint:** `GET /api/questions/:questionId`
- **Authentication:** None
- **Success Response (200):**
```json
{
  "_id": "65fa111111111111111111",
  "text": "What is closures?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "keywords": ["javascript", "closures"],
  "correctAnswerIndex": 1,
  "author": "65f1234567890abcdef12345"
}
```

---

### 3. Create Question (Authenticated User)

Create a new standalone question.

- **Endpoint:** `POST /api/questions`
- **Authentication:** Required (Any authenticated user)
- **Headers:**
```
Authorization: Bearer <your_jwt_token_here>
Content-Type: application/json
```
- **Request Body:**
```json
{
  "text": "What is async/await?",
  "options": ["Async programming", "Sync programming", "Both", "None"],
  "keywords": ["javascript", "async"],
  "correctAnswerIndex": 0
}
```

**Note:** The `author` field is automatically set to the authenticated user.

- **Success Response (201):**
```json
{
  "_id": "65fa333333333333333333",
  "text": "What is async/await?",
  "options": ["Async programming", "Sync programming", "Both", "None"],
  "keywords": ["javascript", "async"],
  "correctAnswerIndex": 0,
  "author": "65f1234567890abcdef12345"
}
```

---

### 4. Update Question (Author Only)

Update a question (only the author can update).

- **Endpoint:** `PUT /api/questions/:questionId`
- **Authentication:** Required (Must be the author)
- **Headers:**
```
Authorization: Bearer <author_jwt_token_here>
Content-Type: application/json
```
- **Request Body:**
```json
{
  "text": "Updated: What is async/await in JavaScript?",
  "options": ["Async programming", "Sync programming", "Both", "None"],
  "correctAnswerIndex": 0
}
```

- **Success Response (200):**
```json
{
  "_id": "65fa333333333333333333",
  "text": "Updated: What is async/await in JavaScript?",
  "options": ["Async programming", "Sync programming", "Both", "None"],
  "keywords": ["javascript", "async"],
  "correctAnswerIndex": 0,
  "author": "65f1234567890abcdef12345"
}
```

- **Error Response (403 - Not the author):**
```json
{
  "success": false,
  "message": "You are not the author of this question"
}
```

---

### 5. Delete Question (Author Only)

Delete a question (only the author can delete).

- **Endpoint:** `DELETE /api/questions/:questionId`
- **Authentication:** Required (Must be the author)
- **Headers:**
```
Authorization: Bearer <author_jwt_token_here>
```

- **Success Response (200):**
```json
{
  "message": "Question deleted successfully"
}
```

- **Error Response (403 - Not the author):**
```json
{
  "success": false,
  "message": "You are not the author of this question"
}
```

- **Error Response (404 - Question not found):**
```json
{
  "success": false,
  "message": "Question not found"
}
```

---

## Environment Setup for Insomnia

### Step 1: Create Environment Variables

In Insomnia, create a new environment with these variables:

```json
{
  "base_url": "http://localhost:3000/api",
  "user_token": "",
  "admin_token": ""
}
```

### Step 2: Workflow for Testing

#### A. Setup Phase

1. **Create Regular User:**
   - `POST {{base_url}}/auth/signup`
   - Body: `{"username": "regular_user", "password": "password123", "admin": false}`
   - Copy the response (user created)

2. **Create Admin User:**
   - `POST {{base_url}}/auth/signup`
   - Body: `{"username": "admin_user", "password": "admin123", "admin": true}`
   - Copy the response (admin created)

3. **Login as Regular User:**
   - `POST {{base_url}}/auth/login`
   - Body: `{"username": "regular_user", "password": "password123"}`
   - Copy the `token` from response
   - Paste into environment variable `user_token`

4. **Login as Admin:**
   - `POST {{base_url}}/auth/login`
   - Body: `{"username": "admin_user", "password": "admin123"}`
   - Copy the `token` from response
   - Paste into environment variable `admin_token`

#### B. Testing Auth & Authorization

1. **Test Public Endpoints (No token needed):**
   - `GET {{base_url}}/quizzes`
   - `GET {{base_url}}/questions`

2. **Test User-Only Endpoints:**
   - `POST {{base_url}}/questions` with Header: `Authorization: Bearer {{user_token}}`

3. **Test Admin-Only Endpoints:**
   - `POST {{base_url}}/quizzes` with Header: `Authorization: Bearer {{admin_token}}`
   - `GET {{base_url}}/users` with Header: `Authorization: Bearer {{admin_token}}`

4. **Test Author Verification:**
   - Create a question as regular user (save the question ID)
   - Try to update/delete with the same user ✓ (should work)
   - Try to update/delete with admin user ✗ (should fail with 403)

#### C. Expected Authorization Behaviors

| Endpoint | No Auth | Regular User | Admin |
|----------|---------|--------------|-------|
| `GET /quizzes` | ✓ | ✓ | ✓ |
| `POST /quizzes` | ✗ 401 | ✗ 403 | ✓ |
| `PUT /quizzes/:id` | ✗ 401 | ✗ 403 | ✓ |
| `DELETE /quizzes/:id` | ✗ 401 | ✗ 403 | ✓ |
| `GET /questions` | ✓ | ✓ | ✓ |
| `POST /questions` | ✗ 401 | ✓ | ✓ |
| `PUT /questions/:id` | ✗ 401 | ✓ (if author) | ✓ (if author) |
| `DELETE /questions/:id` | ✗ 401 | ✓ (if author) | ✓ (if author) |
| `GET /users` | ✗ 401 | ✗ 403 | ✓ |

### Step 3: Sample Insomnia Requests

Create a folder structure in Insomnia:

```
Quiz App API
├── 1. Authentication
│   ├── Signup - Regular User
│   ├── Signup - Admin User
│   ├── Login - Regular User
│   └── Login - Admin User
├── 2. Users (Admin Only)
│   └── Get All Users
├── 3. Quizzes
│   ├── Get All Quizzes (Public)
│   ├── Get Quiz by ID (Public)
│   ├── Create Quiz (Admin)
│   ├── Update Quiz (Admin)
│   ├── Delete Quiz (Admin)
│   ├── Add Question to Quiz (Admin)
│   └── Add Multiple Questions (Admin)
└── 4. Questions
    ├── Get All Questions (Public)
    ├── Get Question by ID (Public)
    ├── Create Question (User)
    ├── Update Question (Author)
    └── Delete Question (Author)
```

---

## Testing Scenarios

### Scenario 1: Regular User Flow
1. Signup as regular user
2. Login and get token
3. Create a question (should succeed)
4. Update own question (should succeed)
5. Try to create a quiz (should fail with 403)
6. Try to view all users (should fail with 403)

### Scenario 2: Admin User Flow
1. Signup as admin
2. Login and get token
3. Create a quiz (should succeed)
4. Add questions to quiz (should succeed)
5. View all users (should succeed)
6. Create a question (should succeed)
7. Try to update another user's question (should fail with 403)

### Scenario 3: Author Verification
1. User A creates a question
2. User A updates the question (should succeed)
3. User B tries to update User A's question (should fail with 403)
4. Admin tries to update User A's question (should fail with 403)

---

## Error Codes Summary

- **200** - Success (GET, PUT, DELETE)
- **201** - Created (POST)
- **400** - Bad Request (Invalid data)
- **401** - Unauthorized (Missing/invalid token)
- **403** - Forbidden (No permission)
- **404** - Not Found
- **409** - Conflict (Username exists)
- **500** - Server Error

---

## Notes

1. **JWT Token Expiration:** Tokens expire after 7 days. Re-login if you get 401 errors.
2. **Author Field:** Automatically set from `req.user._id`, don't send it in request body.
3. **Admin Creation:** In production, admin users should be created via database seed or admin panel, not via public signup endpoint.
4. **Password Security:** Passwords are hashed using bcrypt before storage.
5. **CORS:** If testing from a different origin, you may need to configure CORS in the backend.

---

## Quick Reference

### How to Add Authorization Header in Insomnia

1. Go to request
2. Click "Header" tab
3. Add header:
   - Name: `Authorization`
   - Value: `Bearer {{user_token}}` or `Bearer {{admin_token}}`

### How to Switch Between User and Admin

Simply change the token in the Authorization header:
- For regular user operations: `Bearer {{user_token}}`
- For admin operations: `Bearer {{admin_token}}`
