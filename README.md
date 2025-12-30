# Bus Ticket Booking Application

A full-stack MERN application for booking bus tickets. This application allows users to search buses and book tickets through a user-friendly interface, while providing administrative tools to manage buses, routes, and schedules.

## Features
- **User**: Search buses, View details, Select seats, Book tickets, View History.
- **Admin**: Manage Buses, Routes, Schedules.
- **Security**: JWT Authentication, Password Hashing.

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### 1. Backend Setup
```bash
cd backend
npm install
# Create Admin User
node seed.js
# Start Server
npm run dev
```
Backend runs on `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

## Authentication
- **Admin Login**:
  - Email: `admin@example.com`
  - Password: `password123`
- **User Login**: Register a new account.

## API Endpoints
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/buses`
- GET `/api/schedules?from=X&to=Y&date=Z`
- POST `/api/bookings`

## Data & Storage
- **Source Code**: Located in `bus-ticket-booking/` directory.
- **Database**: Connects to local MongoDB at `mongodb://127.0.0.1:27017/`.
- **Data Persistence**: All bookings, users, and buses are saved to your local MongoDB database automatically.

