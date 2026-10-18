import { useEffect, useState } from "react";
import {
  Bot,
  CalendarCheck,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  PhoneCall,
  Plus,
  Users,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/AppShell";
import Badge from "../components/Badge";
import Button from "../components/Button";
import Card from "../components/Card";
import EmptyState from "../components/EmptyState";
import Input from "../components/Input";
import PageHeader from "../components/PageHeader";
import { auth } from "../lib/firebase";
import { getBusinessByUser } from "../services/businessService";
import { askAI } from "../services/smartAI";
import {
  createLead,
  getLeads,
  summarizeLeadStatuses,
  updateLeadStatus,
} from "../services/leadService";
import { routes } from "../routes/routes";
import { LEAD_STATUSES, type LeadRecord, type LeadStatus } from "../types/business";

type DashboardTab = "overview" | "leads" | "calls" | "bookings" | "ai";

type ChatMessage = {
  type: "user" | "ai" | "system";
  text: string;
};

export default function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
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

  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    { type: "system", text: "AI receptionist online and ready for new calls." },
  ]);
  const [input, setInput] = useState<string>("");

  const leadStatusOptions: LeadStatus[] = [...LEAD_STATUSES];
  const leadStatusSummary = summarizeLeadStatuses(leads);

  const menu = [
    { name: "Overview", icon: LayoutDashboard, key: "overview" as const },
    { name: "Leads", icon: Users, key: "leads" as const },
    { name: "Calls", icon: PhoneCall, key: "calls" as const },
    { name: "Bookings", icon: CalendarCheck, key: "bookings" as const },
    { name: "AI Activity", icon: Bot, key: "ai" as const },
  ];

  const badgeVariantByStatus: Record<LeadStatus, "accent" | "neutral" | "warning" | "success"> = {
    new: "accent",
    contacted: "neutral",
    qualified: "success",
    booked: "warning",
    closed: "success",
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const firebaseAuth = auth;

        if (!firebaseAuth) {
          navigate(routes.login);
          return;
        }

        const user = await new Promise<{ uid: string } | null>((resolve) => {
          const unsubscribe = firebaseAuth.onAuthStateChanged((currentUser) => {
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
        setLeads(await getLeads(business.id));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    void loadData();
  }, [navigate]);

  const logout = async () => {
    if (!auth) {
      navigate(routes.login);
      return;
    }

    await signOut(auth);
    navigate(routes.login);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setAiMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInput("");

    try {
      const ai = await askAI(userMessage);

      setAiMessages((prev) => [...prev, { type: "ai", text: ai.reply }]);

      try {
        const data = JSON.parse(ai.reply);

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
        { type: "system", text: "AI service unavailable. Please try again." },
      ]);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

  const handleLeadStatusChange = async (leadId: string, nextStatus: string) => {
    try {
      await updateLeadStatus(leadId, nextStatus);
      const updatedLeads = await getLeads(businessId);
      setLeads(updatedLeads);
    } catch (err) {
      console.error(err);
    }
  };

  const renderOverview = () => (
    <>
      <PageHeader
        eyebrow="Operator console"
        title="Overview"
        description="Watch incoming leads, conversion health, and response quality from a single view."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "New leads", value: leadStatusSummary.new, icon: PhoneCall },
          { label: "Total leads", value: leads.length, icon: Users },
          { label: "Bookings", value: leadStatusSummary.booked, icon: CalendarCheck },
          { label: "Qualified", value: leadStatusSummary.qualified, icon: Bot },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="p-5">
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
              <Icon size={18} />
            </div>
            <p className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">{value}</p>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">{label}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_0.9fr]">
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Recent leads</h3>
            <Button variant="secondary" onClick={() => setActiveTab("leads")}>
              Open leads
            </Button>
          </div>

          <div className="space-y-3">
            {leads.length === 0 ? (
              <EmptyState
                title="No leads yet"
                description="New inbound inquiries will appear here as soon as they are captured."
              />
            ) : (
              leads.slice(0, 4).map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between gap-4 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-[var(--color-text)]">{lead.name}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{lead.service}</p>
                  </div>
                  <Badge variant={badgeVariantByStatus[lead.status]}>{lead.status}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4 flex items-center gap-2 text-[var(--color-accent)]">
            <MessageSquareText size={18} />
            <h3 className="text-lg font-semibold text-[var(--color-text)]">AI intake</h3>
          </div>

          <div className="flex max-h-[320px] flex-col gap-2 overflow-y-auto">
            {aiMessages.map((msg, index) => (
              <div
                key={`${msg.type}-${index}`}
                className={[
                  "rounded-[var(--radius-md)] px-3 py-2 text-sm",
                  msg.type === "user"
                    ? "bg-[var(--color-surface-muted)] text-[var(--color-text)]"
                    : msg.type === "ai"
                      ? "bg-[var(--color-accent-soft)] text-[var(--color-text)]"
                      : "border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)]",
                ].join(" ")}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a customer inquiry..."
            />
            <Button onClick={sendMessage} className="shrink-0">
              Send
            </Button>
          </div>
        </Card>
      </div>
    </>
  );

  const renderLeads = () => (
    <>
      <PageHeader
        eyebrow="Pipeline"
        title="Leads"
        description="Prioritize inbound demand and move each inquiry through the operator workflow."
        actions={
          <Button onClick={() => setShowModal(true)} className="gap-2">
            <Plus size={16} /> Add Lead
          </Button>
        }
      />

      {loading ? (
        <Card className="p-6 text-sm text-[var(--color-text-muted)]">Loading leads...</Card>
      ) : leads.length === 0 ? (
        <EmptyState
          title="No active leads"
          description="As soon as a call or inquiry is captured, it will appear here for triage."
          action={<Button variant="secondary" onClick={() => setShowModal(true)}>Add lead</Button>}
        />
      ) : (
        <div className="space-y-3">
          {leads.map((lead) => (
            <Card key={lead.id} className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-[var(--color-text)]">{lead.name}</p>
                  <p className="mt-1 text-sm text-[var(--color-text-muted)]">{lead.phone}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">{lead.service}</p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={badgeVariantByStatus[lead.status]}>{lead.status}</Badge>
                  <select
                    value={lead.status}
                    onChange={(event) => handleLeadStatusChange(lead.id, event.target.value)}
                    className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-2.5 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
                  >
                    {leadStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );

  const renderEmptyTab = (title: string, description: string) => (
    <>
      <PageHeader
        eyebrow="Operator workspace"
        title={title}
        description={description}
      />
      <EmptyState
        title={`No ${title.toLowerCase()} yet`}
        description="This section is ready for real data, but the current scope keeps it intentionally empty until the conversion workflow is wired end-to-end."
      />
    </>
  );

  const sidebar = (
    <>
      <div className="mb-8">
        <div className="text-xl font-semibold tracking-tight">
          PropertyPulse <span className="text-[var(--color-accent)]">AI</span>
        </div>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Operator console
        </p>
      </div>

      <nav className="space-y-2">
        {menu.map(({ name, key, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={[
              "flex w-full items-center gap-2 rounded-[var(--radius-md)] px-3 py-2.5 text-left text-sm transition",
              activeTab === key
                ? "bg-[var(--color-accent)] text-[#101827] shadow-[0_10px_22px_rgba(212,175,91,0.18)]"
                : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text)]",
            ].join(" ")}
          >
            <Icon size={16} />
            {name}
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6">
        <Button variant="ghost" onClick={logout} className="w-full justify-start gap-2">
          <LogOut size={16} /> Logout
        </Button>
      </div>
    </>
  );

  const topbar = (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
          Dashboard
        </p>
        <h2 className="mt-1 text-xl font-semibold text-[var(--color-text)] capitalize">
          {activeTab}
        </h2>
      </div>

      {activeTab === "leads" ? (
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Plus size={16} /> Add Lead
        </Button>
      ) : null}
    </div>
  );

  return (
    <AppShell sidebar={sidebar} topbar={topbar}>
      {activeTab === "overview" && renderOverview()}
      {activeTab === "leads" && renderLeads()}
      {activeTab === "calls" &&
        renderEmptyTab(
          "Calls",
          "Call transcripts and intake history stay here once the telephony layer is connected to a live business."
        )}
      {activeTab === "bookings" &&
        renderEmptyTab(
          "Bookings",
          "Booked jobs and callback confirmations appear here as the workflow is activated."
        )}
      {activeTab === "ai" &&
        renderEmptyTab(
          "AI Activity",
          "AI actions and interpretation logs are kept lightweight until the live lead capture pipeline is complete."
        )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <Card className="w-full max-w-lg border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <h3 className="text-xl font-semibold text-[var(--color-text)]">Add lead</h3>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">
              Capture a new inquiry without leaving the operator view.
            </p>

            <div className="mt-5 space-y-3">
              <Input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
              <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
              <Input name="service" value={form.service} onChange={handleChange} placeholder="Service" />
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
              >
                {leadStatusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save lead</Button>
            </div>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
