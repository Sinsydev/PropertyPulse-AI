import { useState } from "react";
import { auth } from "../lib/firebase";
import {
  createBusiness,
  normalizeBusinessInput,
} from "../services/businessService";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes/routes";

export default function Onboarding() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [service, setService] = useState<string>("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        setError("User not logged in");
        return;
      }

      const normalizedBusiness = normalizeBusinessInput({
        userId: user.uid,
        businessName,
        phone,
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
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="p-8 bg-white/5 border border-yellow-500/20 rounded-xl w-87.5">

        <h2 className="text-xl font-bold mb-4">
          Setup Your Business
        </h2>

        <input
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full p-2 mb-3 bg-black border border-gray-700 rounded"
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 mb-3 bg-black border border-gray-700 rounded"
        />

        <input
          placeholder="Service (e.g Plumbing)"
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="w-full p-2 mb-4 bg-black border border-gray-700 rounded"
        />

        {error ? (
          <p className="mb-3 text-sm text-red-400">{error}</p>
        ) : null}

        <button
          onClick={handleSubmit}
          className="w-full py-2 bg-yellow-500 text-black rounded"
        >
          Continue
        </button>

      </div>
    </div>
  );
}