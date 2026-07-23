import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes/routes";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");
      await signInWithEmailAndPassword(auth, email, password);
      navigate(routes.dashboard);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">
      <div className="p-8 bg-white/5 border border-yellow-500/20 rounded-2xl w-[350px]">

        <h2 className="text-2xl font-bold mb-6">Login</h2>

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

        <button
          onClick={handleLogin}
          className="w-full py-2 bg-yellow-500 text-black font-semibold rounded"
        >
          Login
        </button>

      </div>
    </div>
  );
}