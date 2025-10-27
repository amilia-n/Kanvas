import { useMemo } from "react";
import { useFinalGrades, useGpaCumulative } from "./useGrades";
import { useMyOfferings } from "@/features/offerings/useOfferings";
import { formatGPA } from "@/utils/format";
import { percentToLetter } from "@/constants/grading";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Award, BookOpen } from "lucide-react";

export default function StudentGradesView() {
  const { data: allOfferings, isLoading: offeringsLoading } = useMyOfferings();
  const { data: finalGrades } = useFinalGrades();
  const { data: cumulativeGPA, isLoading: cumulativeLoading } =
    useGpaCumulative();

  const allCoursesData = useMemo(() => {
    if (!allOfferings) return [];

    return allOfferings
      .map((offering) => {
        const gradeData = finalGrades?.find(
          (g) => g.offering_id === offering.id
        );

        return {
          ...offering,
          final_percent: gradeData?.final_percent,
          final_gpa: gradeData?.gpa,
        };
      })
      .sort((a, b) => {
        const statusOrder = {
          current: 0,
          upcoming: 1,
          past: 2,
          completed: 3,
          dropped: 4,
        };
        return (statusOrder[a.status] || 5) - (statusOrder[b.status] || 5);
      });
  }, [allOfferings, finalGrades]);

  const getGPAColor = (gpa) => {
    if (gpa == null) return "text-muted-foreground";
    if (gpa >= 3.7) return "text-green-600 dark:text-green-400";
    if (gpa >= 3.0) return "text-blue-600 dark:text-blue-400";
    if (gpa >= 2.0) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getStatusDisplay = (offering) => {
    if (offering.status === "completed") {
      return {
        label: "Completed",
        variant: "default",
        gpa: offering.final_gpa,
      };
    }
    if (offering.status === "dropped") {
      return {
        label: "Dropped",
        variant: "destructive",
        gpa: null,
      };
    }
    return {
      label: "Ongoing",
      variant: "secondary",
      gpa: null,
    };
  };

  if (offeringsLoading || cumulativeLoading) {
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
        <h1 className="text-2xl font-semibold">Academic Performance</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your grades and GPA
        </p>
      </div>

      {/* Cumulative GPA Card - Color Coded */}
      <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            Cumulative GPA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-5xl font-bold ${getGPAColor(cumulativeGPA)}`}>
            {cumulativeGPA != null ? formatGPA(cumulativeGPA) : "—"}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Based on all completed courses
          </p>
        </CardContent>
      </Card>

      {/* All Courses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Course History
          </CardTitle>
          <CardDescription>
            {allCoursesData.length} course
            {allCoursesData.length !== 1 ? "s" : ""} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!allCoursesData.length ? (
            <Alert>
              <AlertDescription>No courses found.</AlertDescription>
            </Alert>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Letter Grade</TableHead>
                  <TableHead className="text-center">GPA</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allCoursesData.map((offering) => {
                  const statusInfo = getStatusDisplay(offering);
                  const letterGrade =
                    offering.final_percent != null
                      ? percentToLetter(offering.final_percent)
                      : null;

                  return (
                    <TableRow key={offering.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{offering.offering_code}</p>
                          <p className="text-xs text-muted-foreground">
                            {offering.offering_name}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{offering.section}</TableCell>
                      <TableCell>{offering.term_code}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {letterGrade ? (
                          <Badge
                            variant={
                              letterGrade.startsWith("A")
                                ? "default"
                                : letterGrade.startsWith("B")
                                ? "secondary"
                                : "outline"
                            }
                          >
                            {letterGrade}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {statusInfo.gpa != null ? (
                          <span
                            className={`font-semibold ${getGPAColor(
                              statusInfo.gpa
                            )}`}
                          >
                            {formatGPA(statusInfo.gpa)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
