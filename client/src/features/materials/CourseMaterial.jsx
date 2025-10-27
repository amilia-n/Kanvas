import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useOffering } from "../offerings/useOfferings";
import { useMaterials, useRemoveMaterial } from "../materials/useMaterials";
import { useAssignments } from "../assignments/useAssignments";
import { useMe } from "../users/useMe";
import { ROLES } from "@/constants/roles";
import { formatDateTime } from "@/utils/format";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
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
import {
  FileText,
  Plus,
  Users,
  Pencil,
  Trash2,
  Search,
  SortAsc,
  Filter,
} from "lucide-react";
import CreatePostDialog from "./CreatePostDialog";
import OfferingRosterDialog from "./OfferingRosterDialog";

export default function CourseMaterialPage() {
  const { offeringId } = useParams();
  const offeringIdNum = Number(offeringId);

  const { data: me } = useMe();
  const { data: offering, isLoading: offeringLoading } =
    useOffering(offeringIdNum);
  const { data: materials, isLoading: materialsLoading } =
    useMaterials(offeringIdNum);
  const { data: assignments, isLoading: assignmentsLoading } =
    useAssignments(offeringIdNum);

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showRoster, setShowRoster] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date-desc"); 
  const [filterType, setFilterType] = useState("all"); 

  const isTeacher = me?.role === ROLES.TEACHER || me?.role === ROLES.ADMIN;

  const allItems = useMemo(() => {
    const items = [];

    if (filterType === "all" || filterType === "materials") {
      materials?.forEach((m) => items.push({ ...m, type: "material" }));
    }

    if (filterType === "all" || filterType === "assignments") {
      assignments?.forEach((a) => items.push({ ...a, type: "assignment" }));
    }

    const filtered = searchQuery
      ? items.filter(
          (item) =>
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : items;

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return (
            new Date(b.created_at || b.assigned_on) -
            new Date(a.created_at || a.assigned_on)
          );
        case "date-asc":
          return (
            new Date(a.created_at || a.assigned_on) -
            new Date(b.created_at || b.assigned_on)
          );
        case "title":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

    return sorted;
  }, [materials, assignments, searchQuery, sortBy, filterType]);

  if (offeringLoading || materialsLoading || assignmentsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {offering?.offering_code} - Section {offering?.section}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {offering?.offering_name} · {offering?.term_code}
          </p>
        </div>

        <div className="flex gap-2">
          {/* Roster Button */}
          <Button variant="outline" onClick={() => setShowRoster(true)}>
            <Users className="h-4 w-4 mr-2" />
            Course Roster
          </Button>

          {/* Create Post Button (Teachers) */}
          {isTeacher && (
            <Button onClick={() => setShowCreatePost(true)} className="border-2 border-gray-200">
              <Plus className="h-4 w-4 mr-2" />
              Create Post
            </Button>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Type Filter */}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Posts</SelectItem>
                <SelectItem value="materials">Materials Only</SelectItem>
                <SelectItem value="assignments">Assignments Only</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SortAsc className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest First</SelectItem>
                <SelectItem value="date-asc">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        {!allItems.length ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No posts yet.</p>
            </CardContent>
          </Card>
        ) : (
          allItems.map((item) => (
            <PostCard
              key={`${item.type}-${item.id}`}
              item={item}
              isTeacher={isTeacher}
              offeringId={offeringIdNum}
            />
          ))
        )}
      </div>

      {/* Dialogs */}
      {isTeacher && (
        <CreatePostDialog
          open={showCreatePost}
          onOpenChange={setShowCreatePost}
          offeringId={offeringIdNum}
        />
      )}

      <OfferingRosterDialog
        open={showRoster}
        onOpenChange={setShowRoster}
        offeringId={offeringIdNum}
      />
    </div>
  );
}

// Post Card Component with inline edit/delete
function PostCard({ item, isTeacher, offeringId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editDescription, setEditDescription] = useState(
    item.description || ""
  );

  const deleteMutation = useRemoveMaterial(offeringId);
  const isAssignment = item.type === "assignment";

  const handleDelete = async () => {
    if (!window.confirm(`Delete this ${item.type}?`)) return;
    try {
      await deleteMutation.mutateAsync(item.id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            {isEditing ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="font-semibold"
              />
            ) : (
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {item.title}
              </CardTitle>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={isAssignment ? "default" : "secondary"}>
                {isAssignment ? "Assignment" : "Material"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatDateTime(item.created_at || item.assigned_on)}
              </span>
              {isAssignment && item.due_at && (
                <span className="text-xs text-muted-foreground">
                  Due: {formatDateTime(item.due_at)}
                </span>
              )}
            </div>
          </div>

          {isTeacher && !isAssignment && (
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  /* Save logic */
                }}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {item.description || item.url}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
