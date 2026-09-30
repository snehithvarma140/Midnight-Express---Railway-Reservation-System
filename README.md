# 🚆 Midnight Express — Railway Reservation System

> **A modern, full-stack railway reservation platform designed to make train travel simple, fast, and convenient.**

##  About the Project

**Midnight Express** is a full-stack **Railway Reservation System** developed as a B.Tech DBMS and software development project.

The platform provides a complete digital railway booking experience, allowing users to search for trains, check availability, book tickets, manage passengers, make simulated payments, view PNR status, download digital tickets, and cancel bookings.

The project combines **modern web development, database management, authentication, reservation logic, and a professional railway-focused user interface** into one integrated system.

> **Note:** Midnight Express is an educational project and is **not affiliated with Indian Railways or IRCTC**. Railway information, payments, and live-status features are simulated using project data.

---

## Key Features

### User Features

* 🔐 User Registration & Login
* 🏠 Personalized Dashboard
* 🚆 Search Trains
* 🔍 Filter Train Results
* 📋 View Train Details
* 🎫 Railway Ticket Booking
* 👥 Passenger Management
* 💺 Berth Preference Selection
* 🪑 Automatic Seat/Coach Allocation
* 💳 Simulated Online Payment
* 🎟️ Digital Ticket Generation
* 🔢 PNR Generation & Status
* 📚 My Bookings
* ❌ Ticket Cancellation
* 💰 Refund Calculation
* 🔔 Notifications
* 👤 Profile Management
* 🧳 Saved Passengers
* 🏢 Station Services
* 🚕 Travel Services
* 🍴 Food & Other Travel Assistance
* 🆘 Help & Support

---

## Station Services

The Station Services module provides useful information about railway stations, including:

* Station information
* Station code
* Platforms
* Train arrivals/departures
* Station facilities
* Waiting rooms
* Toilets
* Food services
* Parking
* Ticket counters
* Enquiry counters
* Wi-Fi
* Charging points
* Accessibility facilities
* Wheelchair assistance
* Transport services
* Nearby services
* Emergency information
* Station map

---

## Admin Dashboard

Administrators have a dedicated management dashboard.

### Management Modules

* Users
* Stations
* Trains
* Routes
* Coaches
* Seats
* Bookings
* Passengers
* Payments
* Cancellations
* Notifications
* Reports

### Reports

* Booking reports
* Revenue reports
* Train occupancy
* Cancellation reports
* Date-wise statistics
* Train-wise statistics

---

# Complete Booking Workflow

```text
Login
   ↓
Dashboard
   ↓
Search Trains
   ↓
Train Results
   ↓
Train Details
   ↓
Select Class & Quota
   ↓
Select Boarding Station
   ↓
Passenger Details
   ↓
Berth Preferences
   ↓
Fare Summary
   ↓
Review Booking
   ↓
Simulated Payment
   ↓
Booking Confirmation
   ↓
PNR Generated
   ↓
Digital Ticket
   ↓
My Bookings
```

### Cancellation Workflow

```text
My Bookings
   ↓
Select Booking
   ↓
Select Passenger(s)
   ↓
Calculate Refund
   ↓
Confirm Cancellation
   ↓
Release Seat
   ↓
Update Booking
   ↓
Generate Refund Record
```

---

# Database Architecture

Midnight Express uses a relational database to manage the complete reservation workflow.

### Major Entities

```text
Users
Passengers
Stations
Trains
TrainRoutes
Coaches
Seats
Bookings
BookingPassengers
Payments
Cancellations
PNR
Notifications
StationFacilities
TravelServices
AdminUsers
Reports
```

### Main Relationships

```text
USER
 ├── PASSENGERS
 └── BOOKINGS
        ├── BOOKING_PASSENGERS
        ├── PAYMENT
        ├── CANCELLATION
        └── PNR

TRAIN
 ├── TRAIN_ROUTE
 │      └── STATION
 └── COACH
        └── SEAT
```

The database demonstrates:

* Primary Keys
* Foreign Keys
* Relationships
* Constraints
* Normalization
* Joins
* Indexing
* CRUD Operations
* Transactions
* Seat Allocation
* Booking Management

---

# Seat Allocation

Seats are not manually selected as the primary booking method.

Instead, the system uses a reservation workflow:

```text
Check Availability
       ↓
Find Available Seat
       ↓
Assign Coach
       ↓
Assign Seat/Berth
       ↓
Create Booking
       ↓
Update Seat Status
```

Possible seat states:

```text
AVAILABLE
HELD
BOOKED
CANCELLED
```

This demonstrates how a real reservation database can prevent duplicate seat allocation.

---

# Payment System

Midnight Express contains a **simulated payment system** for educational purposes.

Supported demo methods include:

* UPI
* Credit/Debit Card
* Net Banking
* Wallet/Other

Payment records contain information such as:

* Payment ID
* Booking ID
* Amount
* Payment Method
* Transaction Reference
* Payment Status
* Payment Date

No real money is processed.

---

# Security

The project follows basic secure application practices:

* Password hashing
* Authentication
* Role-based authorization
* Protected routes
* Backend validation
* Frontend validation
* Parameterized database queries
* Environment variables
* CORS configuration
* Secure API design
* Sensitive information protection

Secrets and credentials should be stored in environment variables rather than source code.

---

# Technology Stack

## Frontend

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **React Router**
* **Lucide Icons**
* **Recharts**

## Backend

* **Node.js**
* **Express.js**
* **TypeScript**
* **REST APIs**

## Database

* **MySQL**

## Development

* Git
* GitHub
* npm

---

# Project Structure

```text
Midnight-Express/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── utils/
│   │   └── types/
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── utils/
│   │
│   └── package.json
│
├── database/
│   ├── schema.sql
│   └── seed.sql
│
├── .env.example
├── README.md
└── package.json
```

---

# Getting Started

## 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd Midnight-Express
```

## 2. Install Dependencies

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd ../backend
npm install
```

---

# Database Setup

Make sure **MySQL** is installed and running.

Create a database:

```sql
CREATE DATABASE midnight_express;
```

Import the database schema:

```bash
mysql -u root -p midnight_express < database/schema.sql
```

Import demo/seed data:

```bash
mysql -u root -p midnight_express < database/seed.sql
```

---

# Environment Variables

Create a `.env` file in the backend.

Example:

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=midnight_express

JWT_SECRET=your_secret_key

CLIENT_URL=http://localhost:5173
```

Never commit your actual `.env` file to GitHub.

---

# Running the Project

## Start Backend

```bash
cd backend
npm run dev
```

Backend:

```text
http://localhost:5000
```

## Start Frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# API Modules

The backend provides REST APIs for:

```text
/api/auth
/api/stations
/api/trains
/api/coaches
/api/seats
/api/bookings
/api/passengers
/api/payments
/api/pnr
/api/profile
/api/notifications
/api/admin
```

Example:

```text
GET    /api/trains
GET    /api/trains/search
GET    /api/trains/:id

POST   /api/bookings
GET    /api/bookings
GET    /api/bookings/:id
POST   /api/bookings/:id/cancel

GET    /api/pnr/:pnr
```

---

# Design Philosophy

Midnight Express uses a modern railway-inspired visual identity.

### Primary Colors

* Deep Railway Blue
* White
* Light Blue
* Orange/Gold accents

### Design Elements

* Rounded cards
* Soft shadows
* Clean typography
* Railway route timelines
* Train and station icons
* Smooth transitions
* Responsive layouts
* Clear status indicators
* Minimal and professional interface

The design is inspired by modern transportation platforms rather than directly copying any existing railway website.

---

# Responsive Design

The application is designed for:

* Desktop
* Laptop
* Mobile
* Tablet

The interface adapts automatically to different screen sizes.

---

# Testing

Important workflows to test:

### User

```text
Register
→ Login
→ Search Train
→ Book Ticket
→ Payment
→ Confirmation
→ PNR
→ View Ticket
→ Cancel Ticket
```

### Admin

```text
Admin Login
→ Dashboard
→ Manage Stations
→ Manage Trains
→ Manage Routes
→ Manage Coaches
→ Manage Seats
→ Manage Bookings
→ View Payments
→ View Cancellations
→ Reports
```

---

# 🎓 Academic Purpose

Midnight Express demonstrates practical implementation of:

### DBMS

* Relational database design
* ER modeling
* Normalization
* SQL queries
* Joins
* Constraints
* Transactions
* CRUD operations
* Database relationships

### Full-Stack Development

* Frontend development
* Backend development
* REST APIs
* Authentication
* Authorization
* Database integration

### Software Engineering

* Modular architecture
* Validation
* Error handling
* Responsive design
* Security
* Documentation
* Version control

---

# Future Enhancements

Possible future improvements include:

* Real railway API integration
* Real-time train tracking
* Real payment gateway
* Email/SMS notifications
* Dynamic seat maps
* AI travel assistant
* Personalized journey recommendations
* Multilingual support
* Mobile application
* Advanced analytics
* Cloud deployment
* Real-time platform updates

---

# Disclaimer

**Midnight Express is an educational/student project created for demonstrating full-stack development and database management concepts.**

It is:

* Not an official railway reservation platform
* Not affiliated with Indian Railways
* Not affiliated with IRCTC
* Not connected to real railway reservation systems
* Not processing real financial transactions

All railway schedules, availability, payments, and other operational information used in the application are **demo/simulated project data** unless explicitly stated otherwise.

---

# Project

## Midnight Express

**Railway Reservation System**

> **Plan your journey. Book your seat. Travel with confidence.**

Built as a student project combining **DBMS + Full-Stack Development + Modern UI/UX**.

---
