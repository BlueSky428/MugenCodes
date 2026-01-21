# Project Management System - Setup Guide

## Overview

This project management system has been fully implemented with the following features:

1. ✅ User authentication (Sign up, Sign in)
2. ✅ Project submission (New projects)
3. ✅ Feasibility review system
4. ✅ Development plan and milestones
5. ✅ Client approval workflow
6. ✅ Payment tracking
7. ✅ Project status tracking (6 status pages)
8. ✅ Real-time project updates
9. ✅ Review system for completed projects
10. ✅ Failure handling with responsibility tracking

## Database Setup

The system uses SQLite with Prisma ORM. The database is automatically created when you run migrations.

### Initial Setup

1. **Environment Variables**

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
AUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123"
ADMIN_NAME="Admin User"
```

To generate a secure secret:
```bash
openssl rand -base64 32
```

2. **Run Database Migrations**

```bash
npx prisma migrate dev
```

3. **Generate Prisma Client**

```bash
npx prisma generate
```

4. **Seed Admin User** (Optional)

```bash
npm run db:seed
```

This creates an admin user with:
- Email: `admin@example.com` (or from ADMIN_EMAIL env var)
- Password: `admin123` (or from ADMIN_PASSWORD env var)

## User Roles

- **CLIENT**: Can submit projects, view their own projects, approve projects, submit reviews
- **ADMIN**: Can review feasibility, create development plans, manage all projects
- **DEVELOPER**: Same permissions as ADMIN

## Project Workflow

1. **Client submits project** → Status: `NEW`
2. **Team reviews feasibility** → Status: `REJECTED` or `UNDER_AGREEMENT`
3. **Team creates development plan** → Milestones added
4. **Client approves and pays upfront** → Status: `ONGOING`
5. **Team updates progress** → Project updates posted
6. **Client pays milestones** → Milestones marked as paid
7. **Project completed** → Status: `SUCCESSFUL`
8. **Client submits review** → Review added to project

## API Routes

All API routes are protected and require authentication:

- `POST /api/projects` - Create new project (CLIENT only)
- `GET /api/projects?status=STATUS` - List projects (filtered by user role)
- `GET /api/projects/[id]` - Get project details
- `POST /api/projects/[id]/feasibility` - Review feasibility (ADMIN/DEVELOPER)
- `POST /api/projects/[id]/plan` - Create development plan (ADMIN/DEVELOPER)
- `POST /api/projects/[id]/approve` - Approve project (CLIENT)
- `POST /api/projects/[id]/payments` - Record payment
- `POST /api/projects/[id]/review` - Submit review (CLIENT)
- `POST /api/projects/[id]/fail` - Mark as failed (ADMIN/DEVELOPER)
- `GET /api/projects/[id]/updates` - Get project updates
- `POST /api/projects/[id]/updates` - Create update (ADMIN/DEVELOPER)

## Pages

- `/auth/signin` - Sign in page
- `/auth/signup` - Sign up page
- `/projects/new` - Submit new project
- `/projects/under-agreement` - Projects awaiting approval
- `/projects/rejected` - Rejected projects
- `/projects/failed` - Failed projects
- `/projects/ongoing` - Active projects
- `/projects/successful` - Completed projects
- `/projects/[id]` - Project detail page

## Navigation

The header now includes a "Projects" dropdown menu with all project status pages.

## Next Steps

1. **Set up environment variables** (see above)
2. **Run database migrations**
3. **Create admin user** (optional, use seed script)
4. **Test the workflow**:
   - Sign up as a client
   - Submit a new project
   - Sign in as admin (or change user role in database)
   - Review feasibility
   - Create development plan
   - Client approves and pays
   - Track progress

## Database Schema

The system includes the following models:
- `User` - Users (clients, admins, developers)
- `Project` - Projects with all status information
- `Milestone` - Payment milestones
- `Review` - Client reviews
- `ProjectUpdate` - Development progress updates

## Security Notes

- All routes are protected by authentication
- Clients can only see their own projects
- Admins/Developers can see all projects
- Passwords are hashed with bcrypt
- Sessions use JWT tokens

## Troubleshooting

1. **Database errors**: Make sure you've run `npx prisma migrate dev`
2. **Auth errors**: Check that AUTH_SECRET is set in .env
3. **Permission errors**: Verify user role in database
4. **Build errors**: Run `npx prisma generate` after schema changes

## Production Deployment

For production:
1. Use PostgreSQL instead of SQLite
2. Update DATABASE_URL to PostgreSQL connection string
3. Set secure AUTH_SECRET
4. Enable HTTPS
5. Set up proper email service for notifications (currently placeholder)
