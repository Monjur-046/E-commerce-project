# KICHU KINBEN – E-commerce Website

A full-stack e-commerce web application built with React, Node.js, Express.js and MongoDB.

## Project Overview

KICHU KINBEN is an online shopping platform where customers can browse products, add items to their cart, place orders and manage their accounts.

Administrators can manage products, orders and admin accounts through a dedicated dashboard.

## Technologies Used

### Frontend
- React.js
- Vite
- React Router DOM
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Main Features

### Customer
- User Registration and Login
- Secure Authentication
- Browse Products
- Product Search and Categories
- Shopping Cart
- Checkout
- Cash on Delivery
- Order History
- Order Cancellation
- Customer Profile
- Change Password

### Admin
- Admin Dashboard
- Product Management
- Add, Update and Delete Products
- Order Management
- Update Order Status
- Admin Account Management
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
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Monjur-046/E-commerce-project.git
```

```bash
cd E-commerce-project
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

Add the following environment variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

Replace the example values with your own configuration.

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

## Payment Information

- Cash on Delivery (COD)
- aamarPay Online Payment Integration (Sandbox)
- Payment verification
- Successful and failed payment handling
- Production payment requires live gateway credentials.

## Security

- Passwords are hashed using bcryptjs.
- JWT-based authentication.
- Protected customer and admin routes.
- Role-based authorization.
- Password change invalidates previous login sessions.
- Environment variables are kept outside the public repository.

## Developers

Group Project – KICHU KINBEN

Developed as an academic e-commerce project.