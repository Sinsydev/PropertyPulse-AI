import { logout } from "../services/authService";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const nav = useNavigate();

  const handleLogout = async () => {
    await logout();
    nav("/");
  };

  return (
    <div className="min-h-screen bg-black text-white p-10">

      <h1 className="text-3xl font-bold">
        PropertyPulse AI Dashboard
      </h1>

      <p className="text-gray-400 mt-2">
        Welcome to your AI receptionist control panel
      </p>

      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 px-4 py-2"
      >
        Logout
      </button>

    </div>
  );
}