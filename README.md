Mini SaaS – Appointment & Case Management System
================================================================

Mini SaaS is a lightweight appointment and case management system designed for small businesses and professionals.
It provides essential features to manage appointments, users, and operational cases with role-based access control.

This project demonstrates a clean, real-world SaaS-style architecture using modern backend and frontend tooling.

----------------------------------------------------------------

### TECH STACK

#### Backend

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT Authentication
- InversifyJS (Dependency Injection)
- Docker

#### Frontend

- React (Vite)
- TypeScript
- Tailwind CSS
- Zustand
- Axios

----------------------------------------------------------------

### Project Structure

```text
mini-appointment-system/
├── backend/
│   ├── src/
│   ├── prisma/
│   ├── Dockerfile
│   └── .env
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── .env
└── docker-compose.yml
```

----------------------------------------------------------------

### PREREQUISITES

- Docker
- Docker Compose

Ensure Docker is installed and running before proceeding.

----------------------------------------------------------------

### ENVIRONMENT CONFIGURATION

Environment variables must be configured for both backend and frontend.

----------------------------------------------------------------

### BACKEND ENVIRONMENT VARIABLES

Create a .env file inside the backend/ directory:

```dotenv
NODE_ENV=development
PORT=4000

DATABASE_URL=postgresql://postgres:password@db:5432/mini_saas

CORS_ORGINS=http://localhost:3000

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

ADMIN_EMAIL=admin@gmail.com
ADMIN_PASSWORD=password
```

Note:
Update database credentials if they differ from docker-compose.yml.

----------------------------------------------------------------

### FRONTEND ENVIRONMENT VARIABLES

Create a .env file inside the frontend/ directory:

```dotenv
VITE_API_URL=http://localhost:4000
```

This value must point to the backend API.

----------------------------------------------------------------

### RUNNING THE APPLICATION (DOCKER COMPOSE)

From the project root, run:

docker compose up --build

This will:

- Start PostgreSQL
- Apply Prisma migrations
- Generate Prisma client
- Start backend API
- Start frontend application

----------------------------------------------------------------

### DATABASE SETUP

Prisma migrations are applied automatically on startup.

To manually seed the admin user:

docker compose exec backend npx prisma db seed

----------------------------------------------------------------

### APPLICATION ACCESS

Frontend:
http://localhost:5173

Backend API:
http://localhost:4000

----------------------------------------------------------------

### DEFAULT ADMIN CREDENTIALS

Email: admin@gmail.com

Password: password

----------------------------------------------------------------

### CORE FEATURES

#### Authentication & Authorization

- User registration and login
- JWT-based authentication
- Role-based access control (ADMIN, USER)

#### Appointment Management

- Create, update, and list appointments
- Appointment status tracking
- Pagination and filtering

#### Case Management (Admin)

- Create and assign cases
- Track case status
- View all cases

#### Analytics Dashboard

- Appointment statistics
- Recent appointments
- Admin-level case analytics

#### User Management (Admin)

- List users
- Update user roles
- Enable / disable users

----------------------------------------------------------------

#### ARCHITECTURE NOTES

- Modular backend structure (Routes → Controllers → Services)
- Centralized error handling
- Soft delete strategy
- Dedicated analytics API
- Secure cookie-based authentication

----------------------------------------------------------------

### STATUS

Fully dockerized
Backend APIs complete
Frontend dashboard integrated
Ready for local development and testing

----------------------------------------------------------------

### DISCLAIMER

This project is intended for demonstration and learning purposes and represents a simplified version of a real-world
SaaS system.