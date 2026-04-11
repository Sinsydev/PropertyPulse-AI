import { useState } from "react";
import { login, signup } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    await login(email, password);
    nav("/dashboard");
  };

  const handleSignup = async () => {
    await signup(email, password);
    nav("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      
      <div className="w-96 p-8 border border-gray-800 rounded-xl">

        <h1 className="text-2xl font-bold mb-6 text-center">
          PropertyPulse AI Login
        </h1>

        <input
          className="w-full p-2 mb-3 text-black"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 mb-4 text-black"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={handleLogin}
            className="bg-green-500 px-4 py-2 w-full"
          >
            Login
          </button>

          <button
            onClick={handleSignup}
            className="border px-4 py-2 w-full"
          >
            Signup
          </button>
        </div>

      </div>

    </div>
  );
}