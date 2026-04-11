import { motion } from "framer-motion";
import Herobg from "../assets/Herobg.webp";

import {
  Phone,
  Bot,
  CalendarCheck,
  Wrench,
  Droplets,
  Sparkles,
  Radar,
  CheckCircle,
  PhoneCall,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="bg-black text-white min-h-screen">

      {/* NAVBAR */}
      <div className="flex justify-between items-center px-6 py-5 border-b border-white/10">
        <h1 className="text-xl font-bold">
          PropertyPulse <span style={{ color: "#D4AF37" }}>AI</span>
        </h1>

        <div className="flex gap-4 items-center">
          <button className="text-sm text-gray-300 hover:text-white">
            Sign In
          </button>

          <button
            className="px-4 py-2 rounded-lg text-black font-semibold"
            style={{
              background: "linear-gradient(135deg,#D4AF37,#f5d76e)",
            }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* HERO */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-24 gap-12">

        {/* LEFT */}
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
            <button
              className="px-6 py-3 rounded-xl font-semibold"
              style={{
                background: "linear-gradient(135deg,#D4AF37,#f5d76e)",
                color: "black",
              }}
            >
              See How It Works
            </button>

            <span className="text-sm text-gray-500">
              Takes less than 10 minutes
            </span>
          </div>
        </div>

        {/* RIGHT IMAGE */}
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
              className="w-[340px] md:w-[420px] relative z-10 drop-shadow-2xl"
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

        <h2 className="text-3xl font-bold">
          Built for Service Businesses
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">

          {[
            { icon: <Wrench />, title: "Auto Repair", desc: "Mechanic & garage automation." },
            { icon: <Droplets />, title: "Plumbing", desc: "Emergency call handling." },
            { icon: <Sparkles />, title: "Real Estate", desc: "Instant property lead capture." },
            { icon: <Sparkles />, title: "Cleaning Services", desc: "Home & office bookings." },
            { icon: <Wrench />, title: "Electrical", desc: "Electrician job scheduling." },
            { icon: <Radar />, title: "HVAC Services", desc: "AC & heating automation." },
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
              desc: "We link your business number to AI system.",
            },
            {
              icon: <Bot className="text-yellow-400 w-6 h-6" />,
              title: "AI Answers Calls",
              desc: "AI responds instantly like a receptionist.",
            },
            {
              icon: <CalendarCheck className="text-yellow-400 w-6 h-6" />,
              title: "Jobs Are Booked",
              desc: "Appointments are automatically scheduled.",
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

      {/* AI DEMO SECTION */}
      <section className="text-center py-24 px-6">

        <h2 className="text-3xl font-bold">
          See the <span style={{ color: "#D4AF37" }}>AI in Action</span>
        </h2>

        <p className="text-gray-400 mt-3">
          Real-time simulation of your AI receptionist handling calls.
        </p>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="mt-12 max-w-xl mx-auto p-6 rounded-2xl bg-white/5 border border-yellow-500/20"
        >

          <div className="flex items-center gap-3 mb-4">
            <PhoneCall className="text-yellow-400" />
            <p className="text-sm text-gray-300">Incoming Call...</p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Bot className="text-yellow-400" />
            <p className="text-sm text-gray-300">
              AI: “Hello! How can I help you today?”
            </p>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <Bot className="text-yellow-400 animate-pulse" />
            <p className="text-sm text-gray-300">
              AI is analyzing request...
            </p>
          </div>

          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-400" />
            <p className="text-sm text-gray-300">
              Appointment booked successfully!
            </p>
          </div>

        </motion.div>
      </section>

      {/* CTA */}
      <section className="text-center py-28 px-6">

        <h2 className="text-4xl font-bold">
          Never Miss Another Customer Call
        </h2>

        <p className="text-gray-400 mt-4 max-w-xl mx-auto">
          Your AI receptionist handles everything while you focus on growing your business.
        </p>

        <button
          className="mt-8 px-6 py-3 rounded-xl font-semibold"
          style={{
            background: "linear-gradient(135deg,#D4AF37,#f5d76e)",
            color: "black",
          }}
        >
          Get Started
        </button>
      </section>

    </div>
  );
}