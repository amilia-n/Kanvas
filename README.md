# Kanvas

Kanvas is a comprehensive Learning Management System (LMS) built with React and Express, featuring course management, enrollment workflows, assignment submission, grading, and real-time student progress tracking.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Database Setup](#database-setup)
- [Installation & Setup](#installation--setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [API Routes](#api-routes)
- [Authentication & Authorization](#authentication--authorization)
- [Database Schema](#database-schema)
- [Key Dependencies](#key-dependencies)

---

## Overview

**Kanvas** is a modern LMS designed to manage university courses, student enrollments, assignments, submissions, and grading. It supports three user roles (Admin, Teacher, Student) with role-based access control, and provides a clean, intuitive interface for managing the entire academic lifecycle.

### Key Capabilities

- **Course & Offering Management**: Create courses and specific offerings (sections) per term
- **Enrollment System**: Waitlist, approval, enrollment, and completion workflows
- **Prerequisites**: Enforce course prerequisites at the offering level
- **Assignments & Submissions**: Teachers create assignments, students submit work, teachers grade
- **Grade Management**: Letter-grade based grading (A+ to F) with GPA calculation
- **Material Sharing**: Upload and share course materials (syllabi, slides, etc.)
- **Real-time Updates**: React Query for optimistic updates and cache invalidation

---

## Features

### For Students
- Browse course catalog with search, filter, and sort
- Enroll in offerings (with prerequisite checking)
- View "My Courses" (current, upcoming, past)
- Submit assignments with URL-based submission
- Track grades and cumulative GPA
- View course materials and classmate roster

### For Teachers
- Create and manage course offerings
- Manage enrollments (approve, deny, drop, complete)
- Create and grade assignments
- Bulk grade management with letter grades
- View student submissions and progress
- Upload course materials
- Set prerequisites for offerings

### For Admins
- All teacher permissions
- User management capabilities
- System-wide access control

---

## Tech Stack

### Frontend
- **React 19** - UI framework
- **React Router 7** - Client-side routing
- **TanStack Query v5** - Data fetching, caching, and synchronization
- **TanStack Table v8** - Advanced data tables with
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Component system built on Radix UI primitives
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **Argon2** - Password hashing
- **pg** - PostgreSQL client

### Development Tools
- **Vite** - Build tool and dev server
- **Nodemon** - Auto-restart on file changes
- **Vitest** - Unit testing framework
- **ESLint** - Linting
- **Docker** (optional) - Containerization

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.x
- **npm** >= 9.x
- **PostgreSQL** >= 14.x
- **Git**

---

## Project Structure

```
Kanvas/
├── client/                  # Frontend React application
│   ├── public/
│   ├── src/
│   │   ├── app/            # Error boundaries
│   │   ├── components/     # Reusable UI components
│   │   ├── config/         # Configuration files
│   │   ├── constants/      # API routes, roles, grading scales
│   │   ├── features/       # Feature-based modules
│   │   │   ├── assignments/
│   │   │   ├── auth/
│   │   │   ├── courses/
│   │   │   ├── enrollments/
│   │   │   ├── grades/
│   │   │   ├── materials/
│   │   │   ├── offerings/
│   │   │   ├── submissions/
│   │   │   └── users/
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility libraries
│   │   ├── routes/         # Routing configuration
│   │   ├── styles/         # CSS files
│   │   └── utils/          # Helper functions
│   └── package.json
│
├── server/                  # Backend Express application
│   ├── scripts/            # Database management scripts
│   ├── src/
│   │   ├── config/         # Environment configuration
│   │   ├── controllers/    # Route handlers
│   │   ├── db/             # Database setup and queries
│   │   │   ├── db.sql      # Schema definition
│   │   │   ├── seed.sql    # Initial data
│   │   │   ├── seed.js     # Seeding script
│   │   │   ├── init.js     # Database initialization
│   │   │   ├── reset.js    # Database reset
│   │   │   ├── queries.js  # SQL queries
│   │   │   └── pool.js     # Connection pool
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── server.js           # Entry point
│   └── package.json
│
└── README.md               # This file
```

---

## Database Setup

### Schema Overview

The database consists of the following core tables:

- **users** - Admin, teacher, and student accounts
- **faculty_registry** - Approved faculty members
- **majors** - Academic majors
- **terms** - Academic terms (semesters)
- **courses** - Course definitions (e.g., CS, MATH)
- **course_offering** - Specific offerings per term/section
- **course_prereqs** - Prerequisites between offerings
- **enrollments** - Student enrollment records
- **assignments** - Course assignments
- **submissions** - Student assignment submissions
- **course_materials** - Uploaded course materials
- **user_majors** - Student-major associations

### Database Files

- **`server/src/db/db.sql`** - Complete schema with tables, constraints, triggers, and functions
- **`server/src/db/seed.sql`** - Base data (majors, terms, courses, offerings, faculty)
- **`server/src/db/seed.js`** - Additional seeding logic (users, enrollments, assignments, grades)

### Recreating the Database

1. **Create PostgreSQL database**:
   ```bash
   createdb kanvas
   ```

2. **Initialize schema**:
   ```bash
   cd server
   npm run db:init
   # Or manually: psql -d kanvas -f src/db/db.sql
   ```

3. **Seed data**:
   ```bash
   npm run db:seed
   # This runs: psql -d kanvas -f src/db/seed.sql && node src/db/seed.js
   ```

4. **Reset database** (if needed):
   ```bash
   npm run db:reset
   # Warning: This drops all tables and recreates from scratch
   ```

---

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/amilia-n/Kanvas.git
cd "Kanvas"
```

### 2. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd ../client
npm install
```

### 3. Set Up Environment Variables

#### Backend (.env)
Create `server/.env`:

```env
# Server Configuration
PORT=8888
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES=7d

# Database Configuration (Option 1: Connection String)
DATABASE_URL=postgresql://username:password@localhost:5432/kanvas

# Database Configuration (Option 2: Discrete Fields)
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kanvas
```

**Important**: Change `JWT_SECRET` to a strong, random value in production!

#### Frontend (.env - Optional)
Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:8888/api
```

### 4. Initialize Database

```bash
cd server
npm run db:init
npm run db:seed
```

---

## Running the Application

### Development Mode

#### Terminal 1 - Backend
```bash
cd server
npm run dev
# Server runs on http://localhost:8888
```

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

### Production Build

#### Backend
```bash
cd server
npm start
```

#### Frontend
```bash
cd client
npm run build
npm run preview
```

### Docker (Optional)

```bash
cd server
npm run start:docker        # Start without seeding
npm run start:docker:seed   # Start with seeding
npm run stop:docker         # Stop containers
```

---

## API Routes

All API routes are prefixed with `/api` and return JSON.

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/login` | Log in with email/password | No |
| POST | `/logout` | Log out (clears cookie) | No |
| POST | `/reset-password` | Request password reset token | No |
| POST | `/reset-password/confirm` | Confirm reset with token | No |

### Users (`/api/users`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/me` | Get current user info | Yes | All |
| GET | `/search` | Search users by name/email | Yes | All |
| GET | `/terms/current` | Get current academic term | Yes | All |
| GET | `/terms/next` | Get next academic term | Yes | All |
| PATCH | `/:id` | Update user profile | Yes | Self/Admin |

### Courses (`/api/courses`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/` | List all courses with offerings | Yes | All |
| GET | `/:id` | Get course details | Yes | All |

### Offerings (`/api/offerings`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/` | Create new offering | Yes | Teacher/Admin |
| GET | `/my` | Get user's offerings | Yes | All |
| GET | `/:id` | Get offering details | Yes | All |
| GET | `/course/:courseId` | List offerings for course | Yes | All |
| PATCH | `/:id` | Update offering | Yes | Teacher/Admin |
| DELETE | `/:id` | Delete offering | Yes | Teacher/Admin |
| POST | `/:id/prereqs` | Add prerequisite | Yes | Teacher/Admin |
| DELETE | `/:id/prereqs/:prereqId` | Remove prerequisite | Yes | Teacher/Admin |
| GET | `/:id/classmates/search` | Search classmates | Yes | All |

### Enrollments (`/api/enrollments`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/request` | Request enrollment (waitlist) | Yes | Student |
| POST | `/approve` | Approve enrollment | Yes | Teacher/Admin |
| POST | `/deny` | Deny enrollment | Yes | Teacher/Admin |
| POST | `/drop` | Drop student | Yes | Teacher/Admin |
| POST | `/complete` | Mark student as completed | Yes | Teacher/Admin |
| GET | `/offering/:id/waitlist` | Get waitlist | Yes | Teacher/Admin |
| GET | `/offering/:id/enrolled` | Get enrolled students | Yes | Teacher/Admin |

### Assignments (`/api/assignments`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/` | Create assignment | Yes | Teacher/Admin |
| GET | `/offering/:offeringId` | List assignments for offering | Yes | All |
| GET | `/:id` | Get assignment details | Yes | All |
| PATCH | `/:id` | Update assignment | Yes | Teacher/Admin |
| DELETE | `/:id` | Delete assignment | Yes | Teacher/Admin |
| PATCH | `/:id/open` | Open assignment submissions | Yes | Teacher/Admin |
| PATCH | `/:id/close` | Close assignment submissions | Yes | Teacher/Admin |

### Submissions (`/api/submissions`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/` | Submit/resubmit assignment | Yes | Student |
| POST | `/grade` | Grade a submission | Yes | Teacher/Admin |
| GET | `/teacher/all` | List all submissions for teacher | Yes | Teacher/Admin |
| GET | `/offering/:offeringId` | List submissions for offering | Yes | Teacher/Admin |
| GET | `/my/:offeringId` | Get student's own submissions | Yes | Student |

### Grades (`/api/grades`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/:offeringId/breakdown` | Get grade breakdown | Yes | Student (self) |
| GET | `/:offeringId/current` | Get current grade | Yes | Student (self) |
| GET | `/finals` | Get all final grades | Yes | Student (self) |
| GET | `/gpa/by-course` | Get GPA by course | Yes | Student (self) |
| GET | `/gpa/cumulative` | Get cumulative GPA | Yes | Student (self) |
| PATCH | `/final` | Update final grade | Yes | Teacher/Admin |

### Materials (`/api/materials`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/` | Upload material | Yes | Teacher/Admin |
| GET | `/:offeringId` | List materials for offering | Yes | All |
| DELETE | `/:id` | Delete material | Yes | Teacher/Admin |

---

## Authentication & Authorization

### Authentication Flow

1. **Login** - User submits credentials to `/api/auth/login`
2. **JWT Token** - Server generates JWT and sets it as an HTTP-only cookie named `access`
3. **Protected Routes** - Client includes cookie automatically with each request
4. **Verification** - Server middleware (`requireAuth`) verifies token on protected routes
5. **Logout** - Client calls `/api/auth/logout` to clear cookie

### Middleware

Located in `server/src/middleware/auth.js`:

- **`requireAuth`** - Verifies JWT token exists and is valid
- **`requireRole(...roles)`** - Checks user has one of the specified roles
- **`requireAdmin`** - Shorthand for `requireRole('admin')`
- **`requireSelfOrAdmin`** - Allows access if user is accessing their own resource or is admin

### Role-Based Access

Three user roles with hierarchical permissions:

1. **Admin** - Full access to all resources
2. **Teacher** - Manage own offerings, enrollments, grades, assignments
3. **Student** - Enroll in courses, submit assignments, view own grades

### Token Storage

- **Backend**: JWT stored in HTTP-only cookie (secure, prevents XSS)
- **Frontend**: Token automatically sent with each request via cookie
- **Expiration**: 7 days (configurable via `JWT_EXPIRES` env var)

---

## Database Schema

### Core Enums

```sql
user_role: 'admin' | 'teacher' | 'student'
enrollment_status: 'enrolled' | 'dropped' | 'completed' | 'waitlisted' | 'denied'
```

### Key Tables

#### users
```sql
id, role, email, password_hash, first_name, last_name, 
student_number, teacher_number, reset_token, token_created_at
```

#### courses
```sql
id, code (e.g., 'CS', 'MATH'), name
```

#### course_offering
```sql
id, course_id, code (e.g., 'CS101'), name, description, term_id, 
teacher_id, credits, section, total_seats, enrollment_open, is_active
```

#### enrollments
```sql
id, offering_id, student_id, status, enrolled_at, dropped_at, 
completed_at, waitlisted_at, denied_at, final_percent
```

#### assignments
```sql
id, offering_id, title, description, weight_percent, assigned_on, due_at, is_open
```

#### submissions
```sql
id, assignment_id, student_id, submission_url, submitted_at, 
grade_percent, graded_at, graded_by
```

### Database Triggers

- **enforce_retake_policy** - Prevents re-enrollment if course completed with C+ or better
- **set_updated_at** - Auto-updates `updated_at` timestamp
- **set_waitlisted_at** - Sets `waitlisted_at` when status changes to waitlisted
- **enforce_max3_majors** - Limits students to 3 majors maximum

### Business Logic Functions

- **compute_final_percent** - Calculates weighted final grade from assignments
- **update_final_grade_on_submission** - Auto-updates final grade when graded
- **check_retake_policy** - Validates enrollment against completed courses

---

## Key Dependencies

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 19.1.1 | Core UI library |
| `react-router-dom` | 7.9.4 | Client-side routing |
| `@tanstack/react-query` | 5.90.5 | Server state management |
| `@tanstack/react-table` | 8.21.3 | Advanced data tables |
| `axios` | 1.12.2 | HTTP client |
| `tailwindcss` | 4.1.14 | Utility-first CSS framework |
| `@radix-ui/*` | latest | Accessible headless UI primitives |
| `lucide-react` | 0.546.0 | Icon library (2000+ icons) |
| `clsx` & `tailwind-merge` | latest | Conditional className utility (via `cn()`) |
| **shadcn/ui pattern** | - | Component system with Radix + Tailwind |

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | 5.1.0 | Web framework |
| `pg` | 8.16.3 | PostgreSQL client |
| `jsonwebtoken` | 9.0.2 | JWT token generation/verification |
| `argon2` | 0.44.0 | Secure password hashing |
| `dotenv` | 17.2.3 | Environment variable management |
| `cors` | 2.8.5 | Cross-origin resource sharing |
| `cookie-parser` | 1.4.7 | Parse cookies from requests |
| `morgan` | 1.10.1 | HTTP request logging |
| `nodemon` | 3.1.10 (dev) | Auto-restart on file changes |

---

## Default Seeded Users

After running `npm run db:seed`, you can log in with:

**Teachers:**
- Email: `dknu@faculty.kanvas.edu` | Password: `password123` (Donald Knuth - CS)
- Email: `blis@faculty.kanvas.edu` | Password: `password123` (Barbara Liskov - Math/Physics)
- Email: `ghop@faculty.kanvas.edu` | Password: `password123` (Grace Hopper - Architecture/CEE)

**Students:**
- Email: `ajoh@kanvas.edu` | Password: `password123` (Alice Johnson - CS)
- Email: `bkim@kanvas.edu` | Password: `password123` (Brian Kim - STAT)
- Email: `cgar@kanvas.edu` | Password: `password123` (Chloe Garcia - MATH)
- *(+ 27 more students)*

---

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check connection string in `.env`
- Ensure database exists: `psql -l | grep kanvas`

### Port Already in Use
- Change `PORT` in `server/.env`
- Update `VITE_API_BASE_URL` in `client/.env` or `client/src/config/env.js`

### CORS Errors
- Ensure `CORS_ORIGIN` in `server/.env` matches your frontend URL
- Clear browser cache and cookies

### JWT Invalid Token
- Check `JWT_SECRET` is set in `server/.env`
- Clear browser cookies and log in again

---

## Testing

```bash
# Backend tests
cd server
npm run test

# Frontend tests
cd client
npm run test
```

---

Built as a comprehensive LMS demonstration project showcasing modern full-stack development practices.

---

For frontend-specific documentation, see [client/README.md](./client/README.md).

