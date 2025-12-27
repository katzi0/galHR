# Setup Checklist - Fix "Internal Server Error"

## ✅ Completed
- ✅ Code deployed to Vercel
- ✅ Code pushed to GitHub: https://github.com/katzi0/galHR
- ✅ Live at: https://galhr.vercel.app

## 🔧 To Fix the "Internal Server Error"

Follow these steps **in order**:

### Step 1: Create Vercel Postgres Database (2 minutes)

1. Go to: https://vercel.com/katzi0-3178s-projects/galhr
2. Click the **Storage** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Name: `hr-management-db`
6. Click **"Create"**
7. Click **"Connect Project"** → Select `galhr`

✅ This automatically adds: `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, `POSTGRES_URL_NON_POOLING`

### Step 2: Add DATABASE_URL (1 minute)

1. Go to **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Fill in:
   - **Name**: `DATABASE_URL`
   - **Value**: Copy the value from `POSTGRES_PRISMA_URL` (from Step 1)
   - **Environments**: Check all boxes (Production, Preview, Development)
4. Click **"Save"**

### Step 3: Add JWT_SECRET (1 minute)

Use this generated secret: `sVi/28KB8hUBMDLF1CHDigQndlj6BXYdfJ7540YWBbA=`

1. In **Settings** → **Environment Variables**
2. Click **"Add New"**
3. Fill in:
   - **Name**: `JWT_SECRET`
   - **Value**: `sVi/28KB8hUBMDLF1CHDigQndlj6BXYdfJ7540YWBbA=`
   - **Environments**: Check all boxes
4. Click **"Save"**

### Step 4: Create Vercel Blob Storage (1 minute)

1. Go back to **Storage** tab
2. Click **"Create Database"** → Select **"Blob"**
3. Name: `hr-receipts`
4. Click **"Create"**
5. Click **"Connect Project"** → Select `galhr`

✅ This automatically adds: `BLOB_READ_WRITE_TOKEN`

### Step 5: Redeploy (2 minutes)

After adding all environment variables, redeploy:

```bash
cd /Users/shai/galHR
vercel --prod
```

Or click **"Redeploy"** in the Vercel dashboard.

### Step 6: Setup Database (2 minutes)

Run the automated setup script:

```bash
cd /Users/shai/galHR
./setup-database.sh
```

This will:
- Pull environment variables from Vercel
- Run database migrations
- Optionally seed with sample data

**OR** do it manually:

```bash
# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# (Optional) Seed database
npx prisma db seed
```

### Step 7: Test! 🎉

1. Visit: https://galhr.vercel.app
2. You should see the landing page (no more errors!)
3. Click **"Login"**
4. Use seeded credentials:
   - **Email**: admin@example.com
   - **Password**: admin123

---

## Quick Reference

### Your URLs
- **Live App**: https://galhr.vercel.app
- **GitHub**: https://github.com/katzi0/galHR
- **Vercel Dashboard**: https://vercel.com/katzi0-3178s-projects/galhr

### Environment Variables Needed
- ✅ `DATABASE_URL` (copy from POSTGRES_PRISMA_URL)
- ✅ `POSTGRES_URL` (auto-added)
- ✅ `POSTGRES_PRISMA_URL` (auto-added)
- ✅ `POSTGRES_URL_NON_POOLING` (auto-added)
- ✅ `JWT_SECRET`: `sVi/28KB8hUBMDLF1CHDigQndlj6BXYdfJ7540YWBbA=`
- ✅ `BLOB_READ_WRITE_TOKEN` (auto-added)

### Default Credentials (After Seeding)
- **Admin**: admin@example.com / admin123
- **Employee**: john@example.com / admin123
- **Employee**: jane@example.com / admin123
- **Volunteer**: volunteer@example.com / admin123

---

## Troubleshooting

### Still getting "Internal Server Error"?

1. **Check environment variables are set**:
   ```bash
   vercel env ls
   ```

2. **Check deployment logs**:
   ```bash
   vercel logs
   ```

3. **Verify database connection**:
   - Make sure Postgres database is created
   - Verify `DATABASE_URL` matches `POSTGRES_PRISMA_URL`

4. **Re-run migrations**:
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

### Need to reset everything?

```bash
# Reset database
npx prisma migrate reset

# Redeploy
vercel --prod
```

---

**Total Setup Time: ~10 minutes**

After completing these steps, your HR Management System will be fully functional! 🚀

