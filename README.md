# RBAC Task Manager API

A backend-only task management API built with Node.js, Express, and MongoDB.

This project was created while learning backend development concepts such as authentication, authorization, and role-based access control (RBAC). The application uses a task management system as a practical example for implementing user roles, protected routes, and resource ownership validation.

---

## Project Context

The primary focus of this project was exploring:

* JWT-based authentication
* Role-based access control (RBAC)
* Route protection and authorization
* Task ownership validation
* REST API development with Express
* MongoDB data modeling with Mongoose

---

## Features

### Authentication

* User registration
* User login
* JWT-based authentication
* Password hashing with bcrypt
* Protected routes

### Task Management

* Create tasks
* Retrieve task details
* Update tasks
* Delete tasks
* Assign tasks to users

### Authorization

* Role-based access control
* Admin-only routes
* Task ownership validation
* User-level resource protection

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* bcrypt

### Validation

* validator.js

### Templating

* EJS

---

## Project Structure

```text
controllers/      Request handling logic
middleware/       Authentication and authorization middleware
models/           MongoDB schemas
routes/           API route definitions
utils/            Validation utilities
views/            EJS templates
public/           Static assets
```

---

## Installation

### Prerequisites

* Node.js
* MongoDB Atlas account or local MongoDB instance

### Clone the Repository

```bash
git clone <repository-url>
cd rbac-task-manager-api
```

### Install Dependencies

```bash
npm install
```

### Configuration

Copy the example environment file:

```bash
cp .env.example .env
```

Update the values as needed for your environment.

Refer to `.env.example` for the complete list of required configuration variables.

### Start the Application

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

---

## Role-Based Access Control

### User

Regular users can:

* Create tasks
* View tasks assigned to them
* Update their own tasks
* Delete their own tasks

Users cannot modify tasks assigned to other users.

### Admin

Administrators can:

* View all users
* View all tasks
* Update any task
* Delete any task

Admin routes are protected through dedicated authorization middleware.

---

## API Overview

### Authentication Routes

```http
POST /auth/signup
POST /auth/login
```

### Task Routes

```http
GET    /task/:id
POST   /task
PUT    /task/:id
DELETE /task/:id
```

### Admin Routes

```http
GET    /admin/users
GET    /admin/tasks
PUT    /admin/task/:id
DELETE /admin/task/:id
```

---

## Limitations

This repository reflects an early learning project and intentionally focuses on core backend concepts.

Current limitations include:

* No automated test suite
* No API documentation (Swagger/OpenAPI)
* No refresh token implementation
* No rate limiting
* No CI/CD pipeline
* Limited production hardening

---

## Repository Status

This repository is preserved as a learning project demonstrating:

* Express API development
* MongoDB integration
* JWT authentication
* Role-based access control
* Route authorization
* Resource ownership validation

The project is not actively maintained and primarily serves as a reference for the concepts explored during development.
