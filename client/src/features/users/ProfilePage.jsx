import { useState } from "react";
import {
  useMe,
  useUpdateMe,
  useUserMajors,
  useAddMajor,
  useRemoveMajor,
} from "./useMe";
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
import { Pencil, X, Save, Plus } from "lucide-react";

export default function ProfilePage() {
  const meQ = useMe();
  const userId = meQ.data?.id ?? null;

  const updateM = useUpdateMe(userId);
  const majorsQ = useUserMajors(userId);
  const addMajorM = useAddMajor(userId);
  const removeMajorM = useRemoveMajor(userId);

  const [isEditing, setIsEditing] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirst] = useState("");
  const [lastName, setLast] = useState("");
  const [majorToAdd, setMajorToAdd] = useState("");

  const user = meQ.data;

  const startEditing = () => {
    setEmail(user?.email ?? "");
    setFirst(user?.first_name ?? user?.firstName ?? "");
    setLast(user?.last_name ?? user?.lastName ?? "");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!userId) return;

    try {
      await updateM.mutateAsync({
        email,
        first_name: firstName,
        last_name: lastName,
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const onAddMajor = async (e) => {
    e.preventDefault();
    if (!majorToAdd.trim()) return;

    try {
      await addMajorM.mutateAsync(majorToAdd.trim().toUpperCase());
      setMajorToAdd("");
    } catch (err) {
      console.error("Add major failed:", err);
    }
  };

  const onRemoveMajor = async (code) => {
    try {
      await removeMajorM.mutateAsync(code);
    } catch (err) {
      console.error("Remove major failed:", err);
    }
  };

  if (meQ.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (meQ.isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load profile:{" "}
          {meQ.error?.response?.data?.message || meQ.error?.message || "Error"}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View and manage your account information
          </p>
        </div>
        {!isEditing && (
          <Button onClick={startEditing}>
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal details</CardDescription>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={onSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirst(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLast(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={updateM.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateM.isPending ? "Saving…" : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelEditing}
                  disabled={updateM.isPending}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>

              {updateM.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {updateM.error?.response?.data?.message ||
                      updateM.error?.message ||
                      "Update failed"}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Email
                  </p>
                  <p className="text-sm mt-1">{user?.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Role
                  </p>
                  <p className="text-sm mt-1 capitalize">{user?.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    First Name
                  </p>
                  <p className="text-sm mt-1">
                    {user?.first_name || user?.firstName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Last Name
                  </p>
                  <p className="text-sm mt-1">
                    {user?.last_name || user?.lastName}
                  </p>
                </div>
              </div>

              {user?.student_number && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Student Number
                  </p>
                  <p className="text-sm mt-1">{user.student_number}</p>
                </div>
              )}

              {user?.teacher_number && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Teacher Number
                  </p>
                  <p className="text-sm mt-1">{user.teacher_number}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Majors (Students only) */}
      {user?.role === "student" && (
        <Card>
          <CardHeader>
            <CardTitle>My Majors</CardTitle>
            <CardDescription>Your declared majors</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {majorsQ.isLoading ? (
              <div className="flex justify-center py-6">
                <Spinner className="size-6" />
              </div>
            ) : majorsQ.isError ? (
              <Alert variant="destructive">
                <AlertDescription>
                  Failed to load majors:{" "}
                  {majorsQ.error?.response?.data?.message ||
                    majorsQ.error?.message ||
                    "Error"}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(majorsQ.data ?? []).map((m) => (
                  <Badge
                    key={m.code}
                    variant="secondary"
                    className="px-3 py-1.5 text-sm"
                  >
                    {m.code}
                    {m.name && ` — ${m.name}`}
                    <button
                      type="button"
                      onClick={() => onRemoveMajor(m.code)}
                      disabled={removeMajorM.isPending}
                      className="ml-2 hover:text-destructive transition-colors"
                      aria-label={`Remove ${m.code}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                {majorsQ.data?.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No majors added yet.
                  </p>
                )}
              </div>
            )}

            <form onSubmit={onAddMajor} className="flex gap-2">
              <Input
                value={majorToAdd}
                onChange={(e) => setMajorToAdd(e.target.value)}
                placeholder="e.g. CS"
                className="flex-1"
              />
              <Button type="submit" disabled={addMajorM.isPending}>
                <Plus className="h-4 w-4 mr-2" />
                {addMajorM.isPending ? "Adding…" : "Add Major"}
              </Button>
            </form>

            {(addMajorM.isError || removeMajorM.isError) && (
              <Alert variant="destructive">
                <AlertDescription>
                  {addMajorM.error?.response?.data?.message ||
                    addMajorM.error?.message ||
                    removeMajorM.error?.response?.data?.message ||
                    removeMajorM.error?.message ||
                    "Major update failed"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
