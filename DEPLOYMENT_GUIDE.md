# Deployment Guide - HR Management System

## 🚀 Deploy to Vercel (Recommended)

Follow these steps to deploy your HR Management System to Vercel with a live database.

---

## Step 1: Push to GitHub

Your code is already committed locally. Now push it to GitHub:

### Option A: Using GitHub CLI (if installed)
```bash
gh repo create galHR --public --source=. --remote=origin --push
```

### Option B: Using Git (manual)
1. Go to [github.com](https://github.com) and create a new repository named `galHR`
2. Don't initialize with README (we already have one)
3. Copy the repository URL
4. Run these commands:
```bash
cd /Users/shai/galHR
git remote add origin https://github.com/YOUR_USERNAME/galHR.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### 2.1 Sign Up/Login to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or login (use GitHub for easier integration)

### 2.2 Import Your Project
1. Click **"Add New..."** → **"Project"**
2. Import your `galHR` repository from GitHub
3. Vercel will auto-detect it's a Next.js project

### 2.3 Configure Build Settings
Vercel should auto-detect these settings:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

**✅ Leave these as default** - they're already correct!

---

## Step 3: Set Up Vercel Postgres Database

### 3.1 Create Database
1. In your Vercel project dashboard, go to the **Storage** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose a name (e.g., `hr-management-db`)
5. Select your preferred region (choose closest to your users)
6. Click **"Create"**

### 3.2 Connect Database to Project
1. After creation, click **"Connect Project"**
2. Select your `galHR` project
3. Vercel will automatically add these environment variables:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_URL_NO_SSL`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

### 3.3 Add DATABASE_URL
The app also needs `DATABASE_URL`:
1. Go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name**: `DATABASE_URL`
   - **Value**: Copy the value from `POSTGRES_PRISMA_URL`
   - **Environment**: Production, Preview, Development

---

## Step 4: Set Up Vercel Blob Storage

### 4.1 Create Blob Store
1. In your Vercel project, go to **Storage** tab
2. Click **"Create Database"** → **"Blob"**
3. Choose a name (e.g., `hr-receipts`)
4. Click **"Create"**

### 4.2 Connect to Project
1. Click **"Connect Project"**
2. Select your `galHR` project
3. Vercel will add `BLOB_READ_WRITE_TOKEN` automatically

---

## Step 5: Add JWT Secret

1. Go to **Settings** → **Environment Variables**
2. Add a new variable:
   - **Name**: `JWT_SECRET`
   - **Value**: Generate a strong random string (at least 32 characters)
   - **Environment**: Production, Preview, Development

### Generate a secure JWT secret:
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use Node:
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and use it as your `JWT_SECRET`.

---

## Step 6: Deploy!

1. Click **"Deploy"** in Vercel
2. Wait for the build to complete (2-3 minutes)
3. You'll get a URL like: `https://galhr-xxx.vercel.app`

---

## Step 7: Run Database Migrations

After deployment, you need to set up the database schema:

### Option A: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
cd /Users/shai/galHR
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# (Optional) Seed the database
npx prisma db seed
```

### Option B: Using Prisma Data Platform
1. Go to [cloud.prisma.io](https://cloud.prisma.io)
2. Connect your database
3. Run migrations through the web interface

### Option C: Manual SQL (Advanced)
1. Get your database connection string from Vercel
2. Use a PostgreSQL client (like TablePlus, pgAdmin, or psql)
3. Connect to your database
4. Run the migration SQL manually

---

## Step 8: Seed the Database (Optional)

To add sample users and data:

```bash
# Make sure you have .env.local with production credentials
vercel env pull .env.local

# Run seed script
npx prisma db seed
```

This will create:
- Admin user: admin@example.com / admin123
- Employee users: john@example.com, jane@example.com / admin123
- Volunteer: volunteer@example.com / admin123
- Sample entries

---

## Step 9: Test Your Deployment

1. Visit your Vercel URL (e.g., `https://galhr-xxx.vercel.app`)
2. You should see the landing page
3. Click **"Login"**
4. Use the seeded credentials (if you ran the seed):
   - **Email**: admin@example.com
   - **Password**: admin123

### Test Checklist:
- ✅ Landing page loads
- ✅ Can register a new account
- ✅ Can login with credentials
- ✅ Dashboard loads correctly
- ✅ Can submit work hours
- ✅ Can submit expenses (with file upload)
- ✅ Admin can view all users
- ✅ Admin can approve/reject entries
- ✅ Statistics dashboard shows data

---

## Step 10: Configure Custom Domain (Optional)

1. In Vercel project settings, go to **Domains**
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS
4. Wait for SSL certificate to be issued (automatic)

---

## Environment Variables Summary

Your Vercel project should have these environment variables:

### Database (Auto-added by Vercel Postgres)
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `DATABASE_URL` (manually add, copy from POSTGRES_PRISMA_URL)

### Storage (Auto-added by Vercel Blob)
- `BLOB_READ_WRITE_TOKEN`

### Security (Manually add)
- `JWT_SECRET` (generate a strong random string)

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify no syntax errors

### Database Connection Issues
- Verify DATABASE_URL is set correctly
- Check if migrations were run
- Ensure database is in the same region as deployment

### Authentication Not Working
- Verify JWT_SECRET is set
- Check browser console for errors
- Clear browser cache and localStorage

### File Upload Fails
- Verify BLOB_READ_WRITE_TOKEN is set
- Check file size limits (10MB default)
- Ensure file types are allowed (images, PDFs)

---

## Post-Deployment Security

### 1. Change Default Passwords
If you seeded the database, change all default passwords:
- Login as admin
- Go to user management
- Update passwords for all users

### 2. Rotate JWT Secret
- Generate a new JWT_SECRET periodically
- Update in Vercel environment variables
- Existing sessions will be invalidated

### 3. Monitor Usage
- Check Vercel Analytics
- Monitor database usage
- Review blob storage consumption

### 4. Set Up Monitoring
- Enable Vercel Speed Insights
- Set up error tracking (optional: Sentry)
- Configure uptime monitoring

---

## Updating Your Deployment

When you make changes:

```bash
# Make your changes
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically:
1. Detect the push
2. Build your project
3. Deploy to production
4. Run health checks

---

## Useful Commands

```bash
# View deployment logs
vercel logs

# Check deployment status
vercel ls

# Open project in browser
vercel open

# Pull environment variables
vercel env pull

# Add environment variable
vercel env add

# Redeploy
vercel --prod
```

---

## Success! 🎉

Your HR Management System is now live and accessible to the world!

**Next Steps:**
1. Share the URL with your team
2. Create user accounts for everyone
3. Customize branding and content
4. Set up backup procedures
5. Monitor usage and performance

---

## Support Resources

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Prisma Documentation**: [prisma.io/docs](https://prisma.io/docs)
- **Next.js Documentation**: [nextjs.org/docs](https://nextjs.org/docs)

For issues specific to this project, refer to:
- [README.md](./README.md)
- [QUICK_START.md](./QUICK_START.md)
- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

