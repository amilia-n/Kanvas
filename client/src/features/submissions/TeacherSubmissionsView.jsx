import { useState, useMemo } from "react";
import { useAssignments } from "../assignments/useAssignments";
import {
  useSubmissionsForOffering,
  useSubmitGrade,
  useAllSubmissionsForTeacher,
} from "./useSubmissions";
import { formatDateTime } from "@/utils/format";
import { ORDER, letterToPercent, percentToLetter } from "@/constants/grading";
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
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { Badge } from "@/components/ui/Badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { CheckCircle2, Clock, ExternalLink, Award } from "lucide-react";

export default function TeacherSubmissionsView({ offeringId }) {
  const offeringIdNum = offeringId ? Number(offeringId) : null;

  const {
    data: allSubmissions,
    isLoading: allLoading,
    isError: allError,
    error: allErr,
  } = useAllSubmissionsForTeacher({ enabled: !offeringIdNum });

  const {
    data: offeringSubmissions,
    isLoading: offeringLoading,
    isError: offeringError,
    error: offeringErr,
  } = useSubmissionsForOffering(offeringIdNum, { enabled: !!offeringIdNum });

  const { data: assignments, isLoading: assignmentsLoading } = useAssignments(
    offeringIdNum,
    { enabled: !!offeringIdNum }
  );

  const submissions = offeringIdNum ? offeringSubmissions : allSubmissions;
  const submissionsLoading = offeringIdNum ? offeringLoading : allLoading;
  const isError = offeringIdNum ? offeringError : allError;
  const error = offeringIdNum ? offeringErr : allErr;

  const gradeMutation = useSubmitGrade();

  const [selectedAssignmentId, setSelectedAssignmentId] = useState("all");
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeValue, setGradeValue] = useState("");

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!gradingSubmission || !gradeValue) return;

    const gradeNum = letterToPercent(gradeValue);

    try {
      await gradeMutation.mutateAsync({
        grade_percent: gradeNum,
        assignment_id: gradingSubmission.assignment_id,
        student_id: gradingSubmission.student_id,
      });
      setGradingSubmission(null);
      setGradeValue("");
    } catch (err) {
      console.error("Grade submission failed:", err);
    }
  };

  const filteredSubmissions = useMemo(() => {
    if (!submissions) return [];
    if (selectedAssignmentId === "all") return submissions;
    return submissions.filter(
      (s) => s.assignment_id === Number(selectedAssignmentId)
    );
  }, [submissions, selectedAssignmentId]);

  const submissionsByAssignment = useMemo(() => {
    const grouped = {};
    submissions?.forEach((sub) => {
      if (!grouped[sub.assignment_id]) {
        grouped[sub.assignment_id] = [];
      }
      grouped[sub.assignment_id].push(sub);
    });
    return grouped;
  }, [submissions]);

  if (assignmentsLoading || submissionsLoading) {
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
          {error?.response?.data?.message || "Failed to load submissions"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {offeringIdNum ? "Course Submissions" : "All Student Submissions"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {offeringIdNum
              ? "View and grade student submissions for this offering"
              : "Grade submissions across all your courses"}
          </p>
        </div>
      </div>

      {/* Filter by Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="assignment-filter">Assignment</Label>
              <Select
                value={selectedAssignmentId}
                onValueChange={setSelectedAssignmentId}
              >
                <SelectTrigger id="assignment-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignments</SelectItem>
                  {assignments?.map((a) => (
                    <SelectItem key={a.id} value={String(a.id)}>
                      {a.title} ({submissionsByAssignment[a.id]?.length || 0}{" "}
                      submissions)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredSubmissions.length} submission
              {filteredSubmissions.length !== 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grade Submission Form */}
      {gradingSubmission && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Grade Submission</CardTitle>
            <CardDescription>
              Assignment: {gradingSubmission.assignment_title} · Student:{" "}
              {gradingSubmission.student_name ||
                gradingSubmission.student_email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGradeSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="submission-url">Submission URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="submission-url"
                    value={gradingSubmission.submission_url}
                    readOnly
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm" asChild>
                    <a
                      href={gradingSubmission.submission_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade">Grade*</Label>
                <Select value={gradeValue} onValueChange={setGradeValue}>
                  <SelectTrigger id="grade">
                    <SelectValue placeholder="Select grade..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ORDER.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={gradeMutation.isPending}>
                  <Award className="h-4 w-4 mr-2" />
                  {gradeMutation.isPending ? "Submitting..." : "Submit Grade"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setGradingSubmission(null);
                    setGradeValue("");
                  }}
                  disabled={gradeMutation.isPending}
                >
                  Cancel
                </Button>
              </div>

              {gradeMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {gradeMutation.error?.response?.data?.message ||
                      gradeMutation.error?.message ||
                      "Failed to submit grade"}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            {filteredSubmissions.length} submission
            {filteredSubmissions.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!filteredSubmissions.length ? (
            <p className="text-center text-muted-foreground py-8">
              No submissions yet.
            </p>
          ) : (
            <div className="space-y-4">
              {filteredSubmissions.map((sub) => {
                const isGraded =
                  sub.grade_percent !== null && sub.grade_percent !== undefined;

                return (
                  <div
                    key={`${sub.assignment_id}-${sub.student_id}`}
                    className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium">
                          {sub.student_name ||
                            sub.student_email ||
                            `Student #${sub.student_id}`}
                        </h3>
                        {/* Show offering info when viewing all submissions */}
                        {!offeringIdNum && (
                          <Badge variant="outline">
                            {sub.offering_code}-{sub.section} ({sub.term_code})
                          </Badge>
                        )}
                        <Badge variant={isGraded ? "default" : "secondary"}>
                          {isGraded ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Graded: {percentToLetter(sub.grade_percent)}
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </>
                          )}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        <strong>Assignment:</strong>{" "}
                        {sub.assignment_title || `#${sub.assignment_id}`}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        <strong>Submitted:</strong>{" "}
                        {formatDateTime(sub.submitted_at)}
                      </p>

                      <p className="text-sm text-muted-foreground break-all">
                        <strong>URL:</strong>{" "}
                        <a
                          href={sub.submission_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          {sub.submission_url}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </p>

                      {isGraded && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Graded:</strong>{" "}
                          {formatDateTime(sub.graded_at)} by{" "}
                          {sub.graded_by_name || `User #${sub.graded_by}`}
                        </p>
                      )}
                    </div>

                    <Button
                      variant={isGraded ? "outline" : "default"}
                      size="sm"
                      onClick={() => {
                        setGradingSubmission(sub);
                        setGradeValue(
                          isGraded ? percentToLetter(sub.grade_percent) : ""
                        );
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {isGraded ? "Update Grade" : "Grade"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
