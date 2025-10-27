import { useMemo, useState } from "react";
import { useCoursesWithOfferings } from "./useCourses";
import { useMe } from "../users/useMe";
import { canManageCourse } from "@/utils/guards";
import CoursesTable from "./CoursesTable";
import CreateOfferingForm from "../offerings/CreateOfferingForm";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { Search, Plus, Filter, ArrowUpDown } from "lucide-react";
import useDebounce from "@/hooks/useDebounce";

export default function CoursesPage() {
  const {
    data: courses,
    isLoading,
    isError,
    error,
  } = useCoursesWithOfferings();
  const { data: me } = useMe();

  const [q, setQ] = useState("");
  const dq = useDebounce(q, 300);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const [courseFilter, setCourseFilter] = useState(null);
  const [teacherFilter, setTeacherFilter] = useState(null);
  const [termFilter, setTermFilter] = useState(null);
  const [enrollmentStatusFilter, setEnrollmentStatusFilter] = useState(null);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState("code-asc");

  const searchSuggestions = useMemo(() => {
    if (!q || !courses || q.length < 2) return [];

    const needle = q.toLowerCase();
    const matches = [];

    courses.forEach((course) => {
      course.offerings?.forEach((offering) => {
        const enrollmentStatus = offering.enrollment_open ? "open" : "closed";
        if (
          offering.offering_code?.toLowerCase().includes(needle) ||
          offering.offering_name?.toLowerCase().includes(needle) ||
          offering.description?.toLowerCase().includes(needle) ||
          offering.teacher_name?.toLowerCase().includes(needle) ||
          offering.term_code?.toLowerCase().includes(needle) ||
          enrollmentStatus.includes(needle) ||
          course.code?.toLowerCase().includes(needle) ||
          course.name?.toLowerCase().includes(needle)
        ) {
          matches.push({
            offeringId: offering.id,
            offeringCode: offering.offering_code,
            offeringName: offering.offering_name,
            courseCode: course.code,
            courseName: course.name,
            term: offering.term_code,
            teacher: offering.teacher_name,
          });
        }
      });
    });

    return matches.slice(0, 10);
  }, [q, courses]);

  const filtered = useMemo(() => {
    if (!courses) return [];

    let result = courses.map((course) => ({
      ...course,
      offerings: [...(course.offerings || [])],
    }));

    result = result.map((course) => {
      let filteredOfferings = course.offerings;

      if (dq) {
        const needle = dq.toLowerCase();
        filteredOfferings = filteredOfferings.filter((o) => {
          const enrollmentStatus = o.enrollment_open ? "open" : "closed";
          const courseMatch =
            course.code?.toLowerCase().includes(needle) ||
            course.name?.toLowerCase().includes(needle);
          const offeringMatch =
            o.offering_code?.toLowerCase().includes(needle) ||
            o.offering_name?.toLowerCase().includes(needle) ||
            o.description?.toLowerCase().includes(needle) ||
            o.teacher_name?.toLowerCase().includes(needle) ||
            o.term_code?.toLowerCase().includes(needle) ||
            enrollmentStatus.includes(needle);

          return courseMatch || offeringMatch;
        });
      }

      if (teacherFilter) {
        filteredOfferings = filteredOfferings.filter(
          (o) => o.teacher_name === teacherFilter
        );
      }

      if (termFilter) {
        filteredOfferings = filteredOfferings.filter(
          (o) => o.term_code === termFilter
        );
      }

      if (enrollmentStatusFilter) {
        const isOpen = enrollmentStatusFilter === "open";
        filteredOfferings = filteredOfferings.filter(
          (o) => o.enrollment_open === isOpen
        );
      }

      return {
        ...course,
        offerings: filteredOfferings,
      };
    });

    if (courseFilter) {
      result = result.filter((course) => course.code === courseFilter);
    }

    result = result.filter((course) => course.offerings.length > 0);

    const sorted = [...result].sort((a, b) => {
      switch (sortBy) {
        case "code-asc":
          return (a.code || "").localeCompare(b.code || "");
        case "code-desc":
          return (b.code || "").localeCompare(a.code || "");
        case "name-asc": {
          const aMinOffering =
            a.offerings?.length > 0
              ? a.offerings.map((o) => o.offering_code).sort()[0]
              : a.code || "";
          const bMinOffering =
            b.offerings?.length > 0
              ? b.offerings.map((o) => o.offering_code).sort()[0]
              : b.code || "";
          return aMinOffering.localeCompare(bMinOffering);
        }
        case "name-desc": {
          const aMinOffering =
            a.offerings?.length > 0
              ? a.offerings.map((o) => o.offering_code).sort()[0]
              : a.code || "";
          const bMinOffering =
            b.offerings?.length > 0
              ? b.offerings.map((o) => o.offering_code).sort()[0]
              : b.code || "";
          return bMinOffering.localeCompare(aMinOffering);
        }
        case "latest":
          return (b.id || 0) - (a.id || 0);
        default:
          return 0;
      }
    });

    return sorted;
  }, [
    courses,
    dq,
    courseFilter,
    teacherFilter,
    termFilter,
    enrollmentStatusFilter,
    sortBy,
  ]);

  const totalOfferingsCount = useMemo(() => {
    return filtered.reduce(
      (sum, course) => sum + (course.offerings?.length || 0),
      0
    );
  }, [filtered]);

  const originalOfferingsCount = useMemo(() => {
    return (
      courses?.reduce(
        (sum, course) => sum + (course.offerings?.length || 0),
        0
      ) || 0
    );
  }, [courses]);

  const isTeacher = canManageCourse(me);

  const uniqueCourses = useMemo(() => {
    if (!courses) return [];
    return courses
      .map((c) => ({ code: c.code, name: c.name }))
      .sort((a, b) => a.code.localeCompare(b.code));
  }, [courses]);

  const uniqueTerms = useMemo(() => {
    if (!courses) return [];
    const terms = new Set();
    courses.forEach((c) => {
      c.offerings?.forEach((o) => {
        if (o.term_code) terms.add(o.term_code);
      });
    });
    return Array.from(terms).sort();
  }, [courses]);

  const uniqueTeachers = useMemo(() => {
    if (!courses) return [];
    const teachers = new Set();
    courses.forEach((c) => {
      c.offerings?.forEach((o) => {
        if (o.teacher_name) teachers.add(o.teacher_name);
      });
    });
    return Array.from(teachers).sort();
  }, [courses]);

  const resetFilters = () => {
    setCourseFilter(null);
    setTeacherFilter(null);
    setTermFilter(null);
    setEnrollmentStatusFilter(null);
    setQ("");
  };

  const activeFilterCount = [
    courseFilter,
    teacherFilter,
    termFilter,
    enrollmentStatusFilter,
  ].filter(Boolean).length;

  const shouldAutoExpandOfferings = true;

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
          {error?.response?.data?.message || "Failed to load courses"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Course Catalog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Browse available courses and offerings
          </p>
        </div>

        {isTeacher && (
          <Button
            onClick={() => setShowCreateModal(true)}
            className="border-2 border-gray-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Offering
          </Button>
        )}
      </div>

      {/* Search, Sort & Filter Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="q"
            type="search"
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setShowSearchSuggestions(true)}
            onBlur={() =>
              setTimeout(() => setShowSearchSuggestions(false), 200)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setShowSearchSuggestions(false);
                e.target.blur();
              }
            }}
            className="pl-9"
          />

          {/* Search Suggestions Dropdown */}
          {showSearchSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-96 overflow-auto">
              <div className="p-2 text-xs text-muted-foreground border-b">
                {searchSuggestions.length} offering
                {searchSuggestions.length !== 1 ? "s" : ""} match "{q}"
              </div>
              {searchSuggestions.map((suggestion) => (
                <div
                  key={suggestion.offeringId}
                  className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                  onClick={() => {
                    setQ(suggestion.offeringCode);
                    setShowSearchSuggestions(false);
                  }}
                >
                  <div className="font-medium text-sm">
                    {suggestion.offeringCode} - {suggestion.offeringName}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {suggestion.courseCode} · {suggestion.term} ·{" "}
                    {suggestion.teacher}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[200px]">
            <ArrowUpDown className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="code-asc">Course Code: A → Z</SelectItem>
            <SelectItem value="code-desc">Course Code: Z → A</SelectItem>
            <SelectItem value="name-asc">Offering Code: A → Z</SelectItem>
            <SelectItem value="name-desc">Offering Code: Z → A</SelectItem>
            <SelectItem value="latest">Latest</SelectItem>
          </SelectContent>
        </Select>

        {/* Filter Dialog */}
        <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
          <DialogTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Filter Course Catalog</DialogTitle>
              <DialogDescription>
                Filter by course, teacher, term, and enrollment status
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-end py-4">
              {/* Course Filter */}
              <div className="space-y-1">
                <Label htmlFor="course-filter">Course</Label>
                <Select value={courseFilter} onValueChange={setCourseFilter}>
                  <SelectTrigger id="course-filter" className="w-full">
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCourses.map((course) => (
                      <SelectItem key={course.code} value={course.code}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Teacher Filter */}
              <div className="space-y-1">
                <Label htmlFor="teacher-filter">Teacher</Label>
                <Select value={teacherFilter} onValueChange={setTeacherFilter}>
                  <SelectTrigger id="teacher-filter" className="w-full">
                    <SelectValue placeholder="All Teachers" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTeachers.map((teacher) => (
                      <SelectItem key={teacher} value={teacher}>
                        {teacher}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Term Filter */}
              <div className="space-y-1">
                <Label htmlFor="term-filter">Term</Label>
                <Select value={termFilter} onValueChange={setTermFilter}>
                  <SelectTrigger id="term-filter" className="w-full">
                    <SelectValue placeholder="All Terms" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTerms.map((term) => (
                      <SelectItem key={term} value={term}>
                        {term}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Enrollment Status Filter */}
              <div className="space-y-1">
                <Label htmlFor="enrollment-filter">Enrollment Status</Label>
                <Select
                  value={enrollmentStatusFilter}
                  onValueChange={setEnrollmentStatusFilter}
                >
                  <SelectTrigger id="enrollment-filter" className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-full flex justify-end gap-2 pt-2 border-t mt-3">
                <Button variant="outline" onClick={resetFilters}>
                  Clear All
                </Button>
                <Button onClick={() => setShowFilterDialog(false)}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Results Info */}
      {activeFilterCount > 0 && (
        <Alert>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Showing {totalOfferingsCount} of {originalOfferingsCount}{" "}
              offerings with {activeFilterCount} filter(s) applied
            </span>
            <Button variant="link" size="sm" onClick={resetFilters}>
              Clear filters
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Courses Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>All Courses</CardTitle>
            <CardDescription>
              {filtered?.length || 0} course{filtered?.length !== 1 ? "s" : ""}{" "}
              · {totalOfferingsCount} offering
              {totalOfferingsCount !== 1 ? "s" : ""}
            </CardDescription>
          </div>

          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => setPageSize(Number(v))}
            >
              <SelectTrigger className="w-[88px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {!filtered?.length ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No courses found.</p>
            </div>
          ) : (
            <CoursesTable
              data={filtered}
              pageSize={pageSize}
              autoExpandOfferings={shouldAutoExpandOfferings}
            />
          )}
        </CardContent>
      </Card>

      {/* Create Course Modal */}
      {isTeacher && (
        <CreateOfferingForm
          open={showCreateModal}
          onOpenChange={setShowCreateModal}
        />
      )}
    </div>
  );
}
