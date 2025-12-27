# Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database (local or cloud)

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:

```env
# Database URLs
DATABASE_URL="postgresql://user:password@localhost:5432/hr_management"
POSTGRES_URL="postgresql://user:password@localhost:5432/hr_management"
POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/hr_management?pgbouncer=true"
POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/hr_management"

# JWT Secret (change in production!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Vercel Blob Token (optional for local dev)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token-here"
```

### 3. Set Up Database
```bash
# Run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database with sample data (optional)
npx prisma db seed
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login Credentials (After Seeding)

### Admin Account
- **Email**: admin@example.com
- **Password**: admin123

### Employee Accounts
- **Email**: john@example.com
- **Password**: admin123

- **Email**: jane@example.com
- **Password**: admin123

### Volunteer Account
- **Email**: volunteer@example.com
- **Password**: admin123

## Testing the Application

### As an Employee/Volunteer:
1. Login with employee credentials
2. Navigate to Dashboard
3. Submit work hours, expenses, vacation requests, or travel reports
4. View your submissions and their approval status

### As an Admin:
1. Login with admin credentials
2. Navigate to Admin Dashboard
3. View system statistics
4. Manage users in the Users section
5. Review and approve/reject entries in the Entries section

## Common Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma studio        # Open Prisma Studio (database GUI)
npx prisma migrate dev   # Create a new migration
npx prisma migrate reset # Reset database and re-run migrations
npx prisma db seed       # Seed database with sample data
npx prisma generate      # Generate Prisma client
```

## Project Structure Overview

```
galHR/
├── app/                    # Next.js pages and API routes
│   ├── api/               # Backend API endpoints
│   ├── admin/             # Admin dashboard pages
│   ├── dashboard/         # User dashboard pages
│   └── (auth pages)       # Login and register
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication forms
│   ├── entries/          # Entry submission forms
│   ├── layout/           # Layout components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions
│   ├── auth.ts          # JWT and password utilities
│   ├── blob.ts          # File upload utilities
│   ├── db.ts            # Prisma database client
│   └── validations.ts   # Zod validation schemas
└── prisma/              # Database schema and migrations
    ├── schema.prisma    # Database schema
    └── seed.ts          # Seed script
```

## Features Overview

### User Features
- ✅ Work hours tracking
- ✅ Expense reporting with receipt upload
- ✅ Vacation request submission
- ✅ Travel report logging
- ✅ View submission history and status

### Admin Features
- ✅ User management
- ✅ Entry approval/rejection
- ✅ System statistics dashboard
- ✅ Filter and search entries
- ✅ View all user activity

## Troubleshooting

### Database Connection Issues
- Verify your DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database credentials

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npx prisma generate
```

### Authentication Issues
- Clear browser localStorage
- Verify JWT_SECRET is set
- Check token expiration (7 days default)

## Next Steps

1. **Customize**: Update branding, colors, and content
2. **Deploy**: Follow deployment guide in README.md
3. **Secure**: Change JWT_SECRET and default passwords
4. **Configure**: Set up production database and blob storage

## Support

For detailed documentation, see [README.md](./README.md)

For implementation details, see [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)

