# E-Commerce Full Stack Application

A full-stack e-commerce application built with React.js frontend and Node.js backend.

## Project Structure

```
.
├── frontend/          # React.js frontend application
├── backend/           # Node.js backend application
└── docker-compose.yml # Docker configuration for development
```

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_USER=myuser
   POSTGRES_PASSWORD=mypassword
   POSTGRES_DB=ecomm_db
   JWT_SECRET=your_very_strong_jwt_secret_key_here
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## Features

- User authentication (signup/login)
- Product management (CRUD operations)
- Protected routes
- Responsive design with Material UI
- PostgreSQL database integration
- JWT-based authentication

## API Endpoints

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - User login

### Products (Protected Routes)
- GET /api/products - Get all products
- POST /api/products - Create new product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product 