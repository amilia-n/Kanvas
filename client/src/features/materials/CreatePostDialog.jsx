import { useState } from "react";
import { useAddMaterial } from "../materials/useMaterials";
import { useCreateAssignment } from "../assignments/useAssignments";
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
import { FileText, ClipboardList } from "lucide-react";

export default function CreatePostDialog({ open, onOpenChange, offeringId }) {
  const [postType, setPostType] = useState("material");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  const [weight, setWeight] = useState("");
  const [dueDate, setDueDate] = useState("");

  const addMaterialMutation = useAddMaterial(offeringId);
  const createAssignmentMutation = useCreateAssignment(offeringId);

  const resetForm = () => {
    setPostType("material");
    setTitle("");
    setDescription("");
    setUrl("");
    setWeight("");
    setDueDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (postType === "material") {
        await addMaterialMutation.mutateAsync({
          title: title.trim(),
          url: (url || description).trim(),
        });
      } else {
        await createAssignmentMutation.mutateAsync({
          title: title.trim(),
          description: description.trim(),
          weight_percent: Number(weight),
          due_at: dueDate ? new Date(dueDate).toISOString() : null,
        });
      }
      resetForm();
      onOpenChange(false);
    } catch (err) {
      console.error("Create post failed:", err);
    }
  };

  const isPending =
    addMaterialMutation.isPending || createAssignmentMutation.isPending;
  const error = addMaterialMutation.error || createAssignmentMutation.error;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share course materials or create an assignment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Type Selection */}
          <div className="space-y-2">
            <Label>Post Type*</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={postType === "material" ? "default" : "outline"}
                className="flex items-center gap-2 justify-center"
                onClick={() => setPostType("material")}
              >
                <FileText className="h-4 w-4" />
                Material
              </Button>
              <Button
                type="button"
                variant={postType === "assignment" ? "default" : "outline"}
                className="flex items-center gap-2 justify-center"
                onClick={() => setPostType("assignment")}
              >
                <ClipboardList className="h-4 w-4" />
                Assignment
              </Button>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Title<span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                postType === "material"
                  ? "e.g., Week 3 Lecture Notes"
                  : "e.g., Homework 1"
              }
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description
              {postType === "assignment" && (
                <span className="text-destructive">*</span>
              )}
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                postType === "material"
                  ? "Add notes or context (optional)"
                  : "Describe the assignment requirements"
              }
              rows={4}
              required={postType === "assignment"}
            />
          </div>

          {/* Material-specific: URL */}
          {postType === "material" && (
            <div className="space-y-2">
              <Label htmlFor="url">Resource URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/resource.pdf"
              />
              <p className="text-xs text-muted-foreground">
                Optional. If blank, we’ll save your description into the URL
                field for quick notes/links.
              </p>
            </div>
          )}

          {/* Assignment-specific fields */}
          {postType === "assignment" && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight (%)<span className="text-destructive">*</span>
                </Label>
                <Input
                  id="weight"
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 15"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input
                  id="due-date"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                {error?.response?.data?.message || "Failed to create post"}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? "Creating..."
                : `Create ${
                    postType === "material" ? "Material" : "Assignment"
                  }`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
