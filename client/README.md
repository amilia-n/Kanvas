# Kanvas - Frontend

Modern React-based Learning Management System frontend with comprehensive course management, real-time updates, and intuitive user experience.

---

## Table of Contents

- [Overview](#overview)
- [Pages & Features](#pages--features)
- [Architecture](#architecture)
- [Key Technologies](#key-technologies)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Development](#development)
- [Routing](#routing)
- [State Management](#state-management)
- [Styling](#styling)
- [API Integration](#api-integration)

---

## Overview

The frontend is a single-page application (SPA) built with React 19, React Router 7, and TanStack Query. It provides role-based interfaces for students, teachers, and administrators with real-time data synchronization and optimistic updates.

---

## Pages & Features

### Authentication

#### Login Page (`/login`)

- Email/password authentication
- Role-based redirect after login
- Password reset link
- Form validation

#### Reset Password Page (`/reset-password`)

- Request password reset token
- Token-based password reset
- Email validation

#### Logout Page (`/logout`)

- Automatic logout and redirect
- Cookie clearance

---

### Student Pages

#### My Offerings (`/my-offerings`)

**Purpose**: Central hub for student's enrolled courses

**Features**:

- View current, upcoming, and past courses
- Course cards with offering information
- Quick navigation to course materials
- Displays final grades for completed courses
- Shows term code, section, teacher name

**Function**: Groups offerings by status (current/upcoming/past) and provides overview of student's academic schedule

---

#### Course Catalog (`/courses`)

**Purpose**: Browse and search all available courses and offerings

**Features**:

- Searchable course list with offerings
- Filter by course, teacher, term, enrollment status
- Sort by course code, offering code (A-Z/Z-A)
- Expandable offering details per course
- Prerequisite information
- Enrollment status (open/closed)
- Real-time seat availability

**Function**: Enables students to discover and enroll in courses. Shows nested offerings (sections) for each course with detailed information including prerequisites, description, and availability

---

#### Course Detail Page (`/courses/:id`)

**Purpose**: Detailed view of a specific course with all its offerings

**Features**:

- Course description and information
- Current, upcoming, and past offerings
- Collapsible past offerings section
- Search and filter offerings
- Enrollment links

**Function**: Provides comprehensive course information and historical offering data

---

#### Offering Detail Page (`/offerings/:id`)

**Purpose**: Detailed information about a specific course offering

**Features**:

- Offering description and metadata
- Teacher information
- Term and section details
- Prerequisite display
- Enrollment button (if eligible)
- Seat availability

**Function**: Shows detailed offering information and handles enrollment requests

---

#### Course Material / Classroom (`/offerings/:offeringId/classroom`)

**Purpose**: Central workspace for an enrolled course

**Features**:

- Course materials (syllabi, slides, resources)
- Assignment list
- Submission tracking
- Classmate roster
- Quick links to submissions and grades

**Function**: Provides all resources and tools needed for a student to participate in the course

---

#### Assignments Page (`/assignments`)

**Purpose**: View all assignments across enrolled courses

**Features**:

- Grouped by course offering
- Assignment status (open/closed)
- Due dates and weights
- Submission status
- Grade display (if graded)
- Quick navigation to assignment details

**Function**: Consolidated view of all assignments with submission and grading status

---

#### Assignment Detail Page (`/assignments/:id`)

**Purpose**: Detailed view of a single assignment

**Features**:

- Assignment description and requirements
- Due date and weight
- Submission form (URL-based)
- Resubmission capability
- Grade display (if graded)

**Function**: Allows students to submit assignments and view feedback

---

#### Grades Page (`/grades`)

**Purpose**: Track academic performance

**Features**:

- Cumulative GPA (color-coded, displayed prominently)
- Table of all courses (current/past/upcoming)
- Letter grades for completed courses
- Course status badges (Completed/Ongoing/Dropped)
- GPA calculation based on letter grades

**Function**: Provides comprehensive grade tracking and GPA visualization

---

### Teacher Pages

#### My Offerings (`/my-offerings`)

**Purpose**: Teacher's course management hub

**Features**:

- Current, upcoming, and past teaching schedule
- Student enrollment counts
- Quick navigation to classroom
- Offering status indicators

**Function**: Overview of teaching responsibilities and course sections

---

#### Offering Detail Page (`/offerings/:id`)

**Purpose**: Manage a specific offering (teachers only)

**Features**:

- Edit offering details (code, name, description)
- Manage prerequisites (add/remove)
- View enrollment status
- Access enrollment management
- Teacher-only editing capabilities

**Function**: Central management page for offering configuration

---

#### Enrollment Management (`/enrollments/manage`)

**Purpose**: Manage student enrollments

**Features**:

- Offering selector dropdown
- Open/close enrollment toggle
- **Student search and manual enrollment**:
  - Search students by name/email
  - Manually enroll students directly
  - Seat availability checking
- **Enrolled students list**:
  - Current enrollment status
  - Mark as completed
  - Drop students
  - Re-enrollment support
- **Waitlist (pending requests)**:
  - Approve/deny enrollment requests
  - Request timestamps
  - Seat availability indicators
- Real-time UI feedback on all actions

**Function**: Comprehensive enrollment workflow management with manual and request-based enrollment

---

#### Grade Management (`/grades`)

**Purpose**: Manage student grades and performance

**Features**:

- **Current Courses Section**:
  - Table with students as rows, assignments as columns
  - Letter grade display for each assignment
  - Cumulative grade column (weighted average)
  - Editable final grade (letter grade dropdown)
  - Color-coded GPA indicators
- **Past Courses Section**:
  - Grouped by term (collapsible)
  - Historical grade data
  - Final grades (non-editable)
- **Grade Calculation**:
  - Weighted average based on assignment weights
  - Letter grades (A+ to F)
  - GPA conversion (4.0 scale)
- Scroll on X and Y for large tables
- "Go to Classroom" button per offering

**Function**: Centralized grade management with bulk viewing and inline editing

---

#### Submissions Page (`/submissions`)

**Purpose**: Grade student submissions across all offerings

**Features**:

- **Central grading hub** - View all submissions across all teacher's courses
- **Per-offering mode** - Filter to specific offering via `/offerings/:id/submissions`
- Filter by assignment
- Submission details:
  - Student name and email
  - Assignment title
  - Submission URL (clickable)
  - Submission timestamp
  - Grading status (Pending/Graded)
- **Grade input**:
  - Letter grade dropdown (A+ to F)
  - Updates automatically calculate GPA
  - Graded by tracking (teacher name + timestamp)
- Scroll through submissions
- Update existing grades

**Function**: Streamlined grading interface for teachers to grade and track all student work

---

#### Create Offering Form

**Purpose**: Create new course offerings

**Features**:

- Select course from dropdown
- Input offering code (e.g., CS101)
- Input offering name
- Optional description (textarea)
- Select term (current/next term dropdown)
- Input section letter
- Set total seats
- Teacher auto-assigned from logged-in user

**Function**: Allows teachers to create new course sections

---

### Admin Pages

Admins have access to all teacher pages plus additional system-wide management capabilities.

---

## Architecture

### Component Organization

```
src/
├── features/              # Feature-based modules (domain-driven)
│   ├── assignments/       # Assignment pages, API, hooks
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course catalog and details
│   ├── enrollments/       # Enrollment management
│   ├── grades/            # Grade viewing and management
│   ├── materials/         # Course materials
│   ├── offerings/         # Offering management
│   ├── submissions/       # Submission and grading
│   └── users/             # User profile and management
│
├── components/            # Shared UI components
│   ├── layout/            # Shell, Navbar, Sidebar
│   └── ui/                # Reusable primitives (Button, Card, Input, etc.)
│
├── lib/                   # Core utilities
│   ├── apiClient.js       # Axios instance with interceptors
│   ├── queryClient.js     # React Query configuration
│   └── utils.js           # Helper functions (cn, formatters)
│
├── routes/                # Routing configuration
│   ├── paths.js           # Route path constants
│   └── ProtectedRoute.jsx # Auth guards
│
├── constants/             # App-wide constants
│   ├── apiRoutes.js       # API endpoint definitions
│   ├── roles.js           # User role constants
│   └── grading.js         # Grade scales and conversions
│
├── hooks/                 # Custom React hooks
│   └── useDebounce.js     # Debouncing utility
│
├── utils/                 # Helper functions
│   ├── format.js          # Date, number formatters
│   ├── guards.js          # Type guards
│   └── queryKeys.js       # React Query key factory
│
└── styles/                # Global styles
    ├── index.css          # Main stylesheet
    ├── shadcn.css         # Theme variables
    └── tokens.css         # Design tokens
```

### Design Patterns

1. **Feature-Based Structure**: Each domain (courses, assignments, etc.) has its own folder with pages, API calls, and hooks
2. **Colocation**: Keep related code together (e.g., `CoursesPage.jsx` + `courses.api.js` + `useCourses.js`)
3. **Custom Hooks**: Encapsulate data fetching logic (e.g., `useAssignments`, `useEnrollments`)
4. **Smart/Dumb Components**: Pages handle logic, UI components handle presentation
5. **Separation of Concerns**: API layer → Service layer → UI layer

---

## Key Technologies

### State Management

**TanStack Query (React Query)** - Server state management

- Data fetching with automatic caching
- Optimistic updates
- Cache invalidation
- Background refetching
- Pagination support

**Query Keys** - Structured query key factory in `utils/queryKeys.js`

```javascript
queryKeys.courses.all(); // ['courses']
queryKeys.courses.detail(id); // ['courses', 'detail', id]
queryKeys.offerings.byCourse(courseId); // ['offerings', 'byCourse', courseId]
```

### Routing

**React Router 7** - Client-side routing

- Nested routes with layouts
- Protected routes with auth guards
- Dynamic parameters
- Programmatic navigation

### Forms & Validation

- Controlled components with React state
- Custom validation logic
- Real-time error feedback
- Letter grade dropdowns (A+ to F)

### Data Tables

**TanStack Table** - Advanced table functionality

- Custom sorting (especially for nested offerings in courses)
- Filtering by multiple fields
- Pagination with configurable page sizes
- Expandable rows (courses → offerings)
- Custom column sizing

---

## Project Structure

### Feature Module Pattern

Each feature follows this structure:

```
features/[feature-name]/
├── [Feature]Page.jsx        # Main page component
├── [feature].api.js         # API call definitions
├── use[Feature].js          # React Query hooks
└── [additional components]  # Feature-specific components
```

Example: **Assignments**

```
features/assignments/
├── AssignmentsPage.jsx      # List view of all assignments
├── AssignmentDetailPage.jsx # Single assignment detail
├── assignments.api.js       # API functions (listAssignmentsForOffering, etc.)
└── useAssignments.js        # Custom hooks (useAssignments, useCreateAssignment, etc.)
```

---

## Setup

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
cd client
npm install
```

### Environment Variables

Create `.env` (optional):

```env
VITE_API_BASE_URL=http://localhost:8888/api
```

If not provided, defaults to `http://localhost:8888/api` (set in `src/config/env.js`)

---

## Development

### Start Dev Server

```bash
npm run dev
```

Runs on `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## Routing

### Route Structure

```javascript
/                          → Redirect to /my-offerings
/login                     → LoginPage
/logout                    → LogoutPage
/reset-password            → ResetPasswordPage
/my-offerings              → MyOfferingsPage (current/upcoming/past courses)
/me                        → ProfilePage

/courses                   → CoursesPage (catalog with search/filter)
/courses/:id               → CourseDetailPage

/offerings/:id             → OfferingDetailPage
/offerings/:id/classroom   → CourseMaterial (enrolled students)
/offerings/:id/submissions → SubmissionsPage (teachers only)

/assignments               → AssignmentsPage (all assignments)
/assignments/:id           → AssignmentDetailPage

/submissions               → SubmissionsPage (teacher's central grading hub)

/grades                    → GradesPage (role-based: student or teacher view)

/enrollments/manage        → EnrollmentManagement (teachers/admins only)
```

### Protected Routes

- **Public**: `/login`, `/reset-password`
- **Authenticated**: All other routes (requires login)
- **Teacher/Admin Only**:
  - `/enrollments/manage`
  - `/submissions` (central hub)
  - `/offerings/:id/submissions`

### Route Guards

Located in `routes/ProtectedRoute.jsx`:

```javascript
<ProtectedRoute />                     // Requires authentication
<ProtectedRoute roles={['teacher']} /> // Requires specific role(s)
```

---

## State Management

### React Query Configuration

Located in `lib/queryClient.js`:

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
```

### Custom Hooks Pattern

Each feature has hooks for data fetching and mutations:

```javascript
// Example: useEnrollments.js
export function useWaitlist(offeringId) {
  return useQuery({
    queryKey: queryKeys.enrollments.waitlist(offeringId),
    queryFn: () => getWaitlist(offeringId),
  });
}

export function useApproveEnrollment({ onSuccess } = {}) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: approveEnrollment,
    onSuccess: (data, vars) => {
      // Invalidate related queries
      qc.invalidateQueries({
        queryKey: queryKeys.enrollments.waitlist(vars.offeringId),
      });
      qc.invalidateQueries({
        queryKey: queryKeys.enrollments.enrolled(vars.offeringId),
      });
      if (onSuccess) onSuccess(data, vars);
    },
  });
}
```

### Cache Invalidation Strategy

Mutations automatically invalidate related queries:

- **Enrollment actions** → Invalidate waitlist, enrolled, offering details
- **Grade updates** → Invalidate submissions, grades
- **Assignment creation** → Invalidate assignment list
- **Material upload** → Invalidate material list

---

## Styling

### Tailwind CSS v4 + shadcn/ui

The application uses **shadcn/ui**, a component system that combines:
- **Radix UI** - Accessible, unstyled component primitives
- **Tailwind CSS v4** - Utility-first styling
- **CSS Variables** - Theme tokens for consistent design

shadcn/ui is not a component library but a collection of reusable components that you own. Components are built with Radix UI and styled with Tailwind, giving you full control and customization.

### Theme System

**CSS Variables** (`src/styles/shadcn.css`):

```css
:root {
  --primary: 221 83% 53%; /* Brand color (HSL) */
  --background: 0 0% 100%; /* Page background */
  --card: 0 0% 100%; /* Card backgrounds */
  --border: 214 32% 91%; /* Border color */
  --muted-foreground: 215 16% 47%; /* Secondary text */
  /* ... more tokens */
}
```

Edit `src/styles/shadcn.css` to change theme colors.

### Component Library

**shadcn/ui Components** - Built with Radix UI + Tailwind CSS:

All UI components follow the shadcn/ui pattern and are located in `src/components/ui/`:

- **Button** - Multiple variants (default, outline, ghost, destructive, link)
- **Card** - Container with header/content/footer sections
- **Input** - Text input with validation styles
- **Select** - Accessible dropdown with keyboard navigation
- **Dialog** - Modal dialog with overlay and focus trap
- **Table** - Semantic table with header/body/footer
- **Badge** - Status indicators with variants
- **Alert** - Notification messages
- **Spinner** - Loading indicator
- **Label** - Accessible form labels
- **Separator** - Visual divider

**Why shadcn/ui?**
- Copy and own your components (not a dependency)
- Full customization control
- Built on accessible Radix primitives
- Styled with Tailwind utilities
- Consistent with modern design systems

### Responsive Design

- Mobile-first approach
- Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Cards stack on mobile, grid on desktop
- Responsive navigation (collapsible sidebar)

---

## API Integration

### API Client

Located in `lib/apiClient.js`:

```javascript
const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Send cookies
  timeout: 30000,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
    }
    return Promise.reject(error);
  }
);
```

### API Routes

Centralized in `constants/apiRoutes.js`:

```javascript
export default {
  auth: {
    login: () => ({ method: "POST", url: "/auth/login" }),
    logout: () => ({ method: "POST", url: "/auth/logout" }),
  },
  courses: {
    list: () => ({ method: "GET", url: "/courses" }),
    detail: (id) => ({ method: "GET", url: `/courses/${id}` }),
  },
  // ... more routes
};
```

### API Call Pattern

```javascript
// 1. Define API function (features/[feature]/[feature].api.js)
export const listCourses = () => {
  const { method, url } = routes.courses.list();
  return apiClient({ method, url });
};

// 2. Create custom hook (features/[feature]/use[Feature].js)
export function useCourses() {
  return useQuery({
    queryKey: queryKeys.courses.all(),
    queryFn: listCourses,
  });
}

// 3. Use in component
function CoursesPage() {
  const { data: courses, isLoading } = useCourses();
  // ... render
}
```

---

## Key Features

### Optimistic Updates

Mutations update UI immediately, then rollback if failed:

```javascript
useMutation({
  mutationFn: updateGrade,
  onMutate: async (newGrade) => {
    await qc.cancelQueries({ queryKey: ["grades"] });

    const previousGrades = qc.getQueryData(["grades"]);

    qc.setQueryData(["grades"], (old) => ({
      ...old,
      ...newGrade,
    }));

    return { previousGrades };
  },
  onError: (err, newGrade, context) => {
    qc.setQueryData(["grades"], context.previousGrades);
  },
});
```

### Real-Time Feedback

All mutations provide immediate UI feedback:

- Success/error alerts
- Loading spinners
- Optimistic UI updates
- Toast notifications

### Search & Filter

Debounced search with multiple filter options:

```javascript
const [searchQuery, setSearchQuery] = useState("");
const debouncedQuery = useDebounce(searchQuery, 300);

const { data } = useSearchResults(debouncedQuery);
```

### Pagination

Custom pagination for nested data (courses with offerings):

```javascript
const [pageSize, setPageSize] = useState(10);
const [currentPage, setCurrentPage] = useState(0);

const paginatedData = useMemo(() => {
  const allOfferings = courses.flatMap((c) => c.offerings);
  const start = currentPage * pageSize;
  const sliced = allOfferings.slice(start, start + pageSize);
  return groupByCourse(sliced);
}, [courses, currentPage, pageSize]);
```

---

## Grading System

### Letter Grades

All grades displayed and input as letters:

- **Scale**: A+, A, A-, B+, B, B-, C+, C, C-, D+, D, D-, F
- **Input**: Dropdown selection
- **Display**: Badges with color coding
- **Storage**: Backend stores as percentage (0-100)

### Conversion

Located in `constants/grading.js`:

```javascript
export const CUTS = {
  "A+": 97,
  A: 93,
  "A-": 90,
  "B+": 87,
  B: 83,
  "B-": 80,
  // ... etc
};

export function letterToPercent(letter) {
  /* ... */
}
export function percentToLetter(percent) {
  /* ... */
}
export function percentToGPA(percent) {
  /* 4.0 scale */
}
```

### GPA Calculation

- **Course GPA**: Weighted average of assignment grades
- **Cumulative GPA**: Credit-weighted average of final grades
- **Color Coding**: Green (3.7+), Blue (3.0+), Yellow (2.0+), Red (<2.0)

---

## Best Practices

1. **Use Query Keys Factory**: Centralized in `utils/queryKeys.js`
2. **Colocate Related Code**: Keep feature code together
3. **Custom Hooks for Data**: Encapsulate API logic
4. **Type Safety**: Use TypeScript-like JSDoc comments
5. **Error Boundaries**: Wrap app in `AppErrorBoundary`
6. **Loading States**: Always show spinners during data fetching
7. **Optimistic Updates**: Update UI before API confirms
8. **Cache Invalidation**: Invalidate related queries after mutations

---

## Troubleshooting

### API Connection Issues

- Check `VITE_API_BASE_URL` or `src/config/env.js`
- Ensure backend is running on correct port
- Check CORS configuration

### Authentication Loops

- Clear browser cookies
- Check JWT token expiration
- Verify `/api/auth/login` endpoint

### Stale Data

- Query cache may be stale - hard refresh (Cmd+Shift+R)
- Check `staleTime` in React Query config

### Styling Not Applied

- Ensure `index.css` imports `shadcn.css`
- Check Tailwind classes are valid
- Hard refresh to clear CSS cache

---

## Future Enhancements

- Real-time notifications (WebSocket)
- File upload for submissions (currently URL-based)
- Discussion forums per course
- Calendar view for assignments
- Bulk grading operations
- Export grades to CSV
- Accessibility improvements (ARIA labels)
- Mobile app (React Native)

---

For backend API documentation and database schema, see [../README.md](../README.md).
