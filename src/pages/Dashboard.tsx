import { useState } from "react";
import { Bot, PhoneCall, CalendarCheck, Users, Activity } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [calls] = useState([
    { id: 1, text: "Customer called about plumbing issue", status: "Booked" },
    { id: 2, text: "Missed call auto-handled by AI", status: "Lead" },
    { id: 3, text: "New HVAC service request", status: "Booked" },
  ]);

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
        <h1 className="text-xl font-bold">
          AI <span className="text-yellow-400">Dashboard</span>
        </h1>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white"
        >
          Logout
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 px-6 py-10">

        <div className="p-5 rounded-xl bg-white/5 border border-yellow-500/10">
          <PhoneCall className="text-yellow-400 mb-2" />
          <h2 className="text-lg font-bold">24 Calls</h2>
          <p className="text-gray-400 text-sm">Handled today</p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-yellow-500/10">
          <Bot className="text-yellow-400 mb-2" />
          <h2 className="text-lg font-bold">AI Active</h2>
          <p className="text-gray-400 text-sm">System running 24/7</p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-yellow-500/10">
          <CalendarCheck className="text-yellow-400 mb-2" />
          <h2 className="text-lg font-bold">12 Bookings</h2>
          <p className="text-gray-400 text-sm">Appointments scheduled</p>
        </div>

        <div className="p-5 rounded-xl bg-white/5 border border-yellow-500/10">
          <Users className="text-yellow-400 mb-2" />
          <h2 className="text-lg font-bold">18 Leads</h2>
          <p className="text-gray-400 text-sm">Captured automatically</p>
        </div>

      </div>

      {/* MAIN SECTION */}
      <div className="px-6 grid md:grid-cols-2 gap-6">

        {/* ACTIVITY FEED */}
        <div className="p-6 rounded-xl bg-white/5 border border-yellow-500/10">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-yellow-400" />
            <h2 className="font-bold">AI Activity Feed</h2>
          </div>

          <div className="space-y-3">
            {calls.map((call) => (
              <div
                key={call.id}
                className="p-3 bg-black/40 border border-white/10 rounded-lg"
              >
                <p className="text-sm">{call.text}</p>
                <span className="text-xs text-yellow-400">
                  {call.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-6 rounded-xl bg-white/5 border border-yellow-500/10">

          <div className="flex items-center gap-2 mb-4">
            <Bot className="text-yellow-400" />
            <h2 className="font-bold">AI Status</h2>
          </div>

          <div className="p-4 bg-black/40 rounded-lg border border-white/10">
            <p className="text-green-400 font-semibold">
              ● System Online
            </p>
            <p className="text-gray-400 text-sm mt-2">
              AI is actively answering calls, capturing leads and booking jobs automatically.
            </p>
          </div>

          <button className="mt-6 w-full py-3 rounded-lg bg-yellow-400 text-black font-semibold">
            View Full Analytics
          </button>

        </div>

      </div>
    </div>
  );
}