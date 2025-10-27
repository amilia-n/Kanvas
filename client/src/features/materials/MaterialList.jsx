import { useState } from "react";
import {
  useMaterials,
  useAddMaterial,
  useRemoveMaterial,
} from "./useMaterials";
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
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { FileText, Plus, Trash2, ExternalLink, Calendar } from "lucide-react";

/**
 * Props:
 * - offeringId: number|string (required)
 * - canManage: boolean (optional) — show add/remove controls for teachers/admins
 */

export default function MaterialList({ offeringId, canManage = false }) {
  const listQ = useMaterials(offeringId);
  const addM = useAddMaterial(offeringId);
  const rmM = useRemoveMaterial(offeringId);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  const onAdd = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    addM.mutate(
      { title: title.trim(), url: url.trim() },
      {
        onSuccess: () => {
          setTitle("");
          setUrl("");
        },
      }
    );
  };

  const onRemove = (id) => {
    if (!id) return;
    rmM.mutate(id);
  };

  if (listQ.isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (listQ.error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {listQ.error?.response?.data?.message ||
            listQ.error.message ||
            "Failed to load materials"}
        </AlertDescription>
      </Alert>
    );
  }

  const rows = Array.isArray(listQ.data) ? listQ.data : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Course Materials
          </CardTitle>
          <CardDescription>
            Resources and documents for this course
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No materials yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rows.map((m) => {
                const id = m.id ?? m.material_id ?? m.materialId;
                const t = m.title ?? "(untitled)";
                const u = m.url ?? "";
                const uploadedBy =
                  m.uploaded_by ?? m.teacher_id ?? m.user_id ?? null;
                const uploadedAt = m.uploaded_at ?? m.created_at ?? null;

                return (
                  <Card key={id ?? `${t}-${u}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold">{t}</h3>
                          </div>

                          <a
                            href={u}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <ExternalLink className="h-3 w-3" />
                            {u}
                          </a>

                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {uploadedBy && (
                              <span>Uploaded by #{uploadedBy}</span>
                            )}
                            {uploadedAt && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(uploadedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        {canManage && id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onRemove(id)}
                            disabled={rmM.isPending && rmM.variables === id}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => listQ.refetch()}
            disabled={listQ.isFetching}
            className="mt-4"
          >
            {listQ.isFetching ? "Refreshing…" : "Refresh"}
          </Button>
        </CardContent>
      </Card>

      {canManage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Material
            </CardTitle>
            <CardDescription>
              Upload a new resource for students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Syllabus (FA25)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://…"
                  required
                />
              </div>

              <Button type="submit" disabled={addM.isPending}>
                {addM.isPending ? "Adding…" : "Add Material"}
              </Button>

              {addM.error && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {addM.error?.response?.data?.message ||
                      addM.error.message ||
                      "Failed to add material"}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
