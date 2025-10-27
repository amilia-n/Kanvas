import { useState } from "react";
import { useAssignments } from "../assignments/useAssignments";
import { useSubmitOrResubmit, useMySubmissions } from "./useSubmissions";
import { formatDateTime } from "@/utils/format";
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
import { Upload, CheckCircle2, Clock } from "lucide-react";

export default function StudentSubmissionsView({ offeringId }) {
  const offeringIdNum = Number(offeringId);

  const {
    data: assignments,
    isLoading,
    isError,
    error,
  } = useAssignments(offeringIdNum);
  const { data: mySubmissions } = useMySubmissions(offeringIdNum);
  const submitMutation = useSubmitOrResubmit();

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAssignment || !submissionUrl.trim()) return;

    try {
      await submitMutation.mutateAsync({
        assignment_id: selectedAssignment.id,
        submission_url: submissionUrl.trim(),
      });
      setSubmissionUrl("");
      setSelectedAssignment(null);
    } catch (err) {
      console.error("Submission failed:", err);
    }
  };

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
          {error?.response?.data?.message || "Failed to load assignments"}
        </AlertDescription>
      </Alert>
    );
  }

  const openAssignments = assignments?.filter((a) => a.is_open) ?? [];

  const submissionMap = {};
  mySubmissions?.forEach((sub) => {
    submissionMap[sub.assignment_id] = sub;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">My Submissions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Submit your work for open assignments
        </p>
      </div>

      {/* Submit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Submit Assignment</CardTitle>
          <CardDescription>
            Choose an assignment and provide your submission URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!openAssignments.length ? (
            <p className="text-sm text-muted-foreground">
              No open assignments available.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="assignment">Assignment*</Label>
                <select
                  id="assignment"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={selectedAssignment?.id ?? ""}
                  onChange={(e) => {
                    const selected = openAssignments.find(
                      (a) => a.id === Number(e.target.value)
                    );
                    setSelectedAssignment(selected || null);
                  }}
                  required
                >
                  <option value="">Select an assignment...</option>
                  {openAssignments.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} - Due: {formatDateTime(a.due_at)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Submission URL*</Label>
                <Input
                  id="url"
                  type="url"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  placeholder="https://github.com/username/repo"
                  required
                />
              </div>

              <Button type="submit" disabled={submitMutation.isPending}>
                <Upload className="h-4 w-4 mr-2" />
                {submitMutation.isPending ? "Submitting..." : "Submit"}
              </Button>

              {submitMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {submitMutation.error?.response?.data?.message ||
                      submitMutation.error?.message ||
                      "Submission failed"}
                  </AlertDescription>
                </Alert>
              )}

              {submitMutation.isSuccess && (
                <Alert>
                  <AlertDescription>Submitted successfully!</AlertDescription>
                </Alert>
              )}
            </form>
          )}
        </CardContent>
      </Card>

      {/* All Assignments List with Submission Status */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>
            {assignments?.length || 0} assignment
            {assignments?.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!assignments?.length ? (
            <p className="text-center text-muted-foreground py-8">
              No assignments yet.
            </p>
          ) : (
            <div className="space-y-4">
              {assignments.map((a) => {
                const submission = submissionMap[a.id];
                const hasSubmission = !!submission;
                const isGraded =
                  hasSubmission && submission.grade_percent !== null;

                return (
                  <div
                    key={a.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-medium">{a.title}</h3>
                        <Badge variant={a.is_open ? "default" : "secondary"}>
                          {a.is_open ? "OPEN" : "CLOSED"}
                        </Badge>
                        {hasSubmission && (
                          <Badge variant={isGraded ? "success" : "outline"}>
                            {isGraded ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Graded: {submission.grade_percent}%
                              </>
                            ) : (
                              <>
                                <Clock className="h-3 w-3 mr-1" />
                                Submitted
                              </>
                            )}
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        Weight: {a.weight_percent}% · Due:{" "}
                        {formatDateTime(a.due_at)}
                      </p>

                      {a.description && (
                        <p className="text-sm text-muted-foreground">
                          {a.description}
                        </p>
                      )}

                      {hasSubmission && (
                        <div className="text-sm space-y-1 pt-2 border-t">
                          <p className="text-muted-foreground">
                            <strong>Submitted:</strong>{" "}
                            {formatDateTime(submission.submitted_at)}
                          </p>
                          <p className="text-muted-foreground break-all">
                            <strong>URL:</strong>{" "}
                            <a
                              href={submission.submission_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {submission.submission_url}
                            </a>
                          </p>
                          {isGraded && (
                            <p className="text-muted-foreground">
                              <strong>Graded:</strong>{" "}
                              {formatDateTime(submission.graded_at)}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {a.is_open && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAssignment(a);
                          setSubmissionUrl(submission?.submission_url || "");
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        {hasSubmission ? "Resubmit" : "Submit"}
                      </Button>
                    )}
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
