import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useCourse } from "./useCourses";
import { useOfferingsForCourse } from "../offerings/useOfferings";
import { paths } from "@/routes/paths";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import { 
  ArrowLeft, 
  BookOpen, 
  User, 
  Users, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Calendar,
  Clock
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = Number(id);

  const { data: course, isLoading, isError, error } = useCourse(courseId);
  const { data: offerings, isLoading: offeringsLoading } = useOfferingsForCourse(courseId);

  const [searchQuery, setSearchQuery] = useState("");
  const [termFilter, setTermFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [showPast, setShowPast] = useState(false);

  const uniqueTerms = useMemo(() => {
    if (!offerings) return [];
    const terms = new Set(offerings.map((o) => o.term_code));
    return Array.from(terms).sort();
  }, [offerings]);

  const uniqueTeachers = useMemo(() => {
    if (!offerings) return [];
    const teachers = new Set(offerings.map((o) => o.teacher_name));
    return Array.from(teachers).sort();
  }, [offerings]);

  const filtered = useMemo(() => {
    if (!offerings) return { current: [], upcoming: [], past: [] };

    let filtered = offerings;

    if (searchQuery) {
      const needle = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.term_code?.toLowerCase().includes(needle) ||
          o.teacher_name?.toLowerCase().includes(needle) ||
          String(o.section).includes(needle)
      );
    }

    if (termFilter !== "all") {
      filtered = filtered.filter((o) => o.term_code === termFilter);
    }

    if (teacherFilter !== "all") {
      filtered = filtered.filter((o) => o.teacher_name === teacherFilter);
    }

    return {
      current: filtered.filter((o) => o.status === "current"),
      upcoming: filtered.filter((o) => o.status === "upcoming"),
      past: filtered.filter((o) => o.status === "past"),
    };
  }, [offerings, searchQuery, termFilter, teacherFilter]);

  if (isLoading || offeringsLoading) {
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
          {error?.response?.data?.message || "Failed to load course"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!course) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Course not found</AlertDescription>
      </Alert>
    );
  }

  const renderOfferingCard = (offering, status) => (
    <div
      key={offering.id}
      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
        status === "past" ? "opacity-75" : "hover:bg-muted/50"
      }`}
      onClick={() => navigate(paths.offering(offering.id))}
    >
      <div className="space-y-2 flex-1">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={status === "current" ? "default" : status === "upcoming" ? "outline" : "secondary"}>
            Section {offering.section}
          </Badge>
          <span className="text-sm font-medium">{offering.term_code}</span>
          {status === "upcoming" && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Starts {new Date(offering.starts_on).toLocaleDateString()}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{offering.teacher_name}</span>
          </div>
          {status !== "past" && (
            <>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{offering.seats_left || 0} seats available</span>
              </div>
              {offering.enrollment_open ? (
                <Badge variant="default" className="text-xs">Open</Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">Closed</Badge>
              )}
            </>
          )}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
    </div>
  );

  const activeFilterCount = [
    searchQuery,
    termFilter !== "all" ? termFilter : null,
    teacherFilter !== "all" ? teacherFilter : null,
  ].filter(Boolean).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold">{course.code}</h1>
            </div>
            <h2 className="text-lg text-muted-foreground">{course.name}</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {filtered.current.length} current · {filtered.upcoming.length} upcoming · {filtered.past.length} past
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by term, teacher, or section..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
              <Select value={termFilter} onValueChange={setTermFilter}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Terms</SelectItem>
                  {uniqueTerms.map((term) => (
                    <SelectItem key={term} value={term}>
                      {term}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={teacherFilter} onValueChange={setTeacherFilter}>
                <SelectTrigger className="w-[200px]">
                  <User className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Teachers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  {uniqueTeachers.map((teacher) => (
                    <SelectItem key={teacher} value={teacher}>
                      {teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {activeFilterCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setTermFilter("all");
                    setTeacherFilter("all");
                  }}
                >
                  Clear Filters ({activeFilterCount})
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Offerings */}
      {filtered.current.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current Offerings</CardTitle>
                <CardDescription>Available sections this term</CardDescription>
              </div>
              <Badge variant="default">{filtered.current.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filtered.current.map((offering) => renderOfferingCard(offering, "current"))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Offerings */}
      {filtered.upcoming.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Offerings</CardTitle>
                <CardDescription>Future sections</CardDescription>
              </div>
              <Badge variant="outline">{filtered.upcoming.length}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filtered.upcoming.map((offering) => renderOfferingCard(offering, "upcoming"))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Past Offerings */}
      {filtered.past.length > 0 && (
        <Card>
          <CardHeader
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setShowPast(!showPast)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <CardTitle>Past Offerings</CardTitle>
                  <CardDescription>Previous sections</CardDescription>
                </div>
                <Badge variant="secondary">{filtered.past.length}</Badge>
              </div>
              {showPast ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          </CardHeader>
          {showPast && (
            <CardContent>
              <div className="space-y-2">
                {filtered.past.map((offering) => renderOfferingCard(offering, "past"))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* No results */}
      {offerings?.length > 0 && filtered.current.length === 0 && filtered.upcoming.length === 0 && filtered.past.length === 0 && (
        <Alert>
          <AlertDescription>
            No offerings match your filters. Try adjusting your search criteria.
          </AlertDescription>
        </Alert>
      )}

      {/* No offerings at all */}
      {!offerings?.length && (
        <Alert>
          <AlertDescription>
            No offerings available for this course yet.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}