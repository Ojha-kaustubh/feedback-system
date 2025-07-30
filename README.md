# Feedback System with MongoDB

A modern feedback collection system built with React frontend and Node.js/Express backend with MongoDB database integration.

## Features

### Frontend (React)
- Modern, responsive UI with beautiful design
- User authentication (login/signup)
- Feedback submission form with star ratings
- Feedback dashboard with sorting and filtering
- Admin panel for managing feedback
- Real-time form validation
- JWT token-based authentication

### Backend (Node.js/Express)
- RESTful API with Express.js
- MongoDB database integration with Mongoose
- User authentication with JWT tokens
- Password hashing with bcrypt
- Input validation with express-validator
- CORS enabled for cross-origin requests
- Admin-only routes for feedback management

### Database (MongoDB)
- User collection with authentication data
- Feedback collection with user references
- Indexed queries for better performance
- Data validation and sanitization

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd feedback-system
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp config.env.example config.env
# Edit config.env with your MongoDB connection string and JWT secret

# Start MongoDB (if using local installation)
mongod

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## Environment Configuration

### Backend (.env file in server directory)
```env
MONGODB_URI=mongodb://localhost:27017/feedback-system
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### MongoDB Atlas (Alternative)
If using MongoDB Atlas instead of local MongoDB:
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Replace `MONGODB_URI` in config.env with your Atlas connection string

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

## Usage

1. **Start both servers** (backend and frontend)
2. **Open the application** in your browser at `http://localhost:5173`
3. **Register a new account** or login with existing credentials
4. **Submit feedback** using the feedback form
5. **View feedback** in the dashboard
6. **Access admin features** by enabling admin mode (for demo purposes)

## Project Structure

```
feedback-system/
├── src/                    # Frontend React code
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── ...
├── server/                # Backend Node.js code
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── ...
├── package.json           # Frontend dependencies
└── server/package.json    # Backend dependencies
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Protected routes with middleware
- Admin-only access controls

## Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development
```bash
cd server
npm run dev          # Start with nodemon (auto-restart)
npm start           # Start production server
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
