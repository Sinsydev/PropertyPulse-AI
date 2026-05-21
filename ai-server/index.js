import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";

dotenv.config();

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());

// IMPORTANT FOR TWILIO WEBHOOKS
app.use(express.urlencoded({ extended: false }));

// =========================
// HEALTH CHECK
// =========================

app.get("/", (req, res) => {
  res.send("AI Server is running 🚀");
});

// =========================
// FREE AI CHAT ROUTE
// =========================

app.post("/chat", async (req, res) => {
  console.log("📩 Incoming request:", req.body);

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const text = message.toLowerCase();

    let name = "";
    let phone = "";
    let service = "";

    // =========================
    // NAME DETECTION
    // =========================

    if (text.includes("name is")) {
      const parts = message
        .split("name is")[1]
        ?.trim()
        .split(" ");

      name = parts ? parts[0] : "";
    }

    // =========================
    // PHONE DETECTION
    // =========================

    const phoneMatch = message.match(/\d{7,}/);

    if (phoneMatch) {
      phone = phoneMatch[0];
    }

    // =========================
    // SERVICE DETECTION
    // =========================

    if (text.includes("plumbing")) {
      service = "plumbing";
    } else if (text.includes("cleaning")) {
      service = "cleaning";
    } else if (text.includes("real estate")) {
      service = "real estate";
    }

    // =========================
    // AI RESPONSE
    // =========================

    let reply = "Hello! How can I assist you today?";

    if (name || phone || service) {
      reply = `Got it 👍 ${
        name ? "Name: " + name + ", " : ""
      }${phone ? "Phone: " + phone + ", " : ""}${
        service ? "Service: " + service : ""
      }`;

      // FULL LEAD CAPTURED
      if (name && phone && service) {
        console.log("✅ Lead Captured:", {
          name,
          phone,
          service,
        });

        return res.json({
          reply: JSON.stringify({
            name,
            phone,
            service,
          }),
        });
      }
    }

    res.json({ reply });

  } catch (err) {
    console.error("❌ CHAT ERROR:", err);

    res.status(500).json({
      error: "AI failed",
    });
  }
});

// =========================
// TWILIO VOICE ROUTE
// =========================

app.post("/voice", (req, res) => {
  console.log("📞 Incoming phone call");

  const twiml = new twilio.twiml.VoiceResponse();

  // AI GREETING
  twiml.say(
    "Hello. Welcome to Property Pulse AI Receptionist."
  );

  twiml.pause({
    length: 1,
  });

  // AI LISTENS HERE
    twiml.gather({
    input: "speech",
    action: "https://subprime-shock-duty.ngrok-free.dev/process-speech",
    method: "POST",
    speechTimeout: "auto",
  }).say(
    "Please say your name, phone number, and service you need."
  );

  res.type("text/xml");
  res.send(twiml.toString());
});

// =========================
// PROCESS CALLER SPEECH
// =========================

app.post("/process-speech", (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();

  const speech = req.body.SpeechResult || "";

  console.log("🧠 Caller said:", speech);

  const text = speech.toLowerCase();

  let name = "";
  let phone = "";
  let service = "";

  // =========================
  // DETECT NAME
  // =========================

  if (text.includes("name is")) {
    const parts = speech
      .split("name is")[1]
      ?.trim()
      .split(" ");

    name = parts ? parts[0] : "";
  }

  // =========================
  // DETECT PHONE
  // =========================

  const phoneMatch = speech.match(/\d{7,}/);

  if (phoneMatch) {
    phone = phoneMatch[0];
  }

  // =========================
  // DETECT SERVICE
  // =========================

  if (text.includes("plumbing")) {
    service = "plumbing";
  } else if (text.includes("cleaning")) {
    service = "cleaning";
  } else if (text.includes("real estate")) {
    service = "real estate";
  }

  console.log("📊 Extracted:", {
    name,
    phone,
    service,
  });

  // =========================
  // RESPONSE
  // =========================

  if (name && phone && service) {
    console.log("✅ Lead From Call:", {
      name,
      phone,
      service,
    });

    twiml.say(
      "Thank you. Your request has been received successfully."
    );
  } else {
    twiml.say(
      "Sorry. I could not capture all your details. Please try again."
    );
  }

  res.type("text/xml");
  res.send(twiml.toString());
});

// =========================
// START SERVER
// =========================

app.listen(5001, () => {
  console.log(
    "🚀 AI Server running on http://localhost:5001"
  );
});