# Development Scripts

## Quick Start
Run this to start both backend and frontend:
```powershell
npm run dev
```

## Individual Scripts

### Backend only
```powershell
npm run server
```

### Frontend only
```powershell
npm run client
```

### Seed database
```powershell
npm run seed
```

## First Time Setup
```powershell
.\setup.ps1
```

## Troubleshooting

### If ports are in use:
- Backend (port 5000): Change PORT in .env file
- Frontend (port 3000): React will prompt to use different port

### If MongoDB won't connect:
```powershell
# Start MongoDB
net start MongoDB

# Or check if it's running
Get-Service MongoDB
```

### Reset and reseed database:
```powershell
npm run seed
```
