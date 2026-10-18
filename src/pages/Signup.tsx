import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes/routes";
import { getAuthErrorMessage } from "../services/authService";
import Button from "../components/Button";
import Card from "../components/Card";
import Input from "../components/Input";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      if (!auth) {
        setError(
          "Firebase Auth is not configured. Add your Firebase Web App values to .env.local; copying .env.example alone is not enough. Restart npm run dev after updating it."
        );
        return;
      }

      setError("");
      await createUserWithEmailAndPassword(auth, email, password);
      navigate(routes.dashboard);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-12 text-[var(--color-text)]">
      <Card className="w-full max-w-md border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-soft)]">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            PropertyPulse AI
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)]">Create account</h1>
          <p className="mt-2 text-sm text-[var(--color-text-muted)]">
            Start capturing missed calls and turning them into booked jobs.
          </p>
        </div>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error ? (
            <p className="text-sm text-[var(--color-danger)]">{error}</p>
          ) : null}

          <Button onClick={handleSignup} className="w-full">
            Create account
          </Button>
        </div>

        <p className="mt-5 text-sm text-[var(--color-text-muted)]">
          Already have an account? {" "}
          <button
            type="button"
            className="font-medium text-[var(--color-accent-strong)] underline decoration-[var(--color-accent)] underline-offset-4"
            onClick={() => navigate(routes.login)}
          >
            Login
          </button>
        </p>
      </Card>
    </div>
  );
}

