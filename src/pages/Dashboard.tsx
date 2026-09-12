import { useEffect, useState } from "react";
import {
  PhoneCall,
  Bot,
  CalendarCheck,
  Users,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { askAI } from "../services/smartAI";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { getLeads, createLead } from "../services/leadService";
import { LEAD_STATUSES, type LeadRecord, type LeadStatus } from "../types/business";
import { getBusinessByUser } from "../services/businessService";
import { routes } from "../routes/routes";

type ChatMessage = {
  type: "user" | "ai" | "system";
  text: string;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string>("overview");
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [businessId, setBusinessId] = useState<string>("");

  const [form, setForm] = useState<Omit<LeadRecord, "id" | "createdAt">>({
    name: "",
    phone: "",
    service: "",
    businessId: "",
    status: "new",
  });

  const leadStatusOptions: LeadStatus[] = [...LEAD_STATUSES];

  /* =========================
     AI CHAT STATE
  ========================= */
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    { type: "system", text: "AI Receptionist Online..." },
  ]);

  const [input, setInput] = useState<string>("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();

    setAiMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInput("");

    try {
      const ai = await askAI(userMessage);
      const reply = ai.reply;

      setAiMessages((prev) => [...prev, { type: "ai", text: reply }]);

      try {
        const data = JSON.parse(reply);

        if (data.name && data.phone && data.service) {
          await createLead({
            name: String(data.name),
            phone: String(data.phone),
            service: String(data.service),
            status: "new",
            businessId,
          });

          const updatedLeads = await getLeads(businessId);
          setLeads(updatedLeads);
        }
      } catch {
        // ignore non-JSON responses from the AI service
      }
    } catch (err) {
      console.error(err);

      setAiMessages((prev) => [
        ...prev,
        { type: "system", text: "⚠️ AI service unavailable" },
      ]);
    }
  };

  /* =========================
     AUTH
  ========================= */
  const logout = async () => {
    await signOut(auth);
    navigate(routes.login);
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
     LOAD DATA
  ========================= */
  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await new Promise<{ uid: string } | null>((resolve) => {
          const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            unsubscribe();
            resolve(currentUser ? { uid: currentUser.uid } : null);
          });
        });

        if (!user) {
          navigate(routes.login);
          return;
        }

        const business = await getBusinessByUser(user.uid);

        if (!business) {
          navigate(routes.onboarding);
          return;
        }

        setBusinessId(business.id);

        const leadsData = await getLeads(business.id);
        setLeads(leadsData);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [navigate]);

  /* =========================
     FORM HANDLER
  ========================= */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!businessId) return;

    await createLead({
      ...form,
      businessId,
    });

    setForm({
      name: "",
      phone: "",
      service: "",
      status: "new",
      businessId: "",
    });

    setShowModal(false);

    const updatedLeads = await getLeads(businessId);
    setLeads(updatedLeads);
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
              className={`flex items-center gap-2 w-full p-2 rounded-lg ${
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

            {/* AI CHAT */}
            <div className="mt-8 p-5 bg-white/5 border border-white/10 rounded-xl h-87.5 flex flex-col">
              <h3 className="font-semibold mb-4 text-yellow-400">
                AI Reception Chat
              </h3>

              <div className="flex-1 overflow-y-auto space-y-2">
                {aiMessages.map((msg, i) => (
                  <p
                    key={i}
                    className={`text-sm ${
                      msg.type === "user"
                        ? "text-blue-400"
                        : msg.type === "ai"
                        ? "text-gray-300"
                        : "text-green-400"
                    }`}
                  >
                    {msg.text}
                  </p>
                ))}
              </div>

              <div className="mt-3 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type like a customer..."
                  className="flex-1 p-2 bg-white/5 rounded"
                />
                <button
                  onClick={sendMessage}
                  className="bg-yellow-500 px-4 rounded text-black"
                >
                  Send
                </button>
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
            <div className="bg-black border border-white/10 p-6 rounded-xl w-87.5">
              <h2 className="text-lg font-bold mb-4">Add Lead</h2>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full p-2 mb-2 bg-white/5 rounded"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full p-2 mb-2 bg-white/5 rounded"
              />

              <input
                name="service"
                value={form.service}
                onChange={handleChange}
                placeholder="Service"
                className="w-full p-2 mb-2 bg-white/5 rounded"
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 mb-4 bg-white/5 rounded"
              >
                {leadStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
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