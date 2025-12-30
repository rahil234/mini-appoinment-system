API DOCUMENTATION
Mini Appointment & Case Management System

Base URL:
http://localhost:4000

All APIs use JSON.
Authentication is handled via JWT.

==================================================
AUTHENTICATION
==================================================

POST /auth/register
Create a new user.

Request Body:
{
"name": "John Doe",
"email": "john@example.com",
"password": "password123"
}

Response:
{
"accessToken": "jwt-token"
}

--------------------------------------------------

POST /auth/login
Login an existing user.

Request Body:
{
"email": "john@example.com",
"password": "password123"
}

Response:
{
"accessToken": "jwt-token"
}

==================================================
AUTHORIZATION
==================================================

Protected routes require the header:
Authorization: Bearer <accessToken>

Roles:

- ADMIN
- USER

==================================================
APPOINTMENTS
==================================================

POST /appointments
Create an appointment.
Auth required.

Request Body:
{
"title": "Doctor Consultation",
"date": "2025-01-10T10:00:00Z",
"userId": "user-uuid"
}

--------------------------------------------------

PUT /appointments/:id
Update an appointment.
Auth required.

Request Body:
{
"status": "CONFIRMED"
}

--------------------------------------------------

GET /appointments
List appointments with filters.
Auth required.

Query Params:

- page
- limit
- status
- userId
- date

Example:
GET /appointments?page=1&limit=10&status=PENDING

==================================================
CASES
==================================================

POST /cases
Create a case.
ADMIN only.

Request Body:
{
"title": "Customer Complaint",
"description": "Issue with booking"
}

--------------------------------------------------

PUT /cases/:id/assign
Assign a case to a user.
ADMIN only.

Request Body:
{
"userId": "user-uuid"
}

--------------------------------------------------

GET /cases
List all cases.
Auth required.

==================================================
ERROR FORMAT
==================================================

All errors follow this format:

{
"success": false,
"message": "Error message"
}
