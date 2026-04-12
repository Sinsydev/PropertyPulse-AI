import { useEffect, useState } from "react";
import {
  PhoneCall,
  Bot,
  CalendarCheck,
  Users,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

import { getLeads, createLead } from "../services/leadService";
import type { Lead } from "../services/leadService";

export default function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [showModal, setShowModal] = useState<boolean>(false);

  const [form, setForm] = useState<Omit<Lead, "id">>({
    name: "",
    phone: "",
    service: "",
    status: "new",
  });

  /* =========================
     AI FLOW STATE
  ========================= */
  const [aiMessages, setAiMessages] = useState<
    { type: "user" | "ai" | "system"; text: string }[]
  >([
    { type: "system", text: "AI Reception System Online..." },
  ]);

  const simulateCall = () => {
    setAiMessages((prev) => [
      ...prev,
      { type: "user", text: "📞 Incoming Call from Client..." },
    ]);

    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        { type: "ai", text: "Hello! Welcome to PropertyPulse AI. How can I help you?" },
      ]);
    }, 1500);

    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        { type: "ai", text: "Analyzing request..." },
      ]);
    }, 3000);

    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        { type: "system", text: "📅 Appointment automatically booked!" },
      ]);
    }, 5000);
  };

  /* =========================
     AUTH
  ========================= */
  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  /* =========================
     MENU
  ========================= */
  const menu = [
    { name: "Overview", icon: <LayoutDashboard size={18} />, key: "overview" },
    { name: "Leads", icon: <Users size={18} />, key: "leads" },
    { name: "Calls", icon: <PhoneCall size={18} />, key: "calls" },
    { name: "Bookings", icon: <CalendarCheck size={18} />, key: "bookings" },
    { name: "AI Activity", icon: <Bot size={18} />, key: "ai" },
  ];

  /* =========================
     LOAD LEADS
  ========================= */
  useEffect(() => {
    const load = async () => {
      const data = await getLeads();
      setLeads(data);
      setLoading(false);
    };

    load();
  }, []);

  /* =========================
     FORM HANDLER
  ========================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await createLead(form);

    setForm({
      name: "",
      phone: "",
      service: "",
      status: "new",
    });

    setShowModal(false);

    const updated = await getLeads();
    setLeads(updated);
  };

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
              className={`flex items-center gap-2 w-full text-left p-2 rounded-lg ${
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

      {/* MAIN */}
      <div className="flex-1 p-6">

        {/* TOP BAR */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">

          <h2 className="text-xl font-semibold capitalize">
            {activeTab}
          </h2>

          {activeTab === "leads" && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg"
            >
              + Add Lead
            </button>
          )}

          {activeTab === "overview" && (
            <button
              onClick={simulateCall}
              className="px-4 py-2 bg-yellow-500 text-black rounded-lg"
            >
              Simulate Call
            </button>
          )}

        </div>

        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <>
            <div className="grid md:grid-cols-4 gap-4">

              <div className="p-4 bg-white/5 rounded-xl">
                <PhoneCall className="text-yellow-400 mb-2" />
                <p className="text-2xl font-bold">24</p>
                <p className="text-gray-400 text-sm">Calls</p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <Users className="text-yellow-400 mb-2" />
                <p className="text-2xl font-bold">{leads.length}</p>
                <p className="text-gray-400 text-sm">Leads</p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <CalendarCheck className="text-yellow-400 mb-2" />
                <p className="text-2xl font-bold">12</p>
                <p className="text-gray-400 text-sm">Bookings</p>
              </div>

              <div className="p-4 bg-white/5 rounded-xl">
                <Bot className="text-green-400 mb-2" />
                <p className="text-2xl font-bold">Online</p>
                <p className="text-gray-400 text-sm">AI</p>
              </div>

            </div>

            {/* AI LIVE FLOW */}
            <div className="mt-8 p-5 bg-white/5 border border-white/10 rounded-xl h-[300px] overflow-y-auto">

              <h3 className="font-semibold mb-4 text-yellow-400">
                AI Live Simulation
              </h3>

              <div className="space-y-3">
                {aiMessages.map((msg, i) => (
                  <div key={i} className="text-sm">
                    {msg.type === "user" && (
                      <p className="text-blue-400">{msg.text}</p>
                    )}

                    {msg.type === "ai" && (
                      <p className="text-gray-300">🤖 {msg.text}</p>
                    )}

                    {msg.type === "system" && (
                      <p className="text-green-400">{msg.text}</p>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </>
        )}

        {/* LEADS */}
        {activeTab === "leads" && (
          <div className="space-y-3">
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <p className="font-semibold">{lead.name}</p>
                  <p className="text-gray-400 text-sm">{lead.phone}</p>
                  <p className="text-gray-400 text-sm">{lead.service}</p>
                  <p className="text-yellow-400 text-sm">{lead.status}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* MODAL */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
            <div className="bg-black border border-white/10 p-6 rounded-xl w-[350px]">

              <h2 className="text-lg font-bold mb-4">Add Lead</h2>

              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full p-2 mb-2 bg-white/5 rounded"
              />

              <input
                name="phone"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full p-2 mb-2 bg-white/5 rounded"
              />

              <input
                name="service"
                placeholder="Service"
                value={form.service}
                onChange={handleChange}
                className="w-full p-2 mb-2 bg-white/5 rounded"
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 mb-4 bg-white/5 rounded"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="booked">Booked</option>
              </select>

              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-yellow-500 text-black py-2 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/10 py-2 rounded"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}