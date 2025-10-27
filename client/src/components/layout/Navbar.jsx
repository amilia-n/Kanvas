import { Link } from "react-router-dom";
import { GraduationCap, User, LogOut } from "lucide-react";
import { paths } from "@/routes/paths";
import { Button } from "@/components/ui/Button";
import { useMe } from "@/features/users/useMe";

export default function Navbar() {
  const { data: user } = useMe();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center px-6">
        <Link
          to={paths.myOfferings}
          className="flex items-center gap-2 font-semibold"
        >
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">Kanvas</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          {user && (
            <span className="hidden text-sm text-muted-foreground md:inline-block">
              {user.email}
            </span>
          )}
          <Button variant="ghost" size="sm" asChild>
            <Link to={paths.me}>
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to={paths.logout}>
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
