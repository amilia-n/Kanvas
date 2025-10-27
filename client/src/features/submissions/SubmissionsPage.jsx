import { useParams } from "react-router-dom";
import { useMe } from "../users/useMe";
import { ROLES } from "@/constants/roles";
import StudentSubmissionsView from "./StudentSubmissionsView";
import TeacherSubmissionsView from "./TeacherSubmissionsView";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { Spinner } from "@/components/ui/Spinner";

export default function SubmissionsPage() {
  const { offeringId } = useParams();
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
          You must be logged in to view submissions.
        </AlertDescription>
      </Alert>
    );
  }

  const isTeacher = me.role === ROLES.TEACHER || me.role === ROLES.ADMIN;

  return isTeacher ? (
    <TeacherSubmissionsView offeringId={offeringId} />
  ) : (
    <StudentSubmissionsView offeringId={offeringId} />
  );
}
