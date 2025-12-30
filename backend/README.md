# Mini SaaS – Appointment & Case Management (Backend)

### Tech Stack

- Node.js
- Express
- PostgreSQL
- Prisma ORM
- JWT Authentication
- InversifyJS (Dependency Injection)

### Features

- User Authentication & Authorization
- Appointment Scheduling & Management
- Case Management
- Role-Based Access Control
- RESTful API Endpoints
- Input Validation & Error Handling

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://www.github.com/rahil234/mini-appointment-system.git
   cd mini-appointment-system
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   DATABASE_URL=your_postgresql_database_url
   JWT_SECRET=your_jwt_secret_key
   ```
4. Run database migrations:
   ```bash
   npx prismaConfig migrate deploy
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. The server will be running at `http://localhost:3000`

### API Documentation

Refer to the [API Documentation](./API_DOCUMENTATION.md) for detailed information on available endpoints and their
usage.

