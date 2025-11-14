# Ellty Comment System

A full-stack nested comment system built with React, Express.js, MongoDB, and Tailwind CSS.

## 📋 Features

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

### Frontend
- **React** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Context API** - State management

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file serving

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

1. **View existing comments**: See the seeded data displayed in nested format
2. **Add a new comment**: Use the form at the top
3. **Reply to a comment**: Click "Reply" under any comment
4. **Check nesting**: Replies should appear indented under their parents

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
