import { API_BASE } from "@/constants/apiRoutes";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMyOfferings } from "@/features/offerings/useOfferings";
import { useAssignments } from "../assignments/useAssignments";
import { useSubmissionsForOffering } from "../submissions/useSubmissions";
import { useUpdateFinalGrade } from "./useGrades";
import { ORDER, letterToPercent, percentToLetter } from "@/constants/grading";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  BookOpen,
  GraduationCap,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const LETTER_GRADES = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
];

function percentToGPA(percent) {
  if (percent == null) return null;
  if (percent >= 97) return 4.0; // A+
  if (percent >= 93) return 4.0; // A
  if (percent >= 90) return 3.7; // A-
  if (percent >= 87) return 3.3; // B+
  if (percent >= 83) return 3.0; // B
  if (percent >= 80) return 2.7; // B-
  if (percent >= 77) return 2.3; // C+
  if (percent >= 73) return 2.0; // C
  if (percent >= 70) return 1.7; // C-
  if (percent >= 67) return 1.3; // D+
  if (percent >= 63) return 1.0; // D
  if (percent >= 60) return 0.7; // D-
  return 0.0; // F
}

export default function TeacherGradesView() {
  const navigate = useNavigate();
  const { data: offerings, isLoading: offeringsLoading } = useMyOfferings();
  const [expandedTerms, setExpandedTerms] = useState({});

  const { currentOfferings, pastOfferingsByTerm } = useMemo(() => {
    if (!offerings) return { currentOfferings: [], pastOfferingsByTerm: {} };

    const current = offerings.filter(
      (o) => o.status === "current" || o.status === "enrolled"
    );
    const past = offerings.filter(
      (o) => o.status === "past" || o.status === "completed"
    );

    const byTerm = {};
    past.forEach((offering) => {
      const term = offering.term_code;
      if (!byTerm[term]) {
        byTerm[term] = [];
      }
      byTerm[term].push(offering);
    });

    const sortedByTerm = Object.keys(byTerm)
      .sort((a, b) => b.localeCompare(a))
      .reduce((acc, term) => {
        acc[term] = byTerm[term];
        return acc;
      }, {});

    return { currentOfferings: current, pastOfferingsByTerm: sortedByTerm };
  }, [offerings]);

  const toggleTerm = (term) => {
    setExpandedTerms((prev) => ({
      ...prev,
      [term]: !prev[term],
    }));
  };

  if (offeringsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Grade Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          View and manage student grades for your courses
        </p>
      </div>

      {/* Current Courses */}
      {currentOfferings.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Current Courses</h2>
          {currentOfferings.map((offering) => (
            <OfferingGradeTable
              key={offering.id}
              offering={offering}
              navigate={navigate}
            />
          ))}
        </div>
      )}

      {!currentOfferings.length && !Object.keys(pastOfferingsByTerm).length && (
        <Alert>
          <AlertDescription>You have no courses.</AlertDescription>
        </Alert>
      )}

      {/* Past Courses - Grouped by Term */}
      {Object.keys(pastOfferingsByTerm).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Past Courses</h2>
          {Object.entries(pastOfferingsByTerm).map(([term, termOfferings]) => (
            <Card key={term} className="border-muted">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleTerm(term)}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    {expandedTerms[term] ? (
                      <ChevronDown className="h-5 w-5" />
                    ) : (
                      <ChevronRight className="h-5 w-5" />
                    )}
                    {term}
                  </CardTitle>
                  <Badge variant="secondary">
                    {termOfferings.length} course
                    {termOfferings.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>
              {expandedTerms[term] && (
                <CardContent className="space-y-4 pt-4">
                  {termOfferings.map((offering) => (
                    <OfferingGradeTable
                      key={offering.id}
                      offering={offering}
                      navigate={navigate}
                      isPast={true}
                    />
                  ))}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function OfferingGradeTable({ offering, navigate, isPast = false }) {
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments(
    offering.id
  );
  const { data: submissions, isLoading: submissionsLoading } =
    useSubmissionsForOffering(offering.id);

  const [editingGPA, setEditingGPA] = useState({});
  const updateGradeMutation = useUpdateFinalGrade();

  const studentData = useMemo(() => {
    if (!submissions || !assignments) return [];

    const studentsMap = new Map();

    submissions.forEach((sub) => {
      if (!studentsMap.has(sub.student_id)) {
        studentsMap.set(sub.student_id, {
          student_id: sub.student_id,
          student_name: sub.student_name,
          submissions: {},
        });
      }

      if (sub.assignment_id != null) {
        studentsMap.get(sub.student_id).submissions[sub.assignment_id] =
          sub.grade_percent;
      }
    });

    const students = Array.from(studentsMap.values());
    students.forEach((student) => {
      let totalWeightedScore = 0;
      let totalWeight = 0;

      assignments.forEach((assignment) => {
        const grade = student.submissions[assignment.id];
        if (grade != null) {
          totalWeightedScore += grade * Number(assignment.weight_percent);
          totalWeight += Number(assignment.weight_percent);
        }
      });

      const currentPercent =
        totalWeight > 0 ? totalWeightedScore / totalWeight : null;
      const currentGPA =
        currentPercent != null ? percentToGPA(currentPercent) : null;

      student.current_percent = currentPercent;
      student.current_gpa = currentGPA;
      student.cumulative_gpa = currentGPA;
    });

    return students.sort((a, b) =>
      a.student_name.localeCompare(b.student_name)
    );
  }, [submissions, assignments]);

  const handleGPAUpdate = async (studentId) => {
    const letterGrade = editingGPA[studentId];

    if (!letterGrade) {
      alert("Please select a letter grade");
      return;
    }

    const finalPercent = letterToPercent(letterGrade);

    try {
      await updateGradeMutation.mutateAsync({
        offering_id: offering.id,
        student_id: studentId,
        final_percent: finalPercent,
      });

      setEditingGPA((prev) => ({ ...prev, [studentId]: undefined }));
      alert(`✓ Updated final grade to ${letterGrade}`);
    } catch (err) {
      alert(
        `✗ Error: ${err?.response?.data?.message || "Failed to update grade"}`
      );
    }
  };

  const getGPAColor = (gpa) => {
    if (gpa == null) return "text-muted-foreground";
    if (gpa >= 3.7) return "text-green-600 dark:text-green-400";
    if (gpa >= 3.0) return "text-blue-600 dark:text-blue-400";
    if (gpa >= 2.0) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  if (assignmentsLoading || submissionsLoading) {
    return <Spinner />;
  }

  return (
    <Card className={isPast ? "border-muted" : ""}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {offering.offering_code} - Section {offering.section}
          </CardTitle>
          <CardDescription>
            {offering.offering_name} · {offering.term_code} ·{" "}
            {studentData.length} student{studentData.length !== 1 ? "s" : ""}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(paths.courseMaterial(offering.id))}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Go to Classroom
        </Button>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-auto">
        {!assignments?.length ? (
          <Alert>
            <AlertDescription>No assignments created yet.</AlertDescription>
          </Alert>
        ) : !studentData.length ? (
          <Alert>
            <AlertDescription>No students enrolled.</AlertDescription>
          </Alert>
        ) : (
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Student</TableHead>
                  {assignments.map((assignment) => (
                    <TableHead
                      key={assignment.id}
                      className="text-center min-w-[100px]"
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-normal">
                          {assignment.title}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({assignment.weight_percent}%)
                        </span>
                      </div>
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[120px] bg-muted/50">
                    {isPast ? "Final Grade" : "Current Grade"}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentData.map((student) => (
                  <TableRow key={student.student_id}>
                    <TableCell className="font-medium">
                      {student.student_name}
                    </TableCell>
                    {assignments.map((assignment) => {
                      const grade = student.submissions[assignment.id];
                      return (
                        <TableCell key={assignment.id} className="text-center">
                          {grade != null ? (
                            <Badge
                              variant={
                                grade >= 77
                                  ? "default"
                                  : grade >= 60
                                  ? "secondary"
                                  : "destructive"
                              }
                            >
                              {percentToLetter(grade)}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              —
                            </span>
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-center bg-muted/30">
                      <div className="flex items-center justify-center gap-2">
                        {!isPast &&
                        editingGPA[student.student_id] !== undefined ? (
                          <div className="flex items-center gap-1">
                            <Select
                              value={editingGPA[student.student_id] || ""}
                              onValueChange={(value) =>
                                setEditingGPA((prev) => ({
                                  ...prev,
                                  [student.student_id]: value,
                                }))
                              }
                            >
                              <SelectTrigger className="w-24 h-8">
                                <SelectValue placeholder="--" />
                              </SelectTrigger>
                              <SelectContent>
                                {ORDER.map((grade) => (
                                  <SelectItem key={grade} value={grade}>
                                    {grade}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Button
                              size="sm"
                              onClick={() =>
                                handleGPAUpdate(student.student_id)
                              }
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setEditingGPA((prev) => ({
                                  ...prev,
                                  [student.student_id]: undefined,
                                }))
                              }
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <button
                            onClick={() =>
                              !isPast &&
                              setEditingGPA((prev) => ({
                                ...prev,
                                [student.student_id]:
                                  student.current_percent != null
                                    ? percentToLetter(student.current_percent)
                                    : "",
                              }))
                            }
                            className={`font-semibold ${
                              !isPast ? "hover:underline" : ""
                            } ${
                              student.current_percent != null
                                ? getGPAColor(
                                    percentToGPA(student.current_percent)
                                  )
                                : "text-muted-foreground"
                            }`}
                            disabled={isPast}
                          >
                            {student.current_percent != null
                              ? percentToLetter(student.current_percent)
                              : "—"}
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
