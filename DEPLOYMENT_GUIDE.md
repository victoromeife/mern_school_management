# Deployment Guide - MERN School Management

## Overview
This application is ready for production deployment on:
- **Backend**: Render.com (or similar Node.js hosting)
- **Frontend**: Vercel.com (or similar React hosting)

---

## Prerequisites

### Backend Requirements
- Node.js 14+ 
- MongoDB Atlas account (free tier available)
- Email service account (Gmail, SendGrid, or Mailgun)

### Frontend Requirements
- Vercel account (free tier available)
- Git repository (GitHub)

---

## Step 1: Backend Deployment to Render

### 1.1 Set up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Create a database user with username/password
4. Get your connection string: `mongodb+srv://username:password@cluster.mongodb.net/dbname`

### 1.2 Set up Email Service

Choose one (Gmail is easiest):

**Gmail:**
1. Enable 2-factor authentication on your Gmail account
2. [Generate an App Password](https://myaccount.google.com/apppasswords)
3. Use these credentials:
   - EMAIL_SERVICE: `Gmail`
   - EMAIL_USER: `your-email@gmail.com`
   - EMAIL_PASS: `your-app-password`

**Alternative: SendGrid**
1. Sign up at [SendGrid](https://sendgrid.com)
2. Create and verify a sender identity
3. Generate an API key
4. Use these credentials:
   - EMAIL_SERVICE: `SendGrid`
   - EMAIL_USER: `apikey`
   - EMAIL_PASS: `sg.your-api-key`

### 1.3 Prepare Backend Environment Variables

Create `.env` file in the `backend/` directory with these values:

```env
# MongoDB
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/school_management

# JWT Settings
JWT_SECRET=your-super-secret-jwt-key-make-it-random-and-long

# Email Service (Gmail example)
EMAIL_SERVICE=Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Deployment URLs (UPDATE THESE AFTER GETTING RENDER URL)
FRONTEND_URL=https://your-vercel-app.vercel.app
BACKEND_URL=https://your-render-app.onrender.com
RENDER_URL=https://your-render-app.onrender.com

# Environment
NODE_ENV=production
PORT=5000
```

### 1.4 Deploy to Render

1. Push your code to GitHub (if not already done)
2. Go to [Render.com](https://render.com)
3. Click "New Web Service"
4. Connect your GitHub repository
5. Configure deployment settings:
   - **Name**: `school-management-api`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Add environment variables from step 1.3 in Render's environment dashboard
7. Deploy
8. **Copy your Render URL** (format: `https://your-render-app.onrender.com`)

### 1.5 Update Frontend URL in Backend

After deploying to Render:
1. Go back to your Render dashboard
2. Add environment variable `FRONTEND_URL=https://your-vercel-app.vercel.app` (update with your Vercel URL later)

---

## Step 2: Frontend Deployment to Vercel

### 2.1 Prepare Frontend Environment Variables

Create `.env.production` file in `frontend/` directory:

```env
VITE_API_URL=https://your-render-app.onrender.com/api
```

### 2.2 Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./frontend`
5. Add environment variables:
   - `VITE_API_URL`: `https://your-render-app.onrender.com/api`
6. Deploy
7. **Copy your Vercel URL** (format: `https://your-app.vercel.app`)

### 2.3 Update Backend URL in Frontend

After deploying to Vercel:
1. Update `.env.production` with your actual Render backend URL
2. Redeploy

---

## Step 3: Cross-Update URLs

### 3.1 Backend `.env` Settings

Update your Render environment variables with your Vercel URL:
- `FRONTEND_URL=https://your-app.vercel.app`
- `BACKEND_URL=https://your-render-app.onrender.com`
- `RENDER_URL=https://your-render-app.onrender.com`

### 3.2 Frontend `.env.production` Settings

Already updated in Step 2.2:
- `VITE_API_URL=https://your-render-app.onrender.com/api`

---

## Step 4: Testing Deployed Application

### 4.1 Test Backend Health

```bash
curl https://your-render-app.onrender.com/api/health
```

Should return: OK status

### 4.2 Test Frontend Access

1. Visit `https://your-app.vercel.app`
2. Should load without errors
3. Check browser console for any API errors

### 4.3 Test Registration Flow

1. Click "New Account" on login page
2. Fill in admin registration form if first user
3. **Verify you receive verification email**
4. Click email verification link
5. Should redirect to login page
6. Login with credentials

### 4.4 Test Password Reset

1. On login page, click "Forgot Password"
2. Enter email address
3. **Verify you receive password reset email**
4. Click reset link
5. Set new password
6. Login with new password

---

## Troubleshooting

### Email Not Sending

**Issue**: Registration works but no verification email received

**Solutions**:
1. Check backend logs on Render dashboard for email service errors
2. Verify EMAIL_SERVICE, EMAIL_USER, EMAIL_PASS are correct
3. For Gmail: Ensure App Password is used (not regular password)
4. For SendGrid: Verify sender identity is confirmed in SendGrid dashboard
5. Check spam/junk email folder

### Frontend Can't Connect to Backend

**Issue**: Frontend loads but API calls fail with CORS error

**Solutions**:
1. Verify `VITE_API_URL` in `.env.production` matches your Render backend URL
2. Check backend `.env` has correct `FRONTEND_URL`
3. Backend CORS should already be configured for any origin during development
4. Check browser network tab to see actual API URL being called

### Render App Won't Start

**Issue**: Deployment fails or app crashes on Render

**Solutions**:
1. Check Render logs for errors
2. Verify all required environment variables are set
3. Ensure MongoDB connection string is correct
4. Check Node.js version compatibility (14+ required)
5. Verify `npm start` works locally first

### Database Connection Issues

**Issue**: Backend can't connect to MongoDB

**Solutions**:
1. Verify MongoDB Atlas connection string with correct username/password
2. Whitelist Render IP in MongoDB Atlas (Network Access section)
3. Ensure database name in connection string is correct
4. Check MONGO_URI format: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`

---

## Production Checklist

- [ ] MongoDB Atlas cluster created and configured
- [ ] Email service account set up and credentials verified
- [ ] Backend `.env` file created with all variables
- [ ] Backend deployed to Render
- [ ] Render URL obtained and saved
- [ ] Frontend `.env.production` created with backend URL
- [ ] Frontend deployed to Vercel
- [ ] Vercel URL obtained and saved
- [ ] Backend environment variables updated with Vercel URL
- [ ] Both applications tested (health checks, registration, email, password reset)
- [ ] SSL certificates verified (Render/Vercel handle automatically)
- [ ] Domain configured (optional, for custom domains)

---

## Security Notes

1. **DO NOT** commit `.env` files to GitHub
2. Use strong `JWT_SECRET` (at least 32 characters)
3. Enable 2FA on MongoDB Atlas and email service accounts
4. Regularly rotate credentials
5. Monitor backend logs for suspicious activity
6. Keep dependencies updated

---

## Post-Deployment

### Monitor Performance
- Check Render dashboard for CPU/memory usage
- Monitor Vercel analytics for frontend performance
- Set up error notifications in both platforms

### Data Management
- Regular MongoDB backups (Atlas provides automated backups on paid plans)
- Monitor database growth
- Set up indexes for frequently queried fields

### Updates & Maintenance
- When updating code, push to GitHub
- Render and Vercel will auto-deploy (if configured)
- Test staging environment before pushing to production

---

## Quick Reference URLs

**After Deployment:**
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-render-app.onrender.com/api`
- MongoDB Atlas: `https://atlas.mongodb.com`
- Render Dashboard: `https://dashboard.render.com`
- Vercel Dashboard: `https://vercel.com/dashboard`

---

## Need Help?

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://www.mongodb.com/docs/atlas/)
- [Nodemailer Docs](https://nodemailer.com/smtp/)
