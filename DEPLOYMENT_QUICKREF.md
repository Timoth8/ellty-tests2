# 🚀 Quick Deployment Reference

## Prerequisites ✅
- [ ] GitHub account
- [ ] Code pushed to GitHub
- [ ] Railway account (free)
- [ ] Vercel account (free)
- [ ] MongoDB Atlas account (free)

---

## 🗄️ MongoDB Atlas Setup (5 minutes)

1. **Create cluster**: https://www.mongodb.com/cloud/atlas/register
2. **Create user**: Database Access → Add User
3. **Whitelist IPs**: Network Access → Add IP → 0.0.0.0/0
4. **Get connection string**: 
   ```
   mongodb+srv://dbUser:PASSWORD@cluster0.xxxxx.mongodb.net/ellty-comments
   ```

---

## 🚂 Railway Backend (10 minutes)

### Deploy:
1. Go to https://railway.app/
2. New Project → Deploy from GitHub
3. Select `ellty-tests2` repo

### Configure:
Go to Variables tab and add:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<random-32-character-string>
CLIENT_URL=https://your-app.vercel.app
```

### Get Backend URL:
Settings → Domains → Copy URL (e.g., `https://xxx.up.railway.app`)

---

## 🔺 Vercel Frontend (10 minutes)

### Deploy:
1. Go to https://vercel.com/
2. Add New → Project → Import from GitHub
3. Select `ellty-tests2` repo
4. **Root Directory**: Change to `client`

### Configure Environment Variables:
```
REACT_APP_API_URL=https://your-railway-app.up.railway.app
REACT_APP_SOCKET_URL=https://your-railway-app.up.railway.app
```

### Deploy:
Click "Deploy" button

---

## 🌱 Seed Database (5 minutes)

Update local `.env` with MongoDB Atlas connection string:
```powershell
npm run seed
```

---

## ✅ Test Deployment

1. Open Vercel URL
2. Register new account
3. Post a comment
4. Open in 2 windows to test real-time

---

## 🔄 Update Deployment

```powershell
git add .
git commit -m "Update"
git push
```

Both Railway and Vercel auto-deploy! ✨

---

## 📱 Your Live URLs

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-railway-app.up.railway.app`

---

## 💡 Quick Commands

```powershell
# View Railway logs
railway logs

# Force Railway redeploy
git commit --allow-empty -m "Redeploy" && git push

# Force Vercel redeploy
vercel --prod

# Test backend health
curl https://your-railway-app.up.railway.app/api/health
```

---

## 🐛 Common Issues

### Frontend can't connect to backend
→ Check CORS in Railway Variables: `CLIENT_URL=https://your-app.vercel.app`

### Socket.IO not connecting
→ Verify `REACT_APP_SOCKET_URL` in Vercel matches Railway URL

### 401 Unauthorized
→ Check `JWT_SECRET` is set in Railway

### MongoDB connection failed
→ Verify connection string and IP whitelist (0.0.0.0/0)

---

## 💰 Free Tier Limits

- **Railway**: $5 credit/month (~500 hours)
- **Vercel**: Unlimited (100GB bandwidth)
- **MongoDB Atlas**: 512MB storage

**Total Cost: $0** 🎉

---

**Full Guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
