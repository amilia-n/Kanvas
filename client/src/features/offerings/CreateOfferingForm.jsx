import { useState, useMemo } from "react";
import { useCurrentTerm, useNextTerm } from "../users/useMe";
import { useCreateOffering } from "./useOfferings";
import { useCourses } from "../courses/useCourses";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
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

export default function CreateOfferingForm({ open, onOpenChange }) {
  const { data: courses, isLoading: coursesLoading } = useCourses();
  const { data: currentTerm } = useCurrentTerm();
  const { data: nextTerm } = useNextTerm();

  const availableTerms = useMemo(() => {
    const terms = [];
    if (currentTerm) terms.push(currentTerm);
    if (nextTerm) terms.push(nextTerm);
    return terms;
  }, [currentTerm, nextTerm]);
  const [courseId, setCourseId] = useState("");
  const [termCode, setTermCode] = useState("");
  const [section, setSection] = useState("A");
  const [credits, setCredits] = useState("");
  const [totalSeats, setTotalSeats] = useState("");
  const [enrollmentOpen, setEnrollmentOpen] = useState(true);
  const [offeringCode, setOfferingCode] = useState("");
  const [offeringName, setOfferingName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const creditsNum = Number(credits);
    const seatsNum = Number(totalSeats);
    if (
      !courseId ||
      !termCode ||
      !section ||
      !offeringCode.trim() ||
      !offeringName.trim() ||
      !Number.isFinite(creditsNum) ||
      creditsNum <= 0 ||
      !Number.isFinite(seatsNum) ||
      seatsNum <= 0
    ) {
      return;
    }

    const selectedCourse = courses?.find((c) => c.id === Number(courseId));
    if (!selectedCourse) return;

    createMutation.mutate({
      course_code: selectedCourse.code,
      term_code: termCode.trim(),
      code: offeringCode.trim(),
      name: offeringName.trim(),
      description: description.trim() || null,
      section: section.trim(),
      credits: creditsNum,
      total_seats: seatsNum,
      enrollment_open: enrollmentOpen,
      is_active: true,
    });
  };

  const createMutation = useCreateOffering({
    onSuccess: () => {
      setCourseId("");
      setTermCode("");
      setSection("A");
      setCredits("");
      setTotalSeats("");
      setOfferingCode("");
      setOfferingName("");
      setDescription("");
      setEnrollmentOpen(true);
      onOpenChange(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] ">
        <DialogHeader>
          <DialogTitle>Create Course Offering</DialogTitle>
          <DialogDescription>
            Create a new offering. Fill in all required fields.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Course Selection */}
          <div className="flex items-end gap-4">
            {/* Course */}
            <div className="w-1/2">
              <Label
                htmlFor="course"
                className="block text-sm font-medium leading-none mb-2"
              >
                Course<span className="text-destructive">*</span>
              </Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger id="course" className="w-full">
                  <SelectValue placeholder="Select a course..." />
                </SelectTrigger>
                <SelectContent position="popper">
                  {coursesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading courses...
                    </SelectItem>
                  ) : courses?.length ? (
                    courses.map((course) => (
                      <SelectItem key={course.id} value={String(course.id)}>
                        {course.code} - {course.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No courses available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Offering Code */}
            <div className="w-1/2">
              <Label
                htmlFor="offering-code"
                className="block text-sm font-medium leading-none mb-2"
              >
                Offering Code<span className="text-destructive">*</span>
              </Label>
              <Input
                id="offering-code"
                className="w-full"
                value={offeringCode}
                onChange={(e) => setOfferingCode(e.target.value)}
                placeholder="e.g. CEE101"
                required
              />
            </div>
          </div>

          {/* Offering Name */}
          <div className="space-y-2">
            <Label htmlFor="offering-name">
              Offering Name<span className="text-destructive">*</span>
            </Label>
            <Input
              id="offering-name"
              value={offeringName}
              onChange={(e) => setOfferingName(e.target.value)}
              placeholder="e.g. Engineering Computation"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter offering description..."
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Term Code */}
            <div className="space-y-2 l">
              <Label htmlFor="term">
                Term Code<span className="text-destructive">*</span>
              </Label>
              <Select value={termCode} onValueChange={setTermCode}>
                <SelectTrigger id="term" className="w-full">
                  <SelectValue placeholder="Select term..." />
                </SelectTrigger>
                <SelectContent>
                  {availableTerms.map((term) => (
                    <SelectItem key={term.id} value={term.code}>
                      {term.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Section */}
            <div className="space-y-2">
              <Label htmlFor="section">
                Section<span className="text-destructive">*</span>
              </Label>
              <Input
                id="section"
                className="w-full"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                placeholder="e.g. A"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Credits */}
            <div className="space-y-2">
              <Label htmlFor="credits">
                Credits<span className="text-destructive">*</span>
              </Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="5"
                step="0.5"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                placeholder="e.g. 3"
                required
              />
            </div>
            {/* Total Seats */}
            <div className="space-y-2">
              <Label htmlFor="seats">
                Total Seats<span className="text-destructive">*</span>
              </Label>
              <Input
                id="seats"
                className="w-full"
                type="number"
                min="1"
                max="500"
                value={totalSeats}
                onChange={(e) => setTotalSeats(e.target.value)}
                placeholder="e.g. 30"
                required
              />
            </div>
          </div>

          {/* Enrollment Open Checkbox */}
          <div className="flex items-center space-x-2 m-2 py-3">
            <input
              type="checkbox"
              id="enrollment-open"
              checked={enrollmentOpen}
              onChange={(e) => setEnrollmentOpen(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="enrollment-open" className="cursor-pointer">
              Open for enrollment
            </Label>
          </div>

          {createMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                {createMutation.error?.response?.data?.message ||
                  createMutation.error?.message ||
                  "Failed to create offering"}
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "Creating..." : "Create Offering"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
