import { useState } from "react";
import { useSearchClassmates } from "../offerings/useOfferings";
import { Input } from "@/components/ui/Input";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Mail, User } from "lucide-react";

export default function OfferingRosterDialog({
  open,
  onOpenChange,
  offeringId,
}) {
  const [q, setQ] = useState("");

  const {
    data: classmates,
    isLoading,
    isError,
    error,
  } = useSearchClassmates(offeringId, q, {
    enabled: open && !!offeringId,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Classmates</DialogTitle>
          <DialogDescription>
            Students enrolled in this course
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="px-1">
          <Input
            placeholder="Search by name or email…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto py-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Spinner className="size-6" />
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertDescription>
                {error?.response?.data?.message || "Failed to load classmates"}
              </AlertDescription>
            </Alert>
          ) : !classmates?.length ? (
            <Alert>
              <AlertDescription>
                {q
                  ? "No classmates match your search."
                  : "No classmates found."}
              </AlertDescription>
            </Alert>
          ) : (
            <ul className="space-y-2">
              {classmates.map((s) => (
                <li
                  key={s.id}
                  className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {s.first_name} {s.last_name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <a
                          href={`mailto:${s.email}`}
                          className="hover:text-foreground hover:underline"
                        >
                          {s.email}
                        </a>
                      </div>
                    </div>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
