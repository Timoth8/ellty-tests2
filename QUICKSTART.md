# 🚀 Quick Start Guide

## Choose Your Setup Method

### 🐳 Option A: Docker (Recommended for Production)

#### Prerequisites
- [ ] Docker Desktop installed and running
- [ ] Docker Compose available

#### 3-Step Setup
```powershell
# 1. Configure environment
Copy-Item .env.production .env
notepad .env  # Update JWT_SECRET

# 2. Start application
.\start-production.ps1

# 3. Open browser
# http://localhost
```

**See [DOCKER_README.md](./DOCKER_README.md) for complete guide**

---

### 💻 Option B: Local Development (Without Docker)

#### Prerequisites
- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running
- [ ] Git (optional, for cloning)

#### 3-Step Setup

### Step 1️⃣: Install Dependencies
```powershell
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

**Or use the quick command:**
```powershell
npm run install-all
```

### Step 2️⃣: Start MongoDB
```powershell
# Windows: Start MongoDB service
net start MongoDB

# Or check if it's running
Get-Service MongoDB
```

### Step 3️⃣: Seed & Run
```powershell
# Seed the database with sample data
npm run seed

# Start both servers
npm run dev
```

## 🎉 That's It!

Open your browser to:
- **Docker**: `http://localhost`
- **Local Dev**: `http://localhost:3000`

You should see:
- ✅ **Real-time updates** - Open in multiple windows to see live updates!
- ✅ Login/Register functionality (JWT authentication)
- ✅ View comments without login (public access)
- ✅ Nested comments with zig-zag alignment
- ✅ Collapsible replies (default hidden)
- ✅ Delete own comments
- ✅ Beautiful UI with Tailwind CSS

### Test Accounts (After Seeding)
- alex@example.com / password123
- sarah@example.com / password123
- mike@example.com / password123

### 🔌 Test Real-Time Features
Open the app in **two browser windows**:
1. Post a comment in Window 1
2. ✅ Watch it appear instantly in Window 2!

See [REALTIME_FEATURES.md](./REALTIME_FEATURES.md) for details

---

## Alternative: Use Automated Setup

Run the PowerShell script:
```powershell
.\setup.ps1
```

This will:
1. Check Node.js installation
2. Check/start MongoDB
3. Install all dependencies
4. Seed the database
5. Give you instructions to start

---

## Troubleshooting

### Port already in use?
```powershell
# Change backend port in .env
PORT=5001

# Frontend will prompt to use a different port automatically
```

### MongoDB won't connect?
```powershell
# Option 1: Use MongoDB Atlas (cloud)
# Update .env with your Atlas connection string

# Option 2: Check local MongoDB
mongod --version
```

### Fresh start needed?
```powershell
# Clear everything and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force client/node_modules
npm run install-all
npm run seed
```

---

## 📝 Common Commands

### Docker Commands
| Command | Description |
|---------|-------------|
| `.\start-production.ps1` | Start production setup |
| `.\start-development.ps1` | Start dev with hot-reload |
| `docker-compose logs -f` | View logs |
| `docker-compose down` | Stop services |
| `docker-compose ps` | Check status |

### Local Development Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start both servers |
| `npm run server` | Backend only |
| `npm run client` | Frontend only |
| `npm run seed` | Reset database |

---

## 🎯 What You'll See

### Main Page Features:
1. **Login/Register** - JWT authentication system
2. **Comment Viewing** - Public access, no login needed
3. **Comment Form** - Add comments (requires login)
4. **Nested Replies** - Unlimited depth with zig-zag alignment
5. **Collapsible Replies** - Show/Hide nested comments
6. **Pagination** - Load 5 replies at a time
7. **Delete Button** - Remove your own comments
8. **User Avatars** - Profile pictures
9. **Timestamps** - Formatted dates

### Try These Actions:
- ✅ Register a new account
- ✅ Login with test account (alex@example.com / password123)
- ✅ View comments without login
- ✅ Add a new top-level comment (requires login)
- ✅ Reply to any comment
- ✅ Collapse/expand replies (default hidden)
- ✅ Load more replies if more than 5
- ✅ Delete your own comment
- ✅ Try to delete someone else's comment (should fail)

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **README.md** | Complete project documentation |
| **DOCKER_README.md** | Docker deployment guide |
| **DEPLOYMENT_CHECKLIST.md** | Pre-deployment checklist |
| **QUICKSTART.md** | This file - quick reference |

## 📚 Next Steps

Want to customize?
1. **Change colors**: Edit `client/tailwind.config.js`
2. **Modify authentication**: Check `server/middleware/auth.js`
3. **Add features**: Extend models in `server/models/`
4. **Deploy to production**: Follow `DEPLOYMENT_CHECKLIST.md`

## 🚀 Deployment Options

- **Docker** (Recommended): Complete containerized setup
- **Heroku**: Ready for deployment with MongoDB Atlas
- **Vercel** (Frontend) + Railway (Backend): Serverless option
- **AWS/Azure/GCP**: Full control with VMs

---

**Happy Coding! 🎨💻**

Need help? Check the full **README.md** for detailed documentation or **DEPLOYMENT_CHECKLIST.md** for production deployment.
