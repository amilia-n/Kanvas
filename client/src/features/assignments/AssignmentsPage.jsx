import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMyOfferings } from "../offerings/useOfferings";
import { useAssignments } from "./useAssignments";
import { useMe } from "../users/useMe";
import { ROLES } from "@/constants/roles";
import { formatDateTime, formatPercent } from "@/utils/format";
import { percentToLetter } from "@/constants/grading";
import { paths } from "@/routes/paths";
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
  ChevronDown,
  ChevronRight,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const { data: me } = useMe();
  const { data: offerings, isLoading: offeringsLoading } = useMyOfferings();
  const [expandedOfferings, setExpandedOfferings] = useState(new Set());

  const isStudent = me?.role === ROLES.STUDENT;

  const currentOfferings = useMemo(
    () =>
      offerings?.filter(
        (o) => o.status === "current" || o.status === "enrolled"
      ) ?? [],
    [offerings]
  );

  const toggleOffering = (offeringId) => {
    setExpandedOfferings((prev) => {
      const next = new Set(prev);
      if (next.has(offeringId)) {
        next.delete(offeringId);
      } else {
        next.add(offeringId);
      }
      return next;
    });
  };

  if (offeringsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Assignments</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isStudent
            ? "View your assignments and grades"
            : "Manage course assignments"}
        </p>
      </div>

      {/* Courses with Assignments */}
      {!currentOfferings.length ? (
        <Alert>
          <AlertDescription>No current courses.</AlertDescription>
        </Alert>
      ) : (
        <div className="space-y-4">
          {currentOfferings.map((offering) => (
            <OfferingAssignments
              key={offering.id}
              offering={offering}
              isExpanded={expandedOfferings.has(offering.id)}
              onToggle={() => toggleOffering(offering.id)}
              isStudent={isStudent}
              navigate={navigate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function OfferingAssignments({
  offering,
  isExpanded,
  onToggle,
  isStudent,
  navigate,
}) {
  const { data: assignments, isLoading } = useAssignments(offering.id, {
    enabled: isExpanded,
  });

  return (
    <Card>
      {/* Course Header */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-muted/50"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 flex-1">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
          <div>
            <h3 className="font-semibold">{offering.offering_code}</h3>
            <p className="text-sm text-muted-foreground">
              {offering.offering_name} · Section {offering.section}
            </p>
          </div>
        </div>
        <Badge variant="outline">{offering.term_code}</Badge>
      </div>

      {/* Assignments List */}
      {isExpanded && (
        <div className="border-t">
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Spinner className="size-6" />
              </div>
            ) : !assignments?.length ? (
              <Alert>
                <AlertDescription>No assignments yet.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-3">
                {assignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => navigate(paths.assignment(assignment.id))}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{assignment.title}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>Weight: {assignment.weight_percent}%</span>
                          {assignment.due_at && (
                            <span>
                              Due: {formatDateTime(assignment.due_at)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Student: Show submission status and grade */}
                      {isStudent && (
                        <>
                          {assignment.my_submission ? (
                            assignment.my_grade != null ? (
                              <div className="text-right">
                                <Badge variant="default">
                                  {formatPercent(assignment.my_grade)}
                                </Badge>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {percentToLetter(assignment.my_grade)}
                                </p>
                              </div>
                            ) : (
                              <Badge variant="outline">
                                <Clock className="h-3 w-3 mr-1" />
                                Submitted
                              </Badge>
                            )
                          ) : (
                            <Badge variant="secondary">Not Submitted</Badge>
                          )}
                        </>
                      )}

                      {/* Teacher: Show submission count */}
                      {!isStudent && (
                        <Badge variant="outline">
                          {assignment.submissions_count || 0} submission
                          {assignment.submissions_count !== 1 ? "s" : ""}
                        </Badge>
                      )}

                      <Badge
                        variant={assignment.is_open ? "default" : "secondary"}
                      >
                        {assignment.is_open ? "Open" : "Closed"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </div>
      )}
    </Card>
  );
}
