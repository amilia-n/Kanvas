import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BookOpen,
  User,
  Award,
  FileText,
  Users,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { paths } from "@/routes/paths";
import { cn } from "@/lib/utils";
import { ROLES } from "@/constants/roles";
import { useMe } from "@/features/users/useMe";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "sidebarCollapsed";

export default function Sidebar() {
  const { data: user, isLoading } = useMe();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw == null ? true : JSON.parse(raw) === true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(isCollapsed));
    } catch (err) {
      void err;
    }
  }, [isCollapsed]);

  if (isLoading) return null;

  const isTeacher = user?.role === ROLES.TEACHER || user?.role === ROLES.ADMIN;
  const isStudent = user?.role === ROLES.STUDENT;

  const MY_OFFERINGS = paths.myOfferings ?? paths.offerings ?? "/offerings";

  const studentNavItems = [
    {
      key: "my",
      to: MY_OFFERINGS,
      label: "My Courses",
      icon: Home,
      end: false,
    },
    { key: "grades", to: paths.grades, label: "GPA", icon: Award, end: true },
    {
      key: "assignments",
      to: paths.assignments,
      label: "Assignments",
      icon: FileText,
      end: true,
    },
    {
      key: "courses",
      to: paths.courses,
      label: "Course Catalog",
      icon: BookOpen,
      end: true,
    },
    { key: "me", to: paths.me, label: "Profile", icon: User, end: true },
  ];

  const teacherNavItems = [
    {
      key: "my",
      to: MY_OFFERINGS,
      label: "My Courses",
      icon: Home,
      end: false,
    },
    {
      key: "grades",
      to: paths.grades,
      label: "Grades & GPA",
      icon: Award,
      end: true,
    },
    {
      key: "assignments",
      to: paths.assignments,
      label: "Assignments",
      icon: FileText,
      end: true,
    },
    {
      key: "enroll-mgr",
      to: "/enrollments/manage",
      label: "Enrollment Management",
      icon: Users,
      end: true,
    },
    {
      key: "submissions",
      to: "/submissions",
      label: "Submissions",
      icon: FileText,
      end: true,
    },
    {
      key: "courses",
      to: paths.courses,
      label: "Course Catalog",
      icon: BookOpen,
      end: true,
    },
    { key: "me", to: paths.me, label: "Profile", icon: User, end: true },
  ];

  const navItems = isTeacher ? teacherNavItems : studentNavItems;

  return (
    <aside
      className={cn(
        "flex sticky top-0 h-screen flex-col border-r border-border bg-card transition-[width] duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-end p-2 px-3 border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed((v) => !v)}
          className="h-8 w-8 p-0"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[hsl(79,24.8%,88%)] text-black font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  isCollapsed && "justify-center"
                )
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-border p-5">
        <div
          className={cn(
            "flex items-center gap-2 text-xs text-muted-foreground",
            isCollapsed && "justify-center"
          )}
        >
          <GraduationCap className="h-4 w-4 shrink-0" />
          {!isCollapsed && (
            <span>
              {isTeacher ? "Teacher" : isStudent ? "Student" : "User"} Portal
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
