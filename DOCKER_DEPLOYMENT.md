# Docker Deployment Guide

## 🐳 Docker Compose Setup

This application is containerized using Docker Compose with three services:
- **MongoDB** - Database
- **Backend** - Express.js API
- **Frontend** - React app served by Nginx

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 Quick Start

### 1. Configure Environment Variables

Create a production environment file:
```powershell
Copy-Item .env.production.example .env.production
```

Edit `.env.production` and update:
- `JWT_SECRET` - Use a strong random string
- MongoDB credentials (optional, defaults are set)

### 2. Build and Start Services

```powershell
# Build all containers
npm run docker:build

# Start all services in detached mode
npm run docker:up

# Or run both at once
docker-compose up -d --build
```

### 3. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

### 4. Seed the Database (Optional)

After containers are running, seed initial data:
```powershell
docker-compose exec backend node server/seed.js
```

## 📝 Available Docker Commands

```powershell
# Build containers
npm run docker:build

# Start services
npm run docker:up

# Stop services
npm run docker:down

# View logs (all services)
npm run docker:logs

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Restart services
npm run docker:restart

# Stop and remove volumes (clean database)
npm run docker:clean

# Execute commands in containers
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec mongodb mongosh
```

## 🏗️ Architecture

```
┌─────────────────┐
│   Port 80       │
│   Frontend      │  ← Nginx serving React build
│   (Container)   │
└────────┬────────┘
         │ API calls to /api/*
         ↓
┌─────────────────┐
│   Port 5000     │
│   Backend       │  ← Express.js API
│   (Container)   │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   Port 27017    │
│   MongoDB       │  ← Database
│   (Container)   │
└─────────────────┘
```

## 🔧 Configuration Files

- `docker-compose.yml` - Service orchestration
- `Dockerfile.backend` - Backend container definition
- `Dockerfile.frontend` - Frontend build and Nginx setup
- `nginx.conf` - Nginx reverse proxy configuration
- `.dockerignore` - Files to exclude from Docker context

## 🌐 Production Deployment

### Environment Variables

Set these in production:

```bash
JWT_SECRET=<strong-random-secret-key>
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/ellty-comments?authSource=admin
NODE_ENV=production
```

### Security Considerations

1. **Change MongoDB credentials** in `docker-compose.yml`
2. **Change JWT_SECRET** to a secure random string
3. **Use HTTPS** with a reverse proxy (Nginx/Traefik) in front
4. **Restrict MongoDB port** (remove port mapping if not needed externally)
5. **Set up firewall rules**
6. **Enable MongoDB authentication** (already configured)

### Persistence

MongoDB data is persisted in a Docker volume: `mongodb_data`

To backup:
```powershell
docker-compose exec mongodb mongodump --out /data/backup
docker cp ellty-mongodb:/data/backup ./backup
```

To restore:
```powershell
docker cp ./backup ellty-mongodb:/data/backup
docker-compose exec mongodb mongorestore /data/backup
```

## 🔍 Monitoring

### Health Checks

All services have health checks configured:
- Backend: `GET /api/health`
- Frontend: HTTP 200 on port 80
- MongoDB: mongosh ping

Check status:
```powershell
docker-compose ps
```

### View Resource Usage

```powershell
docker stats
```

## 🐛 Troubleshooting

### Services won't start

```powershell
# Check logs
docker-compose logs

# Check specific service
docker-compose logs backend
```

### MongoDB connection issues

```powershell
# Check MongoDB is healthy
docker-compose ps mongodb

# Test connection
docker-compose exec mongodb mongosh -u admin -p admin123
```

### Frontend not connecting to backend

- Check nginx.conf proxy settings
- Verify backend is running: `docker-compose ps backend`
- Check backend logs: `docker-compose logs backend`

### Reset everything

```powershell
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Rebuild from scratch
docker-compose up -d --build
```

## 📦 Volumes

- `mongodb_data` - MongoDB database files (persistent)

To remove volumes:
```powershell
docker-compose down -v
```

## 🔄 Updates

To update the application:

```powershell
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# Or step by step
docker-compose build
docker-compose up -d
```

## 💾 Backup Strategy

### Automated Backup Script

Create a backup script:
```powershell
# backup.ps1
$timestamp = Get-Date -Format "yyyy-MM-dd-HHmmss"
docker-compose exec -T mongodb mongodump --archive | Out-File "backup-$timestamp.archive"
```

### Restore from Backup

```powershell
Get-Content backup-2024-11-14-120000.archive | docker-compose exec -T mongodb mongorestore --archive
```

## 🌍 Cloud Deployment

### AWS ECS / Azure Container Instances

- Push images to container registry (ECR/ACR)
- Use managed MongoDB (Atlas/CosmosDB) or RDS
- Update MONGODB_URI environment variable
- Configure load balancer for frontend

### Kubernetes

Convert to Kubernetes manifests:
```powershell
# Install kompose
choco install kubernetes-kompose

# Convert docker-compose to k8s
kompose convert
```

## 📊 Scaling

To scale backend:
```powershell
docker-compose up -d --scale backend=3
```

Note: You'll need a load balancer (Nginx/HAProxy) in front for scaling.

---

**Ready for Production! 🚀**
