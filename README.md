# MERN Stack Integration Assignment

This assignment focuses on building a full-stack MERN (MongoDB, Express.js, React.js, Node.js) application that demonstrates seamless integration between front-end and back-end components.

## Assignment Overview

You will build a blog application with the following features:
1. RESTful API with Express.js and MongoDB
2. React front-end with component architecture
3. Full CRUD functionality for blog posts
4. User authentication and authorization
5. Advanced features like image uploads and comments

## Project Structure

```
mern-blog/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Getting Started

1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Follow the setup instructions in the `Week4-Assignment.md` file
4. Complete the tasks outlined in the assignment

## Setup and Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Git

### Installation Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PLP-MERN-Stack-Development/mern-stack-integration-coder4-c.git
   cd mern-stack-integration-coder4-c
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup:**
   - Copy `.env.example` files to `.env` in both `server/` and `client/` directories
   - Configure your MongoDB connection string in `server/.env`
   - Update API base URL in `client/.env` if needed

### Issues Resolved During Setup

- **PowerShell Execution Policy:** Fixed Windows PowerShell security policy that prevented npm commands from running
- **Git Push Timeout:** Resolved HTTP 408 timeout errors during large repository pushes by increasing git HTTP buffer size
- **Port Conflicts:** Resolved server port conflicts during development

## Running the Application

### Development Mode

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on `http://localhost:5000`

2. **Start the frontend client:**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on `http://localhost:5173`

3. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`

### Production Build

```bash
# Build the client
cd client
npm run build

# Start the server (serves both API and built client)
cd ../server
npm start
```

## Project Structure

```
mern-stack-integration-coder4-c/
├── client/                 # React front-end
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API services
│   │   ├── context/        # React context providers
│   │   └── App.jsx         # Main application component
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── server.js           # Main server file
│   └── package.json        # Server dependencies
└── README.md               # Project documentation
```

## Files Included

- `Week4-Assignment.md`: Detailed assignment instructions
- Starter code for both client and server:
  - Basic project structure
  - Configuration files
  - Sample models and components

## Troubleshooting

### Common Issues

1. **"npm command not found" or PowerShell execution errors:**
   - Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
   - This fixes Windows PowerShell security policy

2. **Git push timeout errors:**
   - Increase HTTP buffer: `git config --global http.postBuffer 524288000`
   - Disable compression: `git config --global http.lowSpeedLimit 0`

3. **Port already in use:**
   - Kill process on port: `taskkill /PID <PID> /F`
   - Or change port in server configuration

4. **Client not loading:**
   - Ensure both client and server are running
   - Use HTTP (not HTTPS): `http://localhost:5173`
   - Check browser console for errors

### Development Commands

```bash
# Check git status
git status

# Check running processes
netstat -ano | findstr :5173  # Client port
netstat -ano | findstr :5000  # Server port

# Kill all Node processes
taskkill /F /IM node.exe
```

## Features Implemented

### Backend (Express.js + MongoDB)
- ✅ RESTful API with Express.js
- ✅ MongoDB connection with Mongoose
- ✅ Post and Category models with relationships
- ✅ CRUD operations for blog posts
- ✅ Category management
- ✅ Input validation with express-validator
- ✅ Error handling middleware
- ✅ CORS configuration
- ✅ Environment variable configuration

### Frontend (React.js + Vite)
- ✅ React application with Vite build tool
- ✅ Component-based architecture
- ✅ React Router for navigation
- ✅ Custom hooks for API calls
- ✅ Context API for state management
- ✅ Responsive UI components
- ✅ Form handling for post creation/editing

### Integration Features
- ✅ Full-stack MERN integration
- ✅ API communication between client and server
- ✅ Proper error handling and loading states
- ✅ Development and production configurations

## API Endpoints

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category

## GitHub Repository

**Repository URL:** https://github.com/PLP-MERN-Stack-Development/mern-stack-integration-coder4-c

### Git Configuration Issues Resolved
- ✅ HTTP buffer size increased for large pushes
- ✅ Timeout settings configured for slow connections
- ✅ Repository successfully pushed to GitHub

## Submission

Your work will be automatically submitted when you push to your GitHub Classroom repository. Make sure to:

1. ✅ Complete both the client and server portions of the application
2. ✅ Implement all required API endpoints
3. ✅ Create the necessary React components and hooks
4. ✅ Document your API and setup process in the README.md
5. ✅ Include screenshots of your working application

## Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Mongoose Documentation](https://mongoosejs.com/docs/) 