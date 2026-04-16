import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ middleware
app.use(cors());
app.use(express.json());

// ✅ health check
app.get("/", (req, res) => {
  res.send("AI Server is running 🚀");
});

// ✅ CHAT ROUTE (FREE AI)
app.post("/chat", async (req, res) => {
  console.log("📩 Incoming request:", req.body);

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const text = message.toLowerCase();

    let name = "";
    let phone = "";
    let service = "";

    // ✅ NAME DETECTION
    if (text.includes("name is")) {
      const parts = message.split("name is")[1]?.trim().split(" ");
      name = parts ? parts[0] : "";
    }

    // ✅ PHONE DETECTION
    const phoneMatch = message.match(/\d{7,}/);
    if (phoneMatch) phone = phoneMatch[0];

    // ✅ SERVICE DETECTION
    if (text.includes("plumbing")) service = "plumbing";
    else if (text.includes("cleaning")) service = "cleaning";
    else if (text.includes("real estate")) service = "real estate";

    let reply = "Hello! How can I assist you today?";

    if (name || phone || service) {
      reply = `Got it 👍 ${
        name ? "Name: " + name + ", " : ""
      }${phone ? "Phone: " + phone + ", " : ""}${
        service ? "Service: " + service : ""
      }`;

      // ✅ IF ALL DATA → SEND JSON (IMPORTANT)
      if (name && phone && service) {
        console.log("✅ Lead Captured:", { name, phone, service });

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
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "AI failed" });
  }
});

// ✅ start server
app.listen(5001, () => {
  console.log("🚀 AI Server running on http://localhost:5001");
});