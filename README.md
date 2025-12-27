# HR Management System

A complete HR Management System built with Next.js 14, TypeScript, Prisma, and shadcn/ui.

## Features

### For Employees & Volunteers
- **Work Hours Tracking**: Submit and track work hours with detailed descriptions
- **Expense Management**: Report expenses with receipt uploads for reimbursement
- **Vacation Requests**: Request time off and track vacation days
- **Travel Reports**: Log business travel with distance tracking
- **Status Tracking**: View approval status for all submissions

### For Administrators
- **User Management**: Manage all users and their roles
- **Entry Approval**: Review and approve/reject all submissions
- **Statistics Dashboard**: View system-wide statistics and metrics
- **Comprehensive Reports**: Access detailed reports on hours, expenses, and more

### Demo Mode 🎭
- **Instant Demo**: Toggle demo mode to showcase the app with realistic mock data
- **No Setup Required**: Try all features without database configuration
- **Full Functionality**: Explore admin and user dashboards with sample data
- **Perfect for Presentations**: Show the system's capabilities immediately
- See [DEMO_MODE.md](./DEMO_MODE.md) for detailed documentation

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: shadcn/ui (Radix UI + Tailwind CSS)
- **Authentication**: JWT tokens
- **File Storage**: Vercel Blob
- **Form Validation**: Zod + React Hook Form
- **Styling**: Tailwind CSS

## Getting Started

### Quick Demo (No Setup Required)

Want to try the app immediately? Use **Demo Mode**:

1. Clone the repository and install dependencies
   ```bash
   git clone <repository-url>
   cd galHR
   npm install
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

3. Toggle **Demo Mode** in the navbar (top right)

4. Login with any credentials to explore the full admin dashboard with mock data

See [DEMO_MODE.md](./DEMO_MODE.md) for complete demo mode documentation.

### Full Setup (With Database)

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd galHR
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database URLs (Vercel Postgres or local PostgreSQL)
   DATABASE_URL="postgresql://user:password@localhost:5432/hr_management?schema=public"
   POSTGRES_URL="postgresql://user:password@localhost:5432/hr_management"
   POSTGRES_PRISMA_URL="postgresql://user:password@localhost:5432/hr_management?pgbouncer=true&connect_timeout=15"
   POSTGRES_URL_NON_POOLING="postgresql://user:password@localhost:5432/hr_management"

   # JWT Secret (use a strong random string in production)
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

   # Vercel Blob Storage (get from Vercel dashboard)
   BLOB_READ_WRITE_TOKEN="your-vercel-blob-token-here"
   ```

4. **Run database migrations**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. **Seed the database** (optional)
   ```bash
   npx prisma db seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Login Credentials

After running the seed script, you can use these credentials:

- **Admin**: 
  - Email: `admin@example.com`
  - Password: `admin123`

- **Employee 1**:
  - Email: `john@example.com`
  - Password: `admin123`

- **Employee 2**:
  - Email: `jane@example.com`
  - Password: `admin123`

- **Volunteer**:
  - Email: `volunteer@example.com`
  - Password: `admin123`

## Project Structure

```
galHR/
├── app/                      # Next.js App Router pages
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── entries/         # Entry management endpoints
│   │   ├── admin/           # Admin endpoints
│   │   └── upload/          # File upload endpoint
│   ├── dashboard/           # User dashboard pages
│   ├── admin/               # Admin dashboard pages
│   ├── login/               # Login page
│   ├── register/            # Registration page
│   └── page.tsx             # Landing page
├── components/              # React components
│   ├── auth/               # Authentication forms
│   ├── entries/            # Entry forms and lists
│   ├── admin/              # Admin components
│   ├── layout/             # Layout components
│   └── ui/                 # shadcn/ui components
├── lib/                     # Utility functions
│   ├── db.ts               # Prisma client
│   ├── auth.ts             # Authentication utilities
│   ├── blob.ts             # File storage utilities
│   ├── validations.ts      # Zod schemas
│   └── utils.ts            # General utilities
├── prisma/                  # Prisma schema and migrations
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seed script
└── public/                  # Static files
```

## Database Schema

### User Model
- Stores user information (email, password, name, role, etc.)
- Roles: ADMIN, EMPLOYEE, VOLUNTEER
- Relations: one-to-many with Entry

### Entry Model
- Stores all types of entries (hours, expenses, vacation, travel)
- Status: PENDING, APPROVED, REJECTED
- Type-specific fields for each entry type
- Relations: belongs to User

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Entries
- `POST /api/entries/hours` - Submit work hours
- `GET /api/entries/hours` - Get user's work hours
- `POST /api/entries/expenses` - Submit expense
- `GET /api/entries/expenses` - Get user's expenses
- `POST /api/entries/vacation` - Submit vacation request
- `GET /api/entries/vacation` - Get user's vacation requests
- `POST /api/entries/travel` - Submit travel report
- `GET /api/entries/travel` - Get user's travel reports

### Admin
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/[id]` - Delete user
- `GET /api/admin/entries` - Get all entries (with filters)
- `PATCH /api/admin/entries/[id]/approve` - Approve/reject entry
- `GET /api/admin/stats` - Get system statistics

### Upload
- `POST /api/upload` - Upload file to Vercel Blob

## Deployment to Vercel

1. **Push your code to GitHub**

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

3. **Set up Vercel Postgres**
   - In your Vercel project, go to Storage
   - Create a new Postgres database
   - Copy the environment variables

4. **Set up Vercel Blob**
   - In your Vercel project, go to Storage
   - Create a new Blob store
   - Copy the token

5. **Add environment variables**
   - In Vercel project settings, add all environment variables
   - Include database URLs, JWT secret, and Blob token

6. **Deploy**
   - Vercel will automatically deploy your application
   - Run migrations: `npx prisma migrate deploy`
   - Run seed: `npx prisma db seed` (optional)

## Development

### Running Prisma Studio
```bash
npx prisma studio
```

### Creating a new migration
```bash
npx prisma migrate dev --name migration_name
```

### Resetting the database
```bash
npx prisma migrate reset
```

## Security Notes

- Change the JWT_SECRET in production to a strong random string
- Use environment variables for all sensitive data
- Never commit `.env` files to version control
- Passwords are hashed using bcrypt with 10 salt rounds
- JWT tokens expire after 7 days

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.

