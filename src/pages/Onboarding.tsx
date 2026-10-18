import { useState } from "react";
import { auth } from "../lib/firebase";
import {
  createBusiness,
  normalizeBusinessInput,
} from "../services/businessService";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes/routes";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";

export default function Onboarding() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [twilioNumber, setTwilioNumber] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      if (!auth) {
        setError(
          "Firebase Auth is not configured. Add your Firebase Web App values to .env.local; copying .env.example alone is not enough. Restart npm run dev after updating it."
        );
        return;
      }

      const user = auth.currentUser;

      if (!user) {
        setError("User not logged in");
        return;
      }

      const normalizedBusiness = normalizeBusinessInput({
        userId: user.uid,
        businessName,
        phone,
        twilioNumber,
        service,
      });

      setError("");
      await createBusiness(normalizedBusiness);

      navigate(routes.dashboard);
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Error saving business"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 py-12 text-[var(--color-text)]">
      <Card className="w-full max-w-xl border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-soft)]">
        <div className="mb-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
            Setup your business
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)]">
            Tell us about the work you do
          </h1>
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />

          <Input
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div>
            <Input
              placeholder="Twilio inbound number (optional)"
              value={twilioNumber}
              onChange={(e) => setTwilioNumber(e.target.value)}
            />
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              Use the number configured for your Twilio voice webhook. If it is
              the same as your business phone, leave this blank.
            </p>
          </div>

          <Input
            placeholder="Service (e.g. Plumbing)"
            value={service}
            onChange={(e) => setService(e.target.value)}
          />

          {error ? (
            <p className="text-sm text-[var(--color-danger)]">{error}</p>
          ) : null}

          <Button onClick={handleSubmit} className="w-full">
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}