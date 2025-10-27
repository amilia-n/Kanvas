import { useState } from "react";
import { useOfferingsWithSeats } from "../offerings/useOfferings";
import { useRequestWaitlist, useCancelWaitlist } from "./useEnrollments";
import { Button } from "@/components/ui/Button";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "@/components/ui/Label";
import { Badge } from "@/components/ui/Badge";
import { UserPlus, UserMinus, Clock } from "lucide-react";

export default function EnrollButton({ courseId }) {
  const { data: offerings } = useOfferingsWithSeats({ courseId });
  const requestMutation = useRequestWaitlist();
  const cancelMutation = useCancelWaitlist();

  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedOffering, setSelectedOffering] = useState(null);

  const availableOfferings =
    offerings?.filter(
      (o) => o.course_id === courseId && o.is_active && o.enrollment_open
    ) ?? [];

  const myEnrollment = offerings?.find(
    (o) => o.course_id === courseId && o.my_enrollment_status
  );

  const handleEnroll = async () => {
    if (!selectedOffering) return;

    try {
      await requestMutation.mutateAsync(selectedOffering.id);
      setShowEnrollDialog(false);
      setSelectedOffering(null);
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  const handleCancel = async () => {
    if (!myEnrollment) return;

    try {
      await cancelMutation.mutateAsync(myEnrollment.offering_id);
      setShowCancelDialog(false);
    } catch (err) {
      console.error("Cancellation failed:", err);
    }
  };

  if (myEnrollment) {
    const status = myEnrollment.my_enrollment_status;
    const isWaitlisted = status === "waitlisted";
    const isEnrolled = status === "enrolled";

    return (
      <>
        <Button
          variant="outline"
          onClick={() => setShowCancelDialog(true)}
          disabled={!isWaitlisted && !isEnrolled}
        >
          {isWaitlisted ? (
            <>
              <Clock className="h-4 w-4 mr-2" />
              Cancel Waitlist
            </>
          ) : (
            <>
              <UserMinus className="h-4 w-4 mr-2" />
              Drop Course
            </>
          )}
        </Button>

        {/* Cancel Confirmation Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Cancellation</DialogTitle>
              <DialogDescription>
                Are you sure you want to{" "}
                {isWaitlisted
                  ? "cancel your waitlist request"
                  : "drop this course"}
                ? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCancelDialog(false)}
                disabled={cancelMutation.isPending}
              >
                No, Keep It
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancel}
                disabled={cancelMutation.isPending}
              >
                {cancelMutation.isPending ? "Cancelling..." : "Yes, Cancel"}
              </Button>
            </DialogFooter>
            {cancelMutation.isError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {cancelMutation.error?.response?.data?.message ||
                    "Failed to cancel"}
                </AlertDescription>
              </Alert>
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Button onClick={() => setShowEnrollDialog(true)}>
        <UserPlus className="h-4 w-4 mr-2" />
        Request Enrollment
      </Button>

      {/* Enroll Dialog */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Request Course Enrollment</DialogTitle>
            <DialogDescription>
              Select an offering (section/term) to join the waitlist
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {availableOfferings.length === 0 ? (
              <Alert>
                <AlertDescription>
                  No offerings available for enrollment at this time.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="offering">Select Offering*</Label>
                <Select
                  value={
                    selectedOffering?.id ? String(selectedOffering.id) : ""
                  }
                  onValueChange={(value) => {
                    const offering = availableOfferings.find(
                      (o) => o.id === Number(value)
                    );
                    setSelectedOffering(offering);
                  }}
                >
                  <SelectTrigger id="offering">
                    <SelectValue placeholder="Choose a section..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOfferings.map((offering) => (
                      <SelectItem key={offering.id} value={String(offering.id)}>
                        <div className="flex items-center gap-2">
                          <span>Section {offering.section}</span>
                          <Badge variant="outline" className="text-xs">
                            {offering.term_code}
                          </Badge>
                          <span className="text-muted-foreground text-xs">
                            ({offering.seats_left || 0} seats left)
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowEnrollDialog(false);
                setSelectedOffering(null);
              }}
              disabled={requestMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEnroll}
              disabled={!selectedOffering || requestMutation.isPending}
            >
              {requestMutation.isPending
                ? "Requesting..."
                : "Request Enrollment"}
            </Button>
          </DialogFooter>

          {requestMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {requestMutation.error?.response?.data?.message ||
                  "Failed to request enrollment"}
              </AlertDescription>
            </Alert>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
