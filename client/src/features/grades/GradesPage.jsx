import { useMe } from "../users/useMe";
import { ROLES } from "@/constants/roles";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";
import StudentGradesView from "./StudentGradesView";
import TeacherGradesView from "./TeacherGradesView";

export default function GradesPage() {
  const { data: me, isLoading } = useMe();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!me) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          You must be logged in to view grades.
        </AlertDescription>
      </Alert>
    );
  }

  const isTeacher = me.role === ROLES.TEACHER || me.role === ROLES.ADMIN;

  return isTeacher ? <TeacherGradesView /> : <StudentGradesView />;
}
