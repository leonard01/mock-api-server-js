# mock-api-server-js

# 🧪 Mock API Server

A simple mock REST API server for testing and development, built with Node.js and Express. Includes full CRUD support, JSON file persistence, and extensive unit + functional test coverage.

---

## 🚀 Features

- In-memory data store (Array) with optional persistence to `users.json`
- RESTful endpoints for `/users`
- Request validation (name and email)
- Full unit + functional test coverage using Jest and Supertest
- Easily extensible for other resources



---

## 📡 API Endpoints

| Method | Endpoint        | Description         |
|--------|-----------------|---------------------|
| GET    | `/users`        | List all users      |
| POST   | `/users`        | Create a new user   |
| PUT    | `/users/:id`    | Update a user       |
| DELETE | `/users/:id`    | Delete a user       |
| GET    | `/health`       | Health check        |

---

## 🧪 Commands

run all tests

```bash
npm test
```

Reset all Mocked data
```bash
npm run reset-data
```
npm run reset-data

