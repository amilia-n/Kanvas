import { useState, useMemo } from "react";
import { useSearchUsers } from "../users/useMe";
import useDebounce from "@/hooks/useDebounce";
import { useMyOfferings } from "../offerings/useOfferings";
import {
  useWaitlist,
  useEnrolled,
  useApproveEnrollment,
  useDenyEnrollment,
  useDropEnrollment,
  useCompleteEnrollment,
  useUpdateOffering,
} from "./useEnrollments";
import { formatDateTime } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import {
  CheckCircle2,
  XCircle,
  Lock,
  Unlock,
  Search,
  Users,
  UserMinus,
  GraduationCap,
} from "lucide-react";

export default function EnrollmentManagement() {
  const { data: offerings, isLoading: offeringsLoading } = useMyOfferings();
  const [selectedOfferingId, setSelectedOfferingId] = useState(null);

  const { data: waitlist, isLoading: waitlistLoading } = useWaitlist(
    selectedOfferingId,
    {
      enabled: !!selectedOfferingId,
    }
  );

  const { data: enrolled, isLoading: enrolledLoading } = useEnrolled(
    selectedOfferingId,
    {
      enabled: !!selectedOfferingId,
    }
  );

  const [showStudentSearch, setShowStudentSearch] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(studentSearchQuery, 300);

  const approveMutation = useApproveEnrollment({
    onSuccess: () => {
      setStudentSearchQuery("");
      alert("Student enrolled successfully!");
    },
  });

  const denyMutation = useDenyEnrollment();
  const dropMutation = useDropEnrollment();
  const completeMutation = useCompleteEnrollment();
  const updateOfferingMutation = useUpdateOffering();

  const activeOfferings = useMemo(() => {
    if (!offerings) return [];
    return offerings;
  }, [offerings]);

  const selectedOffering = activeOfferings.find(
    (o) => Number(o.id) === Number(selectedOfferingId)
  );

  const handleApprove = async (studentId) => {
    if (!selectedOfferingId) return;
    try {
      await approveMutation.mutateAsync({
        offeringId: selectedOfferingId,
        studentId,
      });
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Approval failed";
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleDeny = async (studentId) => {
    if (!window.confirm("Deny this enrollment request?")) return;
    try {
      await denyMutation.mutateAsync({
        offeringId: selectedOfferingId,
        studentId,
      });
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Deny failed";
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleDrop = async (studentId) => {
    if (!window.confirm("Drop this student from the course?")) return;
    try {
      await dropMutation.mutateAsync({
        offeringId: selectedOfferingId,
        studentId,
      });
      alert("✓ Student dropped successfully!");
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Drop failed";
      alert(`✗ Error: ${errorMsg}`);
    }
  };

  const handleComplete = async (studentId) => {
    if (!window.confirm("Mark this student as completed?")) return;
    try {
      await completeMutation.mutateAsync({
        offeringId: selectedOfferingId,
        studentId,
      });
      alert("✓ Student marked as completed successfully!"); 
    } catch (err) {
      const errorMsg = err?.response?.data?.message || "Complete failed";
      alert(`✗ Error: ${errorMsg}`);
    }
  };

  const handleToggleEnrollment = async () => {
    if (!selectedOffering) return;

    const newStatus = !selectedOffering.enrollment_open;
    const action = newStatus ? "opened" : "closed";

    try {
      await updateOfferingMutation.mutateAsync({
        id: selectedOfferingId,
        data: { enrollment_open: newStatus },
      });
      alert(`✓ Enrollment ${action} successfully!`);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        `Failed to ${newStatus ? "open" : "close"} enrollment`;
      alert(`✗ Error: ${errorMsg}`);
    }
  };

  const handleManualEnroll = async (studentId) => {
    if (!selectedOfferingId) return;
    if (!window.confirm("Enroll this student?")) return;

    try {
      await approveMutation.mutateAsync({
        offeringId: selectedOfferingId,
        studentId,
      });
      alert("✓ Student enrolled successfully!");
    } catch (err) {
      const statusCode = err?.response?.status;
      const backendMsg = err?.response?.data?.message;

      let userMessage = "Enrollment failed: ";
      if (statusCode === 409) {
        userMessage += "No seats available or student already enrolled.";
      } else if (statusCode === 403) {
        userMessage += "You don't have permission.";
      } else if (statusCode === 500) {
        userMessage += backendMsg || "Server error. Please check the logs.";
      } else {
        userMessage += backendMsg || "Unknown error.";
      }

      alert(`✗ ${userMessage}`);
    }
  };

  if (offeringsLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner className="size-6" />
      </div>
    );
  }

  if (!activeOfferings.length) {
    return (
      <Alert>
        <AlertDescription>
          No offerings found. Create an offering first to manage enrollments.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Enrollment Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage student enrollments for your courses
        </p>
      </div>

      <div className="space-y-6">
        {/* Offering Selection */}
        <div className="space-y-2">
          <Label htmlFor="offering-select">Select Offering</Label>
          <Select
            value={selectedOfferingId ? String(selectedOfferingId) : ""}
            onValueChange={(value) => setSelectedOfferingId(Number(value))}
          >
            <SelectTrigger id="offering-select" className="w-fit">
              <SelectValue placeholder="Choose an offering..." />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={4}
              className="z-50 bg-popover"
            >
              {activeOfferings.map((offering) => (
                <SelectItem key={offering.id} value={String(offering.id)}>
                  {offering.offering_code}
                  {offering.offering_name
                    ? ` - ${offering.offering_name}`
                    : ""}{" "}
                  · Section {offering.section} ({offering.term_code})
                  {offering.enrollment_open ? " ✓" : " ✗"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Offering Controls */}
        {selectedOffering && (
          <div className="flex items-center justify-between p-5 py-10 bg-muted rounded-lg border-2 border-gray-200">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {selectedOffering.offering_code} - Section{" "}
                {selectedOffering.section} · {selectedOffering.term_code}
              </p>
              <p className="text-xs text-muted-foreground">
                {selectedOffering.seats_left || 0} seats remaining
              </p>
            </div>
            <Button
              variant={selectedOffering.enrollment_open ? "outline" : "default"}
              size="sm"
              onClick={handleToggleEnrollment}
              disabled={updateOfferingMutation.isPending}
            >
              {selectedOffering.enrollment_open ? (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Close Enrollment
                </>
              ) : (
                <>
                  <Unlock className="h-4 w-4 mr-2" />
                  Open Enrollment
                </>
              )}
            </Button>
          </div>
        )}

        {/* Student Search & Manual Enrollment */}
        {selectedOffering && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Student Directory</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStudentSearch(!showStudentSearch)}
              >
                <Search className="h-4 w-4 mr-2" />
                {showStudentSearch ? "Hide" : "Search Students"}
              </Button>
            </div>

            {showStudentSearch && (
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <Label htmlFor="student-search">Search Students</Label>
                  <Input
                    id="student-search"
                    placeholder="Search by name or email..."
                    value={studentSearchQuery}
                    onChange={(e) => setStudentSearchQuery(e.target.value)}
                  />
                </div>

                {debouncedSearchQuery.length > 2 && (
                  <StudentSearchResults
                    query={debouncedSearchQuery}
                    onEnroll={handleManualEnroll}
                    enrolling={approveMutation.isPending}
                    seatsLeft={selectedOffering?.seats_left || 0}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Enrolled Students */}
        {selectedOfferingId && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Enrolled Students</h3>
              <Badge variant="secondary">{enrolled?.length || 0}</Badge>
            </div>

            {enrolledLoading ? (
              <div className="flex justify-center py-8">
                <Spinner className="size-6" />
              </div>
            ) : !enrolled?.length ? (
              <Alert>
                <AlertDescription>No enrolled students yet.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {enrolled.map((student) => (
                  <div
                    key={student.student_id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.email}
                      </p>
                      <div className="flex gap-2 items-center">
                        <Badge
                          variant={
                            student.status === "completed"
                              ? "default"
                              : "outline"
                          }
                        >
                          {student.status}
                        </Badge>
                        {student.enrolled_at && (
                          <span className="text-xs text-muted-foreground">
                            Enrolled: {formatDateTime(student.enrolled_at)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {student.status === "enrolled" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleComplete(student.student_id)}
                            disabled={completeMutation.isPending}
                          >
                            <GraduationCap className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                          <Button
                            className= "bg-red-600/40"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDrop(student.student_id)}
                            disabled={dropMutation.isPending}
                          >
                            <UserMinus className="h-4 w-4 mr-1" />
                            Drop
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Waitlist */}
        {selectedOfferingId && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">
                Enrollment Requests (Waitlist)
              </h3>
              <Badge variant="secondary">{waitlist?.length || 0}</Badge>
            </div>

            {waitlistLoading ? (
              <div className="flex justify-center py-8">
                <Spinner className="size-6" />
              </div>
            ) : !waitlist?.length ? (
              <Alert>
                <AlertDescription>
                  No pending enrollment requests.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {waitlist.map((student) => (
                  <div
                    key={student.student_id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">
                        {student.first_name} {student.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {student.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Requested: {formatDateTime(student.waitlisted_at)}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(student.student_id)}
                        disabled={
                          approveMutation.isPending ||
                          denyMutation.isPending ||
                          (selectedOffering?.seats_left || 0) <= 0
                        }
                        title={
                          (selectedOffering?.seats_left || 0) <= 0
                            ? "No seats available"
                            : "Approve enrollment"
                        }
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeny(student.student_id)}
                        disabled={
                          approveMutation.isPending || denyMutation.isPending
                        }
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Deny
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StudentSearchResults({ query, onEnroll, enrolling, seatsLeft }) {
  const { data: users, isLoading } = useSearchUsers(query, {
    enabled: query.length > 2,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Spinner className="size-5" />
      </div>
    );
  }

  const students = users?.filter((u) => u.role === "student") || [];

  if (students.length === 0) {
    return (
      <Alert>
        <AlertDescription>No students found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto">
      {students.map((student) => (
        <div
          key={student.id}
          className="flex items-center justify-between p-3 border rounded-lg bg-background"
        >
          <div>
            <p className="font-medium">
              {student.first_name} {student.last_name}
            </p>
            <p className="text-sm text-muted-foreground">{student.email}</p>
            {student.student_number && (
              <p className="text-xs text-muted-foreground">
                ID: {student.student_number}
              </p>
            )}
          </div>
          <Button
            size="sm"
            onClick={() => onEnroll(student.id)}
            disabled={enrolling || seatsLeft <= 0}
            title={seatsLeft <= 0 ? "No seats available" : "Enroll student"}
          >
            <Users className="h-4 w-4 mr-1" />
            Enroll
          </Button>
        </div>
      ))}
    </div>
  );
}
