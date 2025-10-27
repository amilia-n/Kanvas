import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  useOffering,
  useAddOfferingPrereq,
  useRemoveOfferingPrereq,
  useFilterOfferings,
  useUpdateOffering,
} from "./useOfferings";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useMe } from "../users/useMe";
import {
  useRequestWaitlist,
  useCancelWaitlist,
} from "../enrollments/useEnrollments";
import { ROLES } from "@/constants/roles";
import { canManageCourse } from "@/utils/guards";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  User,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Plus,
} from "lucide-react";

export default function OfferingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const offeringId = Number(id);

  const { data: offering, isLoading, isError, error } = useOffering(offeringId);
  const { data: me } = useMe();
  const { data: availableOfferings, isLoading: offeringsLoading } =
    useFilterOfferings({});
  const isTeacher = canManageCourse(me);
  const [showAddPrereqDialog, setShowAddPrereqDialog] = useState(false);
  const [selectedPrereqId, setSelectedPrereqId] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  const [editCode, setEditCode] = useState("");
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editSection, setEditSection] = useState("");
  const [editCredits, setEditCredits] = useState("");
  const [editTotalSeats, setEditTotalSeats] = useState("");
  const [editEnrollmentOpen, setEditEnrollmentOpen] = useState(true);

  const updateOfferingMutation = useUpdateOffering({
    onSuccess: () => {
      setIsEditMode(false);
      alert("✓ Offering updated successfully!");
    },
  });

  const isOfferingTeacher = me?.id === offering?.teacher_id;
  const isAdmin = me?.role === ROLES.ADMIN;
  const canEdit = isOfferingTeacher || isAdmin;
  const canManagePrereqs = isOfferingTeacher || isAdmin;

  const requestWaitlistMutation = useRequestWaitlist();
  const cancelWaitlistMutation = useCancelWaitlist();
  const addPrereqMutation = useAddOfferingPrereq(offeringId);
  const removePrereqMutation = useRemoveOfferingPrereq(offeringId);

  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState(null);

  const isStudent = me?.role === ROLES.STUDENT;

  const checkEligibility = () => {
    if (!offering || !isStudent) return { eligible: false, reasons: [] };

    const reasons = [];
    if (!offering.is_next_term) {
      reasons.push("This offering is not for the upcoming term");
    }
    if (!offering.enrollment_open) {
      reasons.push("Enrollment is currently closed for this section");
    }
    if (offering.my_enrollment_status) {
      reasons.push(
        `You are already ${offering.my_enrollment_status} in this course`
      );
    }
    if (offering.prerequisites_met === false) {
      reasons.push("You have not completed the required prerequisites");
    }
    if (offering.already_passed) {
      reasons.push("You have already completed this course");
    }
    const noSeats = (offering.seats_left || 0) <= 0;

    return {
      eligible: reasons.length === 0,
      reasons,
      noSeats,
    };
  };

  const eligibility = checkEligibility();

  const handleEnrollRequest = async () => {
    if (!eligibility.eligible) {
      setEnrollmentError(eligibility.reasons.join(". "));
      return;
    }

    try {
      await requestWaitlistMutation.mutateAsync(offeringId);
      setShowEnrollDialog(false);
      setEnrollmentError(null);
    } catch (err) {
      setEnrollmentError(
        err?.response?.data?.message || "Failed to request enrollment"
      );
    }
  };

  const handleCancelRequest = async () => {
    try {
      await cancelWaitlistMutation.mutateAsync(offeringId);
      setShowCancelDialog(false);
    } catch (err) {
      console.error("Cancel failed:", err);
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
          {error?.response?.data?.message || "Failed to load offering"}
        </AlertDescription>
      </Alert>
    );
  }

  if (!offering) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Offering not found</AlertDescription>
      </Alert>
    );
  }

  const isEnrolled = offering.my_enrollment_status === "enrolled";
  const isWaitlisted = offering.my_enrollment_status === "waitlisted";

  // Handler to remove prerequisite
  const handleRemovePrereq = async (prereqId) => {
    if (!window.confirm("Remove this prerequisite?")) return;

    try {
      await removePrereqMutation.mutateAsync(prereqId);
      alert("✓ Prerequisite removed successfully!");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Failed to remove prerequisite";
      alert(`✗ Error: ${errorMsg}`);
    }
  };
  const handleStartEdit = () => {
    setEditCode(offering.offering_code || "");
    setEditName(offering.offering_name || "");
    setEditDescription(offering.description || "");
    setEditSection(offering.section || "");
    setEditCredits(String(offering.credits || ""));
    setEditTotalSeats(String(offering.total_seats || ""));
    setEditEnrollmentOpen(offering.enrollment_open || false);
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleSaveEdit = async () => {
    if (!editCode.trim() || !editName.trim() || !editSection.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    const creditsNum = Number(editCredits);
    const seatsNum = Number(editTotalSeats);

    if (!Number.isFinite(creditsNum) || creditsNum <= 0) {
      alert("Credits must be a positive number");
      return;
    }

    if (!Number.isFinite(seatsNum) || seatsNum <= 0) {
      alert("Total seats must be a positive number");
      return;
    }

    try {
      await updateOfferingMutation.mutateAsync({
        id: offeringId,
        data: {
          code: editCode.trim(),
          name: editName.trim(),
          description: editDescription.trim() || null,
          section: editSection.trim(),
          credits: creditsNum,
          total_seats: seatsNum,
          enrollment_open: editEnrollmentOpen,
        },
      });
    } catch (err) {
      alert(
        `✗ Error: ${
          err?.response?.data?.message || "Failed to update offering"
        }`
      );
    }
  };

  const handleAddPrereq = async () => {
    if (!selectedPrereqId) return;

    try {
      await addPrereqMutation.mutateAsync(Number(selectedPrereqId));
      alert("✓ Prerequisite added successfully!");
      setShowAddPrereqDialog(false);
      setSelectedPrereqId("");
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Failed to add prerequisite";
      alert(`✗ Error: ${errorMsg}`);
    }
  };

  return (
    <div className="space-y-8 ">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-semibold">
                {offering.offering_code} - Section {offering.section}
              </h1>
              <Badge
                variant={offering.enrollment_open ? "default" : "secondary"}
              >
                {offering.enrollment_open ? "Open" : "Closed"}
              </Badge>
            </div>
            <h2 className="text-lg text-muted-foreground">
              {offering.offering_name}
            </h2>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Edit Button for Teacher/Admin */}
          {canEdit && !isEditMode && (
            <Button variant="outline" onClick={handleStartEdit}>
              Edit Details
            </Button>
          )}

          {/* Student Enrollment Actions */}
          {isStudent && offering.is_next_term && (
            <>
              {!isEnrolled && !isWaitlisted ? (
                <Button
                  onClick={() => setShowEnrollDialog(true)}
                  disabled={!offering.enrollment_open}
                >
                  Request Enrollment
                </Button>
              ) : isWaitlisted ? (
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(true)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Cancel Request
                </Button>
              ) : (
                <Badge variant="default" className="px-4 py-2">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Enrolled
                </Badge>
              )}
            </>
          )}
        </div>
      </div>

      {/* Offering Details */}
      <div className="flex gap-5 justify-center">
        {/* Basic Info */}
        <Card className="flex-none min-w-70 max-w-70 min-h-75 max-h-75">
          <CardHeader className="shrink-0">
            <CardTitle>Offering Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Term</p>
                <p className="text-sm text-muted-foreground">
                  {offering.term_code}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Instructor</p>
                <p className="text-sm text-muted-foreground">
                  {offering.teacher_name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Available Seats</p>
                <p className="text-sm text-muted-foreground">
                  {offering.seats_left || 0} of {offering.total_seats} remaining
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Credits</p>
                <p className="text-sm text-muted-foreground">
                  {offering.credits}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description Card */}
        {offering.description && (
          <Card className="flex-2 min-w-120 max-w-150 min-h-75 max-h-75 overflow-hidden">
            <CardHeader className="shrink-0 px-8 ">
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-y-auto px-10">
              <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words leading-relaxed">
                {offering.description}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Prerequisites */}
      <div className="flex gap-5 justify-start">
        <Card className="min-w-70 max-w-70">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Prerequisites</CardTitle>
              {canManagePrereqs && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowAddPrereqDialog(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {!offering.prerequisites?.length ? (
              <p className="text-sm text-muted-foreground">
                No prerequisites required
              </p>
            ) : (
              <div className="space-y-2">
                {offering.prerequisites.map((prereq) => (
                  <div
                    key={prereq.id}
                    className="flex items-center justify-between p-2 border rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{prereq.code}</Badge>
                      <span className="text-sm">{prereq.name}</span>
                    </div>
                    {canManagePrereqs && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemovePrereq(prereq.id)}
                        disabled={removePrereqMutation.isPending}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Offering Dialog */}
      {canEdit && (
        <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Offering Details</DialogTitle>
              <DialogDescription>
                Update the offering information
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Offering Code */}
              <div className="space-y-2">
                <Label htmlFor="edit-code">
                  Offering Code<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-code"
                  value={editCode}
                  onChange={(e) => setEditCode(e.target.value)}
                  placeholder="e.g. CEE101"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-name">
                  Offering Name<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Engineering Computation"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description (Optional)</Label>
                <Textarea
                  id="edit-description"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Enter offering description..."
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Section */}
                <div className="space-y-2">
                  <Label htmlFor="edit-section">
                    Section<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-section"
                    value={editSection}
                    onChange={(e) => setEditSection(e.target.value)}
                    placeholder="e.g. A"
                    required
                  />
                </div>

                {/* Credits */}
                <div className="space-y-2">
                  <Label htmlFor="edit-credits">
                    Credits<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="edit-credits"
                    type="number"
                    min="1"
                    max="5"
                    step="0.5"
                    value={editCredits}
                    onChange={(e) => setEditCredits(e.target.value)}
                    placeholder="e.g. 3"
                    required
                  />
                </div>
              </div>

              {/* Total Seats */}
              <div className="space-y-2">
                <Label htmlFor="edit-seats">
                  Total Seats<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-seats"
                  type="number"
                  min="1"
                  max="500"
                  value={editTotalSeats}
                  onChange={(e) => setEditTotalSeats(e.target.value)}
                  placeholder="e.g. 30"
                  required
                />
              </div>

              {/* Enrollment Open Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-enrollment-open"
                  checked={editEnrollmentOpen}
                  onChange={(e) => setEditEnrollmentOpen(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor="edit-enrollment-open"
                  className="cursor-pointer"
                >
                  Open for enrollment
                </Label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={updateOfferingMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={updateOfferingMutation.isPending}
              >
                {updateOfferingMutation.isPending
                  ? "Saving..."
                  : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {/* Enrollment Dialog */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request Enrollment</DialogTitle>
            <DialogDescription>
              You will be added to the waitlist for approval
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Eligibility Check */}
            {eligibility.eligible ? (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  You meet all requirements to join the waitlist.
                  {eligibility.noSeats &&
                    " Note: There are no available seats, but you can join the waitlist."}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Cannot enroll:</strong>
                  <ul className="mt-2 space-y-1 text-sm">
                    {eligibility.reasons.map((reason, idx) => (
                      <li key={idx}>• {reason}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {enrollmentError && (
              <Alert variant="destructive">
                <AlertDescription>{enrollmentError}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEnrollDialog(false);
                setEnrollmentError(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnrollRequest}
              disabled={
                !eligibility.eligible || requestWaitlistMutation.isPending
              }
            >
              {requestWaitlistMutation.isPending
                ? "Requesting..."
                : "Request Enrollment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Enrollment Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel your enrollment request?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Request
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelRequest}
              disabled={cancelWaitlistMutation.isPending}
            >
              {cancelWaitlistMutation.isPending
                ? "Cancelling..."
                : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Add Prerequisite Dialog */}
      {isTeacher && (
        <Dialog
          open={showAddPrereqDialog}
          onOpenChange={setShowAddPrereqDialog}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Prerequisite</DialogTitle>
              <DialogDescription>
                Select a course offering as a prerequisite for this offering
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="prereq-offering">Prerequisite Offering</Label>
                <Select
                  value={selectedPrereqId}
                  onValueChange={setSelectedPrereqId}
                >
                  <SelectTrigger id="prereq-offering">
                    <SelectValue placeholder="Select an offering..." />
                  </SelectTrigger>
                  <SelectContent>
                    {offeringsLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : !availableOfferings?.length ? (
                      <SelectItem value="none" disabled>
                        No offerings
                      </SelectItem>
                    ) : (
                      availableOfferings.map((off) => (
                        <SelectItem key={off.id} value={String(off.id)}>
                          {off.offering_code} - {off.offering_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddPrereqDialog(false);
                  setSelectedPrereqId("");
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPrereq}
                disabled={!selectedPrereqId || addPrereqMutation.isPending}
              >
                {addPrereqMutation.isPending ? "Adding..." : "Add Prerequisite"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
