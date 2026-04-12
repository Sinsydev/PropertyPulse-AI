import { useState } from "react";
import {
  PhoneCall,
  Bot,
  CalendarCheck,
  Users,
  Activity,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const menu = [
    { name: "Overview", icon: <LayoutDashboard size={18} />, key: "overview" },
    { name: "Leads", icon: <Users size={18} />, key: "leads" },
    { name: "Calls", icon: <PhoneCall size={18} />, key: "calls" },
    { name: "Bookings", icon: <CalendarCheck size={18} />, key: "bookings" },
    { name: "AI Activity", icon: <Bot size={18} />, key: "ai" },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* SIDEBAR */}
      <div className="w-64 border-r border-white/10 p-5">
        <h1 className="text-xl font-bold mb-8">
          PropertyPulse <span className="text-yellow-400">AI</span>
        </h1>

        <div className="space-y-2">
          {menu.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-2 w-full text-left p-2 rounded-lg transition ${
                activeTab === item.key
                  ? "bg-yellow-500 text-black"
                  : "hover:bg-white/10"
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 mt-10 text-red-400"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 p-6">

        {/* TOP BAR */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
          <h2 className="text-xl font-semibold capitalize">
            {activeTab}
          </h2>

          <div className="text-sm text-gray-400">
            AI Reception Dashboard
          </div>
        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="grid md:grid-cols-4 gap-4">

              <div className="p-4 bg-white/5 rounded-xl border border-yellow-500/10">
                <PhoneCall className="text-yellow-400 mb-2" />
                <p className="text-2xl font-bold">24</p>
                <p className="text-gray-400 text-sm">Calls Today</p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-yellow-500/10">
                <Users className="text-yellow-400 mb-2" />
                <p className="text-2xl font-bold">18</p>
                <p className="text-gray-400 text-sm">Leads Captured</p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-yellow-500/10">
                <CalendarCheck className="text-yellow-400 mb-2" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-gray-400 text-sm">Bookings</p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-yellow-500/10">
                <Bot className="text-yellow-400 mb-2" />
                <p className="text-2xl font-bold text-green-400">Online</p>
                <p className="text-gray-400 text-sm">AI Status</p>
              </div>

            </div>

            <div className="mt-8 p-5 bg-white/5 rounded-xl border border-yellow-500/10">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="text-yellow-400" />
                <h3 className="font-semibold">Live Activity</h3>
              </div>

              <p className="text-gray-400 text-sm">
                AI is actively answering calls and capturing leads in real time...
              </p>
            </div>
          </>
        )}

        {/* PLACEHOLDERS */}
        {activeTab !== "overview" && (
          <div className="p-10 text-center text-gray-500">
            {activeTab.toUpperCase()} section coming next...
          </div>
        )}

      </div>
    </div>
  );
}