import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CalendarCheck,
  Mail,
  MapPin,
  Phone,
  Radar,
  Sparkles,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Herobg from "../assets/Herobg.webp";
import Button from "../components/Button";
import Card from "../components/Card";
import { routes } from "../routes/routes";

const featureCards = [
  { icon: Phone, title: "AI call answering", text: "Answers every inbound call instantly." },
  { icon: Bot, title: "Lead capture", text: "Collects name, phone, and service in seconds." },
  { icon: CalendarCheck, title: "Booked jobs", text: "Turns missed calls into booked work." },
  { icon: Radar, title: "Never miss a lead", text: "Keeps the queue moving 24/7." },
];

const serviceCards = [
  { icon: Wrench, title: "Plumbing", text: "Emergency and routine service calls" },
  { icon: Sparkles, title: "Cleaning", text: "Recurring jobs and quick turnarounds" },
  { icon: Wrench, title: "Electrical", text: "Fast triage for urgent requests" },
  { icon: Sparkles, title: "Real estate", text: "Lead capture for listings and viewings" },
  { icon: Phone, title: "HVAC", text: "Seasonal service and dispatch follow-up" },
  { icon: CalendarCheck, title: "Auto repair", text: "Vehicle service and booking intake" },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span>PropertyPulse</span>
            <span className="text-[var(--color-accent)]">AI</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="rounded-[var(--radius-md)] px-3 py-2 text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
              onClick={() => navigate(routes.login)}
            >
              Sign in
            </button>
            <Button onClick={() => navigate(routes.signup)} variant="primary">
              Get started
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <span className="inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface-muted)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
              Missed calls → booked jobs
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-4xl font-semibold tracking-tight text-[var(--color-text)] md:text-6xl"
            >
              Turn missed calls into
              <span className="block text-[var(--color-accent)]">booked jobs.</span>
            </motion.h1>

            <p className="mt-6 max-w-xl text-base text-[var(--color-text-muted)] md:text-lg">
              PropertyPulse AI answers inbound calls, captures the lead, and helps service businesses turn missed opportunities into scheduled work.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button onClick={() => navigate(routes.signup)} variant="primary" className="gap-2">
                See how it works
                <ArrowRight size={16} />
              </Button>
              <Button onClick={() => navigate(routes.login)} variant="secondary">
                Sign in
              </Button>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-8 rounded-full bg-[var(--color-accent-soft)] blur-3xl" />
              <img src={Herobg} alt="AI assistant and business dashboard" className="relative z-10 w-full drop-shadow-[0_30px_50px_rgba(10,16,24,0.8)]" />
            </div>
          </motion.div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-8 md:py-16">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">What the system does</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)]">Calm, reliable intake for busy teams</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="p-5">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                  <Icon size={18} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text-muted)]">{text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-8 md:py-16">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Built for service businesses</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)]">From plumbing to property management</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {serviceCards.map(({ icon: Icon, title, text }) => (
              <Card key={title} className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] text-[var(--color-accent)]">
                    <Icon size={16} />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
                </div>
                <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">{text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-8 md:py-16">
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 md:p-8">
            <div className="mb-8 max-w-2xl">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Simple conversion loop</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text)]">Why service teams use it</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                "Answer faster than a missed call",
                "Capture the request before it disappears",
                "Move the inquiry into a booked job or callback",
              ].map((item, index) => (
                <div key={item} className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-5">
                  <div className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">0{index + 1}</div>
                  <p className="text-base leading-7 text-[var(--color-text)]">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:grid-cols-4">
          <div>
            <div className="text-lg font-semibold tracking-tight">
              PropertyPulse<span className="text-[var(--color-accent)]">AI</span>
            </div>
            <p className="mt-3 text-sm text-[var(--color-text-muted)]">AI receptionist and lead capture for service businesses.</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
              <li>AI answering</li>
              <li>Lead capture</li>
              <li>Bookings</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--color-text-muted)]">Contact</h3>
            <ul className="mt-3 space-y-3 text-sm text-[var(--color-text-muted)]">
              <li className="flex items-center gap-2"><Mail size={14} /> support@propertypulse.ai</li>
              <li className="flex items-center gap-2"><Phone size={14} /> +234 812 979 8526</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Global</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
