# Docker Deployment Guide

## Prerequisites
- Docker Desktop installed and running
- Docker Compose installed
- PowerShell (for startup scripts)

---

## Quick Start

### Production Mode (Recommended for deployment)
```powershell
# 1. Copy environment template
Copy-Item .env.production .env

# 2. Edit .env and update JWT_SECRET and passwords
notepad .env

# 3. Run the startup script
.\start-production.ps1
```

The application will be available at `http://localhost`

### Development Mode (For local development with hot-reload)
```powershell
.\start-development.ps1
```

The application will be available at:
- Frontend: `http://localhost:3000` (with hot-reload)
- Backend: `http://localhost:5000` (with hot-reload)

---

## Manual Setup

### Production Deployment

#### 1. Configure Environment
```powershell
# Copy the environment template
Copy-Item .env.production .env

# Edit and update these values:
# - JWT_SECRET (use a strong random string)
# - MONGO_INITDB_ROOT_PASSWORD (change from default)
notepad .env
```

#### 2. Build and Start All Services
```powershell
docker-compose up -d --build
```

This will start:
- **MongoDB** on port 27017 (with persistent volume)
- **Backend API** on port 5000 (Express.js + Node.js)
- **Frontend** on port 80 (React + Nginx)

#### 3. Seed the Database (Optional)
```powershell
# Access the backend container
docker exec -it ellty-backend sh

# Run seed script to create test users and comments
node server/seed.js

# Exit container
exit
```

Test credentials after seeding:
- alex@example.com / password123
- sarah@example.com / password123
- mike@example.com / password123

#### 4. Access the Application
Open browser: `http://localhost`

#### 5. Stop Services
```powershell
docker-compose down
```

#### 6. Stop and Remove Volumes (Clean Reset)
```powershell
docker-compose down -v
```

---

## Development Mode

### Full Docker Development Environment
```powershell
docker-compose -f docker-compose.dev.yml up -d
```

This provides:
- Hot-reload for backend (nodemon)
- Hot-reload for frontend (react-scripts)
- Volume mounts for real-time code changes
- Accessible at: http://localhost:3000

### Hybrid Development (Local Frontend + Docker Backend)
```powershell
# Start only backend and database
docker-compose -f docker-compose.dev.yml up -d mongodb backend

# Run frontend locally
cd client
npm install
npm start
```

---

## Useful Commands

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Rebuild Specific Service
```powershell
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Access Container Shell
```powershell
docker exec -it ellty-backend sh
docker exec -it ellty-mongodb mongosh -u admin -p admin123
```

### Check Service Health
```powershell
docker-compose ps
```

### Remove Everything and Start Fresh
```powershell
docker-compose down -v
docker system prune -a
docker-compose up -d --build
```

---

## Environment Variables

Update these in `docker-compose.yml` for production:

- `MONGODB_URI`: Database connection string
- `JWT_SECRET`: Change to a secure random string
- `MONGO_INITDB_ROOT_PASSWORD`: Change MongoDB password

---

## Port Mapping

- **80** → Frontend (Nginx)
- **5000** → Backend API
- **27017** → MongoDB

---

## Volumes

- `mongodb_data`: Persistent MongoDB data storage

---

## Networks

- `ellty-network`: Bridge network for container communication

---

## Production Checklist

- [ ] Change JWT_SECRET to secure value
- [ ] Change MongoDB passwords
- [ ] Update CORS settings if deploying to domain
- [ ] Configure SSL/TLS certificates
- [ ] Set up backup for MongoDB volume
- [ ] Configure monitoring and logging
- [ ] Update nginx.conf for your domain

---

## Troubleshooting

### MongoDB Connection Issues
```powershell
docker-compose logs mongodb
docker exec -it ellty-mongodb mongosh -u admin -p admin123
```

### Backend Not Starting
```powershell
docker-compose logs backend
docker exec -it ellty-backend sh
```

### Frontend Build Fails
```powershell
docker-compose logs frontend
docker-compose up --build frontend
```

### Reset Everything
```powershell
docker-compose down -v
docker system prune -a
docker volume prune
docker-compose up -d --build
```
