import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes/routes";
import { getAuthErrorMessage } from "../services/authService";
import Button from "../components/Button";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setError("");
      await createUserWithEmailAndPassword(auth, email, password);
      navigate(routes.dashboard);
    } catch (err) {
      setError(getAuthErrorMessage(err));
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="p-8 bg-white/5 border border-yellow-500/20 rounded-2xl w-87.5">

        <h2 className="text-2xl font-bold mb-6">Signup</h2>

        <input
          placeholder="Email"
          className="w-full p-2 mb-3 bg-black border border-gray-700 rounded"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Password"
          type="password"
          className="w-full p-2 mb-3 bg-black border border-gray-700 rounded"
          onChange={(e) => setPassword(e.target.value)}
        />

        {error ? (
          <p className="mb-3 text-sm text-red-400">{error}</p>
        ) : null}

        <Button onClick={handleSignup} className="w-full">
          Create Account
        </Button>

      </div>
    </div>
  );
}

