# 🚀 Deployment Checklist

Use this checklist to ensure a smooth deployment of the Ellty Comment System.

---

## 📋 Pre-Deployment Checklist

### Security Configuration
- [ ] Copy `.env.production` to `.env`
- [ ] Generate a strong JWT secret (at least 32 characters)
  ```powershell
  # Generate random JWT secret
  -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
  ```
- [ ] Update `JWT_SECRET` in `.env` file
- [ ] Change MongoDB root password in `.env` from default `admin123`
- [ ] Update `MONGO_INITDB_ROOT_PASSWORD` in `.env`
- [ ] Review CORS settings in `server/index.js` if deploying to a domain

### Docker Environment
- [ ] Docker Desktop is installed and running
- [ ] Docker Compose is available (v1.27.0 or higher)
- [ ] Sufficient disk space (at least 2GB free)

### Code Review
- [ ] All tests pass (if applicable)
- [ ] No sensitive data in code (API keys, passwords, etc.)
- [ ] `.gitignore` includes `.env` file
- [ ] Environment variables are properly referenced

---

## 🐳 Docker Deployment Steps

### Production Deployment

#### Step 1: Configure Environment
```powershell
# 1. Copy environment template
Copy-Item .env.production .env

# 2. Generate strong JWT secret
$jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
Write-Host "Your JWT Secret: $jwtSecret"

# 3. Edit .env file and paste the JWT secret
notepad .env
```

#### Step 2: Build and Deploy
```powershell
# Option A: Use the startup script (Recommended)
.\start-production.ps1

# Option B: Manual deployment
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

#### Step 3: Verify Deployment
```powershell
# Check all services are running
docker-compose ps

# Expected output:
# NAME                IMAGE                  STATUS
# ellty-backend       ellty-tests2-backend   Up (healthy)
# ellty-frontend      ellty-tests2-frontend  Up (healthy)
# ellty-mongodb       mongo:7.0              Up (healthy)
```

#### Step 4: Seed Database (Optional)
```powershell
# Access backend container
docker exec -it ellty-backend sh

# Run seed script
node server/seed.js

# Exit container
exit
```

Test accounts after seeding:
- **alex@example.com** / password123
- **sarah@example.com** / password123
- **mike@example.com** / password123
- **emma@example.com** / password123
- **david@example.com** / password123

#### Step 5: Test Application
- [ ] Open browser: `http://localhost`
- [ ] Frontend loads successfully
- [ ] Can view comments without authentication
- [ ] Register a new account
- [ ] Login with registered account
- [ ] Create a new comment
- [ ] Reply to a comment
- [ ] Collapse/expand replies
- [ ] Load more replies (if > 5 replies)
- [ ] Delete your own comment
- [ ] Logout and verify comment persistence

---

## 🔍 Health Check Commands

### Check Service Status
```powershell
docker-compose ps
```

### View Service Logs
```powershell
# All services
docker-compose logs -f

# Specific services
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Test API Endpoints
```powershell
# Health check
curl http://localhost:5000/api/health

# Get comments (should return JSON)
curl http://localhost:5000/api/comments

# Get users
curl http://localhost:5000/api/users
```

### MongoDB Connection Test
```powershell
docker exec -it ellty-mongodb mongosh -u admin -p <your-password>

# Inside mongosh:
use ellty-comments
show collections
db.users.countDocuments()
db.comments.countDocuments()
exit
```

---

## 🛠️ Troubleshooting

### Container Won't Start
```powershell
# View detailed logs
docker-compose logs <service-name>

# Rebuild specific service
docker-compose up -d --build <service-name>

# Check container status
docker inspect ellty-backend
```

### MongoDB Connection Failed
```powershell
# Check MongoDB logs
docker-compose logs mongodb

# Verify MongoDB is running
docker exec -it ellty-mongodb mongosh -u admin -p <password>

# Check connection string in backend
docker exec -it ellty-backend sh
echo $MONGODB_URI
```

### Frontend Not Loading
```powershell
# Check nginx logs
docker-compose logs frontend

# Test nginx configuration
docker exec -it ellty-frontend nginx -t

# Rebuild frontend
docker-compose up -d --build frontend
```

### Port Conflicts
```powershell
# Check what's using ports
Get-NetTCPConnection | Where-Object {$_.LocalPort -eq 80 -or $_.LocalPort -eq 5000 -or $_.LocalPort -eq 27017}

# Stop existing containers
docker-compose down

# Kill processes using the ports
Stop-Process -Id <PID>
```

### API Returns 401 Unauthorized
- Check JWT_SECRET is the same in `.env` and running container
- Verify token is being sent in Authorization header
- Clear browser localStorage and login again

### Complete Reset
```powershell
# Stop everything
docker-compose down -v

# Remove all Docker resources
docker system prune -a --volumes

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up -d
```

---

## 🌐 Production Hosting

### Before Going Live

#### Security Hardening
- [ ] Use strong, unique passwords for MongoDB
- [ ] Enable HTTPS with SSL/TLS certificates (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Set up rate limiting for API endpoints
- [ ] Enable CORS only for your domain
- [ ] Use environment-specific secrets (not in code)

#### Domain Configuration
Update `nginx.conf`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    # ... rest of config
}
```

Update `server/index.js` CORS:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

#### Database Backup
```powershell
# Create backup script
docker exec ellty-mongodb mongodump --username admin --password <password> --out /backup

# Copy backup to host
docker cp ellty-mongodb:/backup ./mongodb-backup
```

#### Monitoring
- [ ] Set up log aggregation (ELK, Splunk, etc.)
- [ ] Configure health check monitoring
- [ ] Set up alerts for service failures
- [ ] Monitor disk space for MongoDB volume

---

## 📊 Performance Optimization

### Production Optimizations
- [ ] Enable nginx gzip compression (already configured)
- [ ] Set up CDN for static assets
- [ ] Configure MongoDB indexes for performance
- [ ] Implement API response caching
- [ ] Set up load balancing (if needed)

### Resource Limits
Update `docker-compose.yml` with resource limits:
```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
```

---

## ✅ Post-Deployment Checklist

- [ ] All services are running and healthy
- [ ] Application is accessible via browser
- [ ] Authentication flow works correctly
- [ ] Comments can be created, read, and deleted
- [ ] Database is persistent across container restarts
- [ ] Logs are being collected
- [ ] Backups are configured
- [ ] Monitoring is active
- [ ] Documentation is updated
- [ ] Team is trained on deployment process

---

## 📞 Support

If you encounter issues:

1. **Check logs first**: `docker-compose logs -f`
2. **Review troubleshooting section** above
3. **Verify environment variables**: `docker-compose config`
4. **Test individual services**: Use health check commands
5. **Complete reset**: Follow "Complete Reset" steps if needed

---

## 🔄 Update Procedure

When deploying updates:

```powershell
# 1. Pull latest changes
git pull origin main

# 2. Rebuild containers
docker-compose build --no-cache

# 3. Restart services (with minimal downtime)
docker-compose up -d

# 4. Verify health
docker-compose ps
docker-compose logs -f
```

---

**Deployment Guide Version**: 1.0  
**Last Updated**: 2024
