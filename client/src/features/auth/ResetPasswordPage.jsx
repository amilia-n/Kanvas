import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useResetPassword from "./useReset";
import { paths } from "@/routes/paths";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/Alert";
import { KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const prefillToken = useMemo(() => sp.get("token") || "", [sp]);

  const [email, setEmail] = useState("");
  const [token, setToken] = useState(prefillToken);
  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");

  const reset = useResetPassword({
    onSuccess: () => {
      setTimeout(() => navigate(paths.login, { replace: true }), 2000);
    },
  });

  const passwordsMatch = pwd1 && pwd2 && pwd1 === pwd2;
  const canSubmit = Boolean(token) && passwordsMatch && !reset.isPending;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    reset.mutate({ token, newPassword: pwd1 });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2 mb-4">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Enter your reset token and new password
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {reset.isSuccess ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your password has been updated. Redirecting to login...
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">Reset token</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Paste your token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pwd1">New password</Label>
                <Input
                  id="pwd1"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={pwd1}
                  onChange={(e) => setPwd1(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pwd2">Confirm new password</Label>
                <Input
                  id="pwd2"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={pwd2}
                  onChange={(e) => setPwd2(e.target.value)}
                  required
                />
              </div>

              {pwd1 && pwd2 && !passwordsMatch && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Passwords do not match.</AlertDescription>
                </Alert>
              )}

              <Button type="submit" disabled={!canSubmit} className="w-full">
                {reset.isPending ? "Updating…" : "Update password"}
              </Button>

              {reset.error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {reset.error?.response?.data?.message || 
                      "Reset failed. Check your token and try again."}
                  </AlertDescription>
                </Alert>
              )}
            </form>
          )}

          <div className="text-center">
            <Button variant="link" asChild>
              <a href={paths.login}>Back to Login</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}