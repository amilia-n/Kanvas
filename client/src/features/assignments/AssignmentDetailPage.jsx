import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  useAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
} from "./useAssignments";
import { useMe } from "../users/useMe";
import { canManageCourse } from "@/utils/guards";
import { formatDateTime } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import { ArrowLeft, Trash2 } from "lucide-react";

export default function AssignmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const assignmentId = Number(id);

  const { data: me } = useMe();
  const { data: assignment, isLoading } = useAssignment(assignmentId);
  const updateMutation = useUpdateAssignment(assignment?.offering_id);
  const deleteMutation = useDeleteAssignment(assignment?.offering_id, {
    onSuccess: () => navigate(-1),
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [weight, setWeight] = useState("");

  const canManage = canManageCourse(me);

  const handleUpdate = (e) => {
    e.preventDefault();
    const updates = {};
    if (title && title !== assignment?.title) updates.title = title.trim();
    if (description && description !== assignment?.description)
      updates.description = description.trim();
    if (weight && Number(weight) !== assignment?.weight_percent)
      updates.weight_percent = Number(weight);

    if (Object.keys(updates).length === 0) return;

    updateMutation.mutate({
      id: assignmentId,
      data: updates,
    });
  };

  const handleDelete = () => {
    if (!window.confirm("Delete this assignment? This cannot be undone."))
      return;
    deleteMutation.mutate(assignmentId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!assignment) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Assignment not found.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{assignment.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Weight: {assignment.weight_percent}% · Due:{" "}
              {formatDateTime(assignment.due_at)}
            </p>
          </div>
        </div>

        {canManage && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        )}
      </div>

      {/* Assignment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
          <CardDescription>
            Status:{" "}
            <span
              className={`font-medium ${
                assignment.is_open ? "text-green-600" : "text-gray-600"
              }`}
            >
              {assignment.is_open ? "Open" : "Closed"}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-1">Description</h3>
            <p className="text-sm text-muted-foreground">
              {assignment.description || "No description provided."}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium mb-1">Assigned On</h3>
            <p className="text-sm text-muted-foreground">
              {formatDateTime(assignment.assigned_on)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Update Form (Teachers Only) */}
      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle>Update Assignment</CardTitle>
            <CardDescription>Modify assignment details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={assignment.title}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (%)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={String(assignment.weight_percent)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={assignment.description || "Add description..."}
                  rows={3}
                />
              </div>

              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Updating..." : "Update"}
              </Button>

              {updateMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {updateMutation.error?.response?.data?.message ||
                      "Update failed"}
                  </AlertDescription>
                </Alert>
              )}

              {updateMutation.isSuccess && (
                <Alert>
                  <AlertDescription>Updated successfully!</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
