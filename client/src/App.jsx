import { Routes, Route, Navigate } from "react-router-dom";
import Shell from "./components/layout/Shell";
import LoginPage from "./features/auth/LoginPage";
import LogoutPage from "./features/auth/LogoutPage";
import ResetPasswordPage from "./features/auth/ResetPasswordPage";

import MyOfferingsPage from "./features/auth/myOfferings";
import CourseMaterialPage from "./features/materials/CourseMaterial";
import CoursesPage from "./features/courses/CoursesPage";
import CourseDetailPage from "./features/courses/CourseDetailPage";
import OfferingDetailPage from "./features/offerings/OfferingDetailPage";
import ProfilePage from "./features/users/ProfilePage";
import GradesPage from "./features/grades/GradesPage";
import AssignmentsPage from "./features/assignments/AssignmentsPage";
import AssignmentDetailPage from "./features/assignments/AssignmentDetailPage";
import SubmissionsPage from "./features/submissions/SubmissionsPage";
import EnrollmentManagementPage from "./features/enrollments/EnrollmentManagement";

import ProtectedRoute from "./routes/ProtectedRoute";
import { paths } from "./routes/paths";
import { ROLES } from "./constants/roles";

function ForbiddenPage() {
  return (
    <div style={{ padding: 24 }}>
      <h1>403 — Forbidden</h1>
      <p>You don't have access to this page.</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={paths.login} element={<LoginPage />} />
      <Route path={paths.reset} element={<ResetPasswordPage />} />
      <Route path={paths.forbidden} element={<ForbiddenPage />} />

      {/* Auth-protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Shell />}>
          {/* Home - My Offerings */}
          <Route path={paths.myOfferings} element={<MyOfferingsPage />} />
          <Route
            path={paths.home}
            element={<Navigate to={paths.myOfferings} replace />}
          />

          {/* Course Material (Classroom) */}
          <Route
            path={paths.courseMaterial()}
            element={<CourseMaterialPage />}
          />

          {/* Course Catalog & Details */}
          <Route path={paths.courses} element={<CoursesPage />} />
          <Route path={paths.course()} element={<CourseDetailPage />} />

          {/* Offerings */}
          <Route path={paths.offering()} element={<OfferingDetailPage />} />

          {/* Assignments */}
          <Route path={paths.assignments} element={<AssignmentsPage />} />
          <Route path={paths.assignment()} element={<AssignmentDetailPage />} />

          {/* GPA/Grades */}
          <Route path={paths.grades} element={<GradesPage />} />

          {/* Submissions - Central grading page for teachers */}
          <Route
            path={paths.submissions}
            element={
              <ProtectedRoute roles={[ROLES.TEACHER, ROLES.ADMIN]}>
                <SubmissionsPage />
              </ProtectedRoute>
            }
          />

          {/* Submissions per offering */}
          <Route
            path={paths.offeringSubmissions()}
            element={
              <ProtectedRoute roles={[ROLES.TEACHER, ROLES.ADMIN]}>
                <SubmissionsPage />
              </ProtectedRoute>
            }
          />

          {/* Enrollment Management (Teachers) */}
          <Route
            path={paths.enrollmentManage}
            element={
              <ProtectedRoute roles={[ROLES.TEACHER, ROLES.ADMIN]}>
                <EnrollmentManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Profile */}
          <Route path={paths.me} element={<ProfilePage />} />

          {/* Logout */}
          <Route path={paths.logout} element={<LogoutPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={paths.myOfferings} replace />} />
    </Routes>
  );
}
