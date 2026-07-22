import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Herobg from "../assets/Herobg.webp";
import ai from "../assets/ai.webp";
import Button from "../components/Button";
import { routes } from "../routes/routes";

import {
  Mail,
  MapPin,
  Bot,
  CalendarCheck,
  Wrench,
  Droplets,
  Sparkles,
  Radar,
  Phone,
} from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
        <h1 className="text-xl font-bold">
          PropertyPulse <span style={{ color: "#D4AF37" }}>AI</span>
        </h1>

        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate(routes.login)}
            className="text-sm text-gray-300 hover:text-white"
          >
            Sign In
          </button>

          <Button onClick={() => navigate(routes.signup)} variant="primary">
            Get Started
          </Button>
        </div>
      </div>

      {/* HERO */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-24 gap-12">

        <div className="flex-1 text-center md:text-left">

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold leading-tight"
          >
            Turn Missed Calls into{" "}
            <span style={{ color: "#D4AF37" }}>
              Booked Jobs Automatically
            </span> 
            
          </motion.h1>

          <p className="text-gray-400 mt-6 max-w-xl text-lg">
            We install a simple AI system that answers calls, captures leads,
            and books appointments automatically.
          </p>

          <div className="mt-6 flex items-center gap-4">
            <Button onClick={() => navigate(routes.signup)} variant="primary">
              See How It Works
            </Button>

            <span className="text-sm text-gray-500">
              Takes less than 10 minutes
            </span>
          </div>
        </div>

        {/* IMAGE */}
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="flex-1 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full"></div>

            <img
              src={Herobg}
              alt="AI Assistant"
              className="w-85 md:w-105 relative z-10 drop-shadow-2xl"
            />
          </div>
        </motion.div>
      </section>

      {/* FEATURES */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold">
          What the <span style={{ color: "#D4AF37" }}>System Does</span>
        </h2>

        <div className="grid md:grid-cols-4 gap-6 mt-12 max-w-6xl mx-auto">

          {[
            { icon: <Phone />, title: "AI Call Answering", desc: "Answers every call instantly." },
            { icon: <Bot />, title: "Lead Capture", desc: "Collects customer details automatically." },
            { icon: <CalendarCheck />, title: "Auto Booking", desc: "Schedules appointments instantly." },
            { icon: <Radar />, title: "24/7 Monitoring", desc: "Never misses a customer." },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white/5 border border-yellow-500/10 hover:scale-105 transition"
            >
              <div className="text-yellow-400 mb-3 flex justify-center">
                {item.icon}
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-400 text-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section className="text-center py-20 px-6">
        <h2 className="text-3xl font-bold">Built for Service Businesses</h2>

        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">

          {[
            { icon: <Wrench />, title: "Auto Repair", desc: "Mechanic automation." },
            { icon: <Droplets />, title: "Plumbing", desc: "Emergency call handling." },
            { icon: <Sparkles />, title: "Real Estate", desc: "Instant lead capture." },
            { icon: <Sparkles />, title: "Cleaning", desc: "Booking automation." },
            { icon: <Wrench />, title: "Electrical", desc: "Job scheduling." },
            { icon: <Radar />, title: "HVAC", desc: "Service automation." },
          ].map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-xl bg-white/5 border border-yellow-500/10"
            >
              <div className="text-yellow-400 mb-2 flex justify-center">
                {item.icon}
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-gray-400 text-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="text-center py-20 px-6">

        <h2 className="text-3xl font-bold">How It Works</h2>

        <div className="flex flex-col md:flex-row gap-6 justify-center mt-12 max-w-6xl mx-auto">

          {[
            {
              icon: <Phone className="text-yellow-400 w-6 h-6" />,
              title: "Connect Your Phone",
              desc: "Link your business number.",
            },
            {
              icon: <Bot className="text-yellow-400 w-6 h-6" />,
              title: "AI Answers Calls",
              desc: "Instant receptionist system.",
            },
            {
              icon: <CalendarCheck className="text-yellow-400 w-6 h-6" />,
              title: "Jobs Are Booked",
              desc: "Automatic scheduling.",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="flex-1 p-6 rounded-2xl bg-white/5 border border-yellow-500/10"
            >
              <div className="mb-3 flex justify-center">{step.icon}</div>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-gray-400 text-sm mt-2">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI DEMO */}
<section className="text-center py-24 px-6">

  <h2 className="text-3xl font-bold">
    See the <span style={{ color: "#D4AF37" }}>AI in Action</span>
  </h2>
  <br /><br />

      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 3 }}
        className="flex-1 flex justify-center"
      >
        <div className="relative w-full">
          <div className="absolute inset-0 bg-yellow-500/10 blur-3xl rounded-full"></div>

          <img
            src={ai}
            alt="AI Assistant"
            className="w-full max-w-250 relative z-10 drop-shadow-2xl mx-auto"
          />
        </div>
      </motion.div>
</section>


      {/* CTA */}
      <section className="text-center py-28 px-6">

        <h2 className="text-4xl font-bold">
          Never Miss Another Customer Call
        </h2>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          AI handles everything while you focus on growth.
        </p>

        <Button onClick={() => navigate(routes.signup)} variant="primary" className="mt-8">
          Get Started
        </Button>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 mt-20 px-6 py-16">

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">

          <div>
            <h2 className="text-xl font-bold">
              PropertyPulse <span style={{ color: "#D4AF37" }}>AI</span>
            </h2>
            <p className="text-gray-400 text-sm mt-3">
              AI receptionist system for service businesses.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Product</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Features</li>
              <li>How it works</li>
              <li>AI Demo</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Contact</h3>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Mail size={16} /> support@propertypulse.ai
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
              <Phone size={16} /> +234 812 979 8526
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400 mt-2">
              <MapPin size={16} /> Global
            </div>
          </div>

        </div>

        <div className="text-center text-gray-500 text-sm mt-12 border-t border-white/10 pt-6">
          © {new Date().getFullYear()} PropertyPulse AI
        </div>

      </footer>

    </div>
  );
}