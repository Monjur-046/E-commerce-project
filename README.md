# KICHU KINBEN – Full-Stack E-commerce Website

A full-stack e-commerce application built with React.js, Node.js, Express.js, and MongoDB.

## Live Project

- **Customer Website:** https://kichu-kinben-main.vercel.app/
- **Admin Dashboard:** https://kichu-kinben-main.vercel.app/admin

## Project Overview

KICHU KINBEN is a full-stack online shopping platform that allows customers to browse products, search and filter products, manage shopping carts, place orders, make payments, and track their purchases.

The application also provides an admin dashboard for managing products, inventory, customer orders, and store operations.

## Technologies Used

### Frontend
- React.js
- Vite
- React Router DOM
- JavaScript
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

### Email Integration
- Brevo Transactional Email API
- Password Reset Email Verification

### Payment Integration
- aamarPay Payment Gateway (Sandbox)

### Deployment
- Vercel – Frontend Hosting
- Render – Backend Hosting
- MongoDB Atlas – Database

## Main Features

### Customer Features
- User Registration and Login
- JWT-based Authentication
- Forgot Password and Password Reset via Email
- Browse Products
- Product Search
- Category Filtering
- Product Details and Quick View
- Shopping Cart Management
- Cart Quantity Updates
- Cart Persistence
- Checkout
- Cash on Delivery (COD)
- Online Payment through aamarPay
- Payment Verification
- Payment Success and Failure Handling
- Order History
- Order Status Tracking
- Customer Profile Management
- Change Password

### Admin Features
- Admin Dashboard
- Product Management
- Add, Update, and Delete Products
- Product Stock Management
- Order Management
- View Customer Orders
- Update Order Status
- Admin Authentication
- Protected Admin Routes
- Role-based Access Control

## Project Structure

```text
E-commerce-project/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── index.html
│
├── .gitignore
└── README.md
```

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB Atlas account or local MongoDB installation
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/BMSOHAN/E-commerce-project.git
cd E-commerce-project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory.

Add the following environment variables using your own credentials:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret
JWT_EXPIRES_IN=7d

AAMARPAY_STORE_ID=your_store_id
AAMARPAY_SIGNATURE_KEY=your_signature_key
AAMARPAY_BASE_URL=https://sandbox.aamarpay.com/jsonpost.php

FRONTEND_URL=http://localhost:5173
BACKEND_PUBLIC_URL=http://localhost:5000

EMAIL_USER=your_verified_sender_email
BREVO_API_KEY=your_brevo_api_key

PASSWORD_RESET_URL=http://localhost:5173/reset-password
```

Replace all placeholder values with your actual credentials.

**Important:** Never upload your actual `.env` file, API keys, passwords, or secret credentials to GitHub.

Start the backend development server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

### 4. Production Build

To create an optimized frontend production build:

```bash
cd frontend
npm run build
```

The generated production files will be available in the `dist` directory.

## Payment Information

The application supports:

- Cash on Delivery (COD)
- aamarPay Online Payment Integration
- Payment Gateway Verification
- Successful and Failed Payment Handling
- Order Payment Status Management
- Stock Reservation and Restoration

**Note:** The current aamarPay integration uses sandbox credentials and the sandbox gateway. Live transactions require approved production credentials and the appropriate live gateway configuration.

## Email Integration

Brevo Transactional Email API is used for password reset emails.

The password reset process includes:

- Secure password reset token generation
- Token hashing
- Token expiration
- Email delivery through Brevo API
- Password reset verification

A valid Brevo API key and verified sender email are required for production email delivery.

## Security

- Password hashing using bcryptjs
- JWT-based authentication
- Protected customer and admin routes
- Role-based authorization
- Secure password reset tokens
- Password reset token expiration
- Environment-based configuration
- Sensitive credentials excluded from Git tracking

## Deployment

The project is deployed using:

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |
| Email Service | Brevo |
| Payment Gateway | aamarPay Sandbox |

Production deployment requires the appropriate environment variables, frontend and backend URLs, database configuration, email API credentials, and payment gateway credentials.

## Developers

**Group Project – KICHU KINBEN**

Developed as an academic full-stack e-commerce project.