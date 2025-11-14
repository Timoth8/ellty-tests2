# Ellty Comment System

A full-stack nested comment system built with React, Express.js, MongoDB, and Tailwind CSS.

## 📋 Features

- ✅ **Real-time updates** - Live comments with Socket.IO (no refresh needed!)
- ✅ Nested/threaded comments with unlimited depth
- ✅ **JWT Authentication** - Secure login and registration system
- ✅ **Authorization** - Users can only delete their own comments
- ✅ **Public viewing** - Anyone can view comments without authentication
- ✅ User avatars and profiles
- ✅ Reply to any comment with zig-zag alignment pattern
- ✅ **Collapsible replies** - Hide/show nested replies (default hidden)
- ✅ **Reply pagination** - Load 5 replies at a time
- ✅ **Delete comments** - Remove your own comments and all nested replies
- ✅ Responsive design with Tailwind CSS
- ✅ RESTful API with authentication middleware
- ✅ MongoDB database with Mongoose ODM
- ✅ Timestamp formatting
- ✅ **Docker deployment** - Production-ready containerization
- ✅ Clean and modern UI matching the design specifications

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Socket.IO** - Real-time bidirectional communication

### Frontend
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Socket.IO Client** - Real-time updates
- **React Context API** - State management

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy with WebSocket support

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js

## 🚀 Installation & Setup

### Choose Your Deployment Method

#### 🐳 Option A: Docker (Recommended for Production)
**See [DOCKER_README.md](./DOCKER_README.md) for complete Docker deployment guide**

Quick start:
```powershell
# Copy and configure environment
Copy-Item .env.production .env
notepad .env  # Update JWT_SECRET and passwords

# Start with one command
.\start-production.ps1
```

Access at `http://localhost`

#### 💻 Option B: Local Development (Without Docker)

### 1. Clone the repository (if not already done)
```bash
git clone <repository-url>
cd ellty-tests2
```

### 2. Install dependencies

Install backend dependencies:
```powershell
npm install
```

Install frontend dependencies:
```powershell
cd client
npm install
cd ..
```

Or use the convenience script:
```powershell
npm run install-all
```

### 3. Configure MongoDB

#### Option A: Local MongoDB
1. Make sure MongoDB is installed and running on your machine
2. MongoDB should be running on `mongodb://localhost:27017`
3. The database `ellty-comments` will be created automatically

To start MongoDB (if not running):
```powershell
# Start MongoDB service (Windows)
net start MongoDB
```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update the `.env` file with your connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ellty-comments
```

### 4. Environment Variables

The `.env` file is already created with default values:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ellty-comments
```

Modify these if needed for your setup.

### 5. Seed the Database

Populate the database with sample data matching the screenshot:
```powershell
npm run seed
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
👥 Created users
💬 Created comments with nested structure
✅ Seed data inserted successfully!
```

## 🎮 Running the Application

### Development Mode

#### Option 1: Run both servers concurrently (Recommended)
```powershell
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend server on `http://localhost:3000`

#### Option 2: Run separately

Terminal 1 (Backend):
```powershell
npm run server
```

Terminal 2 (Frontend):
```powershell
npm run client
```

### Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## 📁 Project Structure

```
ellty-tests2/
├── client/                  # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CommentList.js    # Lists all comments
│   │   │   ├── CommentItem.js    # Individual comment with replies
│   │   │   └── CommentForm.js    # Form to add comments/replies
│   │   ├── App.js                # Main application component
│   │   ├── index.js              # React entry point
│   │   └── index.css             # Global styles with Tailwind
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── server/                  # Express backend
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Comment.js           # Comment schema
│   ├── routes/
│   │   ├── users.js             # User endpoints
│   │   └── comments.js          # Comment endpoints
│   ├── index.js                 # Express server
│   └── seed.js                  # Database seeding script
├── .env                     # Environment variables
├── .gitignore
├── package.json            # Backend dependencies
└── README.md               # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "User Name",
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- `POST /api/auth/login` - Login and receive JWT token
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- `GET /api/auth/me` - Get current user (requires authentication)

### Comments
- `GET /api/comments` - Get all comments (nested structure, public)
- `POST /api/comments` - Create a new comment (requires authentication)
  ```json
  {
    "content": "Comment text",
    "parentId": "parent_comment_id_or_null"
  }
  ```
  Headers: `Authorization: Bearer <jwt_token>`
  
- `DELETE /api/comments/:id` - Delete a comment (requires authentication and ownership)
  Headers: `Authorization: Bearer <jwt_token>`

### Users
- `GET /api/users` - Get all users (public)

## 🗄️ Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed with bcryptjs),
  avatar: String (default: placeholder),
  createdAt: Date
}
```

### Comment Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  content: String (required),
  parentId: ObjectId | null (ref: Comment),
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 Design Notes

The application matches the provided screenshot with:
- Orange timestamp text (`#F59E0B`)
- Purple reply links (`#8B5CF6`)
- User avatars (60x60px, rounded)
- Nested indentation (48px per level)
- Clean borders and spacing
- Responsive layout

## 🧪 Testing the Application

### Basic Testing
1. **View existing comments**: See the seeded data displayed in nested format
2. **Add a new comment**: Use the form at the top (requires login)
3. **Reply to a comment**: Click "Reply" under any comment
4. **Check nesting**: Replies should appear indented under their parents
5. **Delete your comment**: Click delete on your own comments

### 🔌 Testing Real-Time Features

**Open the app in multiple browser windows to see real-time updates:**

1. **Open two browser windows**:
   ```
   Window 1: http://localhost:3000
   Window 2: http://localhost:3000 (incognito/private mode)
   ```

2. **Test real-time comment creation**:
   - Login in Window 1 (use alex@example.com / password123)
   - Post a new comment
   - ✅ Watch it appear instantly in Window 2 (no refresh!)

3. **Test real-time replies**:
   - Reply to a comment in Window 1
   - ✅ See the nested reply appear immediately in Window 2

4. **Test real-time deletion**:
   - Delete your comment in Window 1
   - ✅ Watch it disappear from Window 2 in real-time

**Console logs** (Open DevTools > Console):
```
🔌 Connected to real-time server
📨 New comment received
🗑️ Comment deleted
```

**For complete real-time documentation**, see [REALTIME_FEATURES.md](./REALTIME_FEATURES.md)

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `net start MongoDB` (Windows)
- Check the connection string in `.env`
- Verify firewall isn't blocking port 27017

### Port Already in Use
- Backend (5000): Change `PORT` in `.env`
- Frontend (3000): React will prompt to use another port

### Packages Not Installing
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force client/node_modules
npm run install-all
```

## 📝 Development Notes

### Adding New Features
- Backend routes go in `server/routes/`
- React components go in `client/src/components/`
- Mongoose models go in `server/models/`

### Customization
- Colors: Edit `client/tailwind.config.js`
- API URL: Configured via proxy in `client/package.json`
- Database: Modify `.env` file

## 🌐 Production Deployment

### Railway (Backend) + Vercel (Frontend)

**Quick Steps**:
1. Create MongoDB Atlas database (free)
2. Deploy backend to Railway
3. Deploy frontend to Vercel
4. Connect them with environment variables

**Complete Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed step-by-step instructions

**Quick Reference**: See [DEPLOYMENT_QUICKREF.md](./DEPLOYMENT_QUICKREF.md) for quick commands

**Alternative**: See [DOCKER_README.md](./DOCKER_README.md) for Docker-based deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created for Ellty Test Assignment

---

**Happy Coding! 🚀**
Public repo in order to complete Ellty Second Test Assignment
