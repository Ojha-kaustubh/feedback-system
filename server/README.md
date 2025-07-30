# Feedback System Backend

This is the backend server for the feedback system with MongoDB integration.

## Features

- User authentication (register/login)
- JWT token-based authentication
- Feedback CRUD operations
- Admin-only routes for managing feedback
- MongoDB database integration
- Input validation and error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

## Setup Instructions

1. **Install MongoDB**
   - Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Or use MongoDB Atlas (cloud service)

2. **Install Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Environment Configuration**
   - Copy `config.env` and update the values:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string for JWT tokens
     - `PORT`: Server port (default: 5000)

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or if using MongoDB Atlas, no local setup needed
   ```

5. **Start the Server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Feedback
- `POST /api/feedback` - Create new feedback
- `GET /api/feedback/public` - Get public feedback (no auth)
- `GET /api/feedback` - Get all feedback (admin only)
- `DELETE /api/feedback/:id` - Delete feedback (admin only)
- `GET /api/feedback/stats` - Get feedback statistics (admin only)

## Database Models

### User
- name (required)
- email (required, unique)
- password (required, hashed)
- isAdmin (boolean, default: false)
- timestamps

### Feedback
- name (required)
- email (required)
- rating (required, 1-5)
- message (required, min 10 chars)
- user (optional, reference to User)
- timestamps

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation with express-validator
- CORS enabled
- Protected routes with middleware
- Admin-only routes

## Environment Variables

Create a `config.env` file in the server directory:

```env
MONGODB_URI=mongodb://localhost:27017/feedback-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

## Development

The server runs on `http://localhost:5000` by default.

For development with hot reload:
```bash
npm run dev
``` 