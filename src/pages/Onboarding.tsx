import { useState } from "react";
import { auth } from "../lib/firebase";
import { createBusiness } from "../services/businessService";
import { useNavigate } from "react-router-dom";

export default function Onboarding() {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [service, setService] = useState<string>("");

  const handleSubmit = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        alert("User not logged in");
        return;
      }

      await createBusiness({
        userId: user.uid,
        businessName,
        phone,
        service,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error saving business");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="p-8 bg-white/5 border border-yellow-500/20 rounded-xl w-[350px]">

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