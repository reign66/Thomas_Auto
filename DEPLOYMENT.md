# 🚀 Deployment Ready

This project is **ready for Railway deployment**.

## ✅ Pre-deployment Checklist

- [x] `railway.json` configured
- [x] `package.json` with build/start scripts
- [x] TypeScript configuration (`tsconfig.json`)
- [x] Environment variables template (`.env.example`)
- [x] Health check endpoint (`/health`)
- [x] All source files present
- [x] Dependencies defined

## 🚂 Railway Deployment

### Quick Deploy

1. Go to https://railway.app/
2. Click "New Project" → "Deploy from GitHub repo"
3. Select repository: **Thomas-Auto**
4. Railway will automatically:
   - Detect `railway.json`
   - Run `npm install`
   - Run `npm run build` (via postinstall)
   - Start with `npm start`

### Environment Variables

Add these in Railway dashboard → Variables:

```
PORT=3000
NODE_ENV=production
CALENDLY_WEBHOOK_SECRET=your_secret
ANTHROPIC_API_KEY=sk-ant-api03-your_key
NOTION_API_KEY=ntn_your_notion_key
NOTION_DATABASE_ID=your_database_id
APP_URL=https://your-app.railway.app
```

### Webhook URL

After deployment, update Calendly webhook URL to:
```
https://your-app.railway.app/webhooks/calendly
```

## ✅ Status: READY FOR DEPLOYMENT
