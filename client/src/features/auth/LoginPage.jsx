import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useLogin, useRegister } from "./useLogin";
import { toErrorMessage } from "../../lib/errorHandler";
import { paths } from "../../routes/paths";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Alert, AlertDescription } from "@/components/ui/Alert";
import { GraduationCap } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || paths.home;

  const [mode, setMode] = useState("login");
  const [role, setRole] = useState("student");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [teacherNumber, setTeacherNumber] = useState("");

  const loginMut = useLogin({
    onSuccess: () => navigate(redirectTo, { replace: true }),
  });

  const registerMut = useRegister({
    onSuccess: () => navigate(redirectTo, { replace: true }),
  });

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    loginMut.login(email, password);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    if (role === "teacher") {
      if (!teacherNumber) {
        alert("Teacher number is required.");
        return;
      }
      registerMut.register({
        role,
        email,
        password,
        teacher_number: teacherNumber,
      });
    } else {
      if (!firstName || !lastName) {
        alert("First and last name are required.");
        return;
      }
      registerMut.register({
        role,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        student_number: studentNumber || undefined,
      });
    }
  };

  const isPending = loginMut.isPending || registerMut.isPending;
  const error = mode === "login" ? loginMut.error : registerMut.error;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Kanvas</span>
          </div>
          <CardTitle className="text-2xl text-center">
            {mode === "login" ? "Welcome back" : "Create account"}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === "login"
              ? "Enter your credentials to access your account"
              : "Sign up to get started"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === "login" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setMode("login")}
            >
              Login
            </Button>
            <Button
              type="button"
              variant={mode === "register" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setMode("register")}
            >
              Register
            </Button>
          </div>

          {/* Role Selection (Register only) */}
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={mode === "login" ? handleLogin : handleRegister}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {mode === "register" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    autoComplete="new-password"
                    placeholder="••••••••"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                  />
                </div>

                {role === "student" ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first">First name</Label>
                        <Input
                          id="first"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="last">Last name</Label>
                        <Input
                          id="last"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="snum">Student number (optional)</Label>
                      <Input
                        id="snum"
                        value={studentNumber}
                        onChange={(e) => setStudentNumber(e.target.value)}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="tnum">Teacher number</Label>
                    <Input
                      id="tnum"
                      value={teacherNumber}
                      onChange={(e) => setTeacherNumber(e.target.value)}
                      required
                    />
                  </div>
                )}
              </>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending
                ? mode === "login"
                  ? "Signing in…"
                  : "Creating account…"
                : mode === "login"
                ? "Sign in"
                : "Create account"}
            </Button>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {toErrorMessage(
                    error,
                    mode === "login"
                      ? "Invalid email or password"
                      : "Registration failed"
                  )}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>

        {mode === "login" && (
          <CardFooter>
            <Button variant="link" className="w-full" asChild>
              <a href={paths.reset}>Forgot password?</a>
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}
