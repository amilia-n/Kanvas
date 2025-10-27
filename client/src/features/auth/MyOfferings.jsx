import { useNavigate } from "react-router-dom";
import { useMyOfferings } from "@/features/offerings/useOfferings";
import { useMe } from "../users/useMe";
import { ROLES } from "@/constants/roles";
import { paths } from "@/routes/paths";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { BookOpen, User, Calendar, ChevronRight, Clock } from "lucide-react";

export default function MyOfferingsPage() {
  const navigate = useNavigate();
  const { data: me } = useMe();
  const { data: offerings, isLoading, isError, error } = useMyOfferings();

  const isTeacher = me?.role === ROLES.TEACHER || me?.role === ROLES.ADMIN;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {error?.response?.data?.message || "Failed to load your courses"}
        </AlertDescription>
      </Alert>
    );
  }

  // Separate offerings by status
  const currentOfferings =
    offerings?.filter((o) => o.status === "current") ?? [];
  const upcomingOfferings =
    offerings?.filter((o) => o.status === "upcoming") ?? [];
  const pastOfferings =
    offerings?.filter((o) => o.status === "past" || o.status === "completed") ??
    [];

  // Render offering card
  const renderOfferingCard = (offering, isPast = false) => (
    <Card
      key={offering.id}
      className={`cursor-pointer transition-all ${
        isPast
          ? "opacity-75 hover:opacity-100"
          : "hover:shadow-lg hover:border-primary/50"
      }`}
      onClick={() => navigate(paths.courseMaterial(offering.id))}
    >
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg leading-tight">
              {offering.offering_code}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {offering.offering_name}
            </CardDescription>
          </div>
          <Badge variant={isPast ? "secondary" : "default"} className="ml-2">
            {isPast ? "Completed" : `Section ${offering.section}`}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Term */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{offering.term_code}</span>
        </div>

        {/* Teacher/Students */}
        {isTeacher ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{offering.enrolled_count || 0} students</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{offering.teacher_name}</span>
          </div>
        )}

        {/* Final Grade for past student courses */}
        {!isTeacher && isPast && offering.final_grade && (
          <div className="text-sm">
            <span className="text-muted-foreground">Final Grade: </span>
            <span className="font-medium">{offering.final_grade}%</span>
          </div>
        )}

        {/* Enter Classroom Button */}
        {!isPast && (
          <Button
            className="w-full"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(paths.courseMaterial(offering.id));
            }}
          >
            <BookOpen className="h-4 w-4 mr-2" />
            Enter Classroom
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">
          {isTeacher ? "My Teaching Schedule" : "My Courses"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {currentOfferings.length} current · {upcomingOfferings.length}{" "}
          upcoming · {pastOfferings.length} past
        </p>
      </div>

      {/* Current Courses */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">Current Courses</h2>
          <Badge variant="default">{currentOfferings.length}</Badge>
        </div>

        {!currentOfferings.length ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No current courses.{" "}
                {!isTeacher && (
                  <>
                    Visit the{" "}
                    <Button
                      variant="link"
                      className="p-0 h-auto"
                      onClick={() => navigate(paths.courses)}
                    >
                      Course Catalog
                    </Button>{" "}
                    to browse available courses.
                  </>
                )}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentOfferings.map((offering) => renderOfferingCard(offering))}
          </div>
        )}
      </div>

      {/* Upcoming Courses */}
      {upcomingOfferings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">Upcoming Courses</h2>
            <Badge variant="outline">{upcomingOfferings.length}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingOfferings.map((offering) => (
              <Card
                key={offering.id}
                className="border-dashed hover:border-solid hover:shadow-md transition-all"
              >
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg leading-tight">
                        {offering.offering_code}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {offering.offering_name}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      <Clock className="h-3 w-3 mr-1" />
                      Upcoming
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{offering.term_code}</span>
                  </div>

                  {isTeacher ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>
                        {offering.enrolled_count || 0} students enrolled
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>{offering.teacher_name}</span>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Starts: {new Date(offering.starts_on).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Past Courses */}
      {pastOfferings.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">Past Courses</h2>
            <Badge variant="secondary">{pastOfferings.length}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastOfferings.map((offering) =>
              renderOfferingCard(offering, true)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
