# KICHU KINBEN – Full-Stack E-commerce Website

A full-stack e-commerce application built with React.js, Node.js, Express.js and MongoDB.

## Project Overview

KICHU KINBEN is an online shopping platform that allows customers to browse products, search by category, manage shopping carts, place orders and track their purchases.

The application also provides an admin dashboard for managing products, orders, inventory and administrator accounts.

## Technologies Used

### Frontend
- React.js
- Vite
- React Router DOM
- CSS3

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Nodemailer

### Payment Integration
- aamarPay Payment Gateway (Sandbox)

## Main Features

### Customer Features
- User Registration and Login
- JWT-based Authentication
- Forgot Password and Password Reset via Email
- Browse Products
- Product Search and Category Filtering
- Product Quick View
- Shopping Cart Management
- Cart Quantity Updates
- Checkout
- Cash on Delivery (COD)
- Online Payment through aamarPay
- Payment Success and Failure Handling
- Order History
- Order Cancellation
- Customer Profile Management
- Change Password

### Admin Features
- Admin Dashboard
- Product Management
- Add, Update and Delete Products
- Product Stock Management
- Order Management
- Update Order Status
- Admin Account Management
- Create, Update and Delete Admin Accounts
- Change Admin Credentials

## Project Structure

```text
our-ecommerce/
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
git clone https://github.com/Monjur-046/E-commerce-project.git
cd E-commerce-project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory.

Add the following environment variables:

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

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password

PASSWORD_RESET_URL=http://localhost:5173/reset-password
```

Replace the placeholder values with your own credentials. Never upload your actual `.env` file or secret credentials to GitHub.

Start the backend development server:

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

Backend health check:

```text
http://localhost:5000/api/health
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
- Payment verification and order handling
- Successful and failed payment handling
- Stock updates based on order and payment outcomes

**Note:** The current aamarPay integration uses sandbox credentials and the sandbox gateway. Live transactions require approved production credentials and the live gateway configuration.

## Security

- Passwords are hashed using bcryptjs.
- JWT-based user authentication.
- Protected customer and admin routes.
- Role-based authorization.
- Password reset through email verification tokens.
- Password changes invalidate previous login sessions.
- Sensitive credentials are stored in environment variables.
- Environment files are excluded from Git tracking.

## Deployment

The project is intended to be deployed using:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas

Production deployment requires configuring the appropriate environment variables, frontend/backend URLs, CORS settings and payment gateway credentials.

## Developers

**Group Project – KICHU KINBEN**

Developed as an academic full-stack e-commerce project.
