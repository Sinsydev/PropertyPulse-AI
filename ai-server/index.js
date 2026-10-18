import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

dotenv.config();

const TWILIO_WEBHOOK_URL = process.env.TWILIO_WEBHOOK_URL ?? "";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN ?? "";
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const readServiceAccount = () => {
  const json = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!json) {
    return null;
  }

  try {
    return JSON.parse(json);
  } catch (error) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON must contain valid JSON", {
      cause: error,
    });
  }
};

const initializeFirestore = () => {
  const serviceAccount = readServiceAccount();
  const projectId =
    process.env.FIREBASE_PROJECT_ID?.trim() ||
    process.env.GOOGLE_CLOUD_PROJECT?.trim() ||
    serviceAccount?.project_id;

  const options = serviceAccount
    ? { credential: cert(serviceAccount), projectId }
    : { credential: applicationDefault(), projectId };
  const app =
    getApps()[0] ??
    initializeApp(options);

  return getFirestore(app);
};

const db = null;

const getWebhookUrls = (webhookUrl) => {
  if (!webhookUrl) {
    throw new Error("Missing required environment variable: TWILIO_WEBHOOK_URL");
  }

  const processSpeechUrl = new URL(webhookUrl);
  if (!/\/process-speech\/?$/.test(processSpeechUrl.pathname)) {
    throw new Error("TWILIO_WEBHOOK_URL must end with /process-speech");
  }

  const voiceUrl = new URL(processSpeechUrl);
  voiceUrl.pathname = processSpeechUrl.pathname.replace(
    /\/process-speech\/?$/,
    "/voice"
  );

  return {
    processSpeech: processSpeechUrl.toString(),
    voice: voiceUrl.toString(),
  };
};

const normalizePhoneNumber = (value = "") =>
  String(value).replace(/\D/g, "");

const getPhoneNumberCandidates = (value) => {
  const raw = String(value ?? "").trim();
  const digits = normalizePhoneNumber(raw);

  return [...new Set([raw, digits, digits ? `+${digits}` : ""].filter(Boolean))];
};

const normalizeService = (service = "") => {
  const text = String(service).toLowerCase().trim();

  if (!text) return "";

  const serviceCategories = [
    ["plumbing", ["plumbing", "plumber", "pipe", "pipes", "water heater", "leak"]],
    ["cleaning", ["cleaning", "cleaner", "house cleaning", "maid", "deep clean"]],
    ["real estate", ["real estate", "property management", "listing", "rental", "tenant"]],
    ["hvac", ["hvac", "heating", "air conditioning", "air conditioner", " ac "]],
    ["electrical", ["electrical", "electrician", "wiring"]],
  ];

  for (const [category, keywords] of serviceCategories) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category;
    }
  }

  const requestedService = text.match(
    /(?:i need|i need help with|i want|i'm calling about|calling about|service is)\s+(?:a|an|the)?\s*([^,.!?]+?)(?=\s+(?:and my name|and my phone|my name|my phone|my number)\b|[,.;!?]|$)/i
  );

  return requestedService?.[1]?.trim() ?? "";
};

const extractLeadFromSpeech = (speech = "") => {
  const text = String(speech).trim();
  const namePatterns = [
    /(?:my name is|name is|this is|i am)\s+(.+?)(?=\s+(?:and my|my phone|my number|i need|i want|i'm calling|calling about)\b|[,.;!?]|$)/i,
  ];

  let name = "";
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      name = match[1].trim().replace(/[,.!?;]+$/, "");
      break;
    }
  }

  const phoneMatch = text.match(
    /(?:\+?\d[\d\s().-]{5,}\d)/
  );
  const phone = phoneMatch ? normalizePhoneNumber(phoneMatch[0]) : "";

  return {
    name,
    phone: phone.length >= 7 ? phone : "",
    service: normalizeService(text),
  };
};

const getUniqueBusinessMatch = async (firestore, field, candidates) => {
  const snapshot = await firestore
    .collection("businesses")
    .where(field, "in", candidates)
    .limit(2)
    .get();

  if (snapshot.size > 1) {
    throw new Error(`Multiple businesses are mapped to the same inbound ${field}`);
  }

  if (snapshot.empty) {
    return null;
  }

  const document = snapshot.docs[0];
  return { id: document.id, ...document.data() };
};

const findBusinessByInboundNumber = async (inboundNumber, firestore = db) => {
  if (!firestore) {
    throw new Error("Firebase Admin Firestore is not configured");
  }

  const candidates = getPhoneNumberCandidates(inboundNumber);
  if (!candidates.length) {
    return null;
  }

  const twilioNumberMatch = await getUniqueBusinessMatch(
    firestore,
    "twilioNumber",
    candidates
  );
  if (twilioNumberMatch) {
    return twilioNumberMatch;
  }

  return getUniqueBusinessMatch(firestore, "phone", candidates);
};

const formatE164Phone = (value = "") => {
  const digits = normalizePhoneNumber(value);

  if (!digits) {
    return "";
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+1${digits}`;
  }

  return `+${digits}`;
};

const formatDisplayPhone = (value = "") => {
  const digits = normalizePhoneNumber(value);

  if (!digits) {
    return "phone unavailable";
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }

  if (digits.length >= 10) {
    return digits.slice(-10);
  }

  return digits;
};

const buildLeadNotificationMessage = (
  business = {},
  lead = {},
  dashboardUrl = "https://example.com/dashboard"
) => {
  const businessName = String(business.businessName ?? "Your business").trim() || "Your business";
  const leadName = String(lead.name ?? "Customer").trim() || "Customer";
  const leadPhone = formatDisplayPhone(lead.phone ?? "");
  const service = String(lead.service ?? "service request").trim().toLowerCase() || "service request";

  return `New lead for ${businessName}: ${leadName} (${leadPhone}) - ${service}. Review in your dashboard: ${dashboardUrl}`;
};

const notifyBusinessOfLead = async ({
  business,
  lead,
  twilioClient,
  fromNumber,
  dashboardUrl = "https://example.com/dashboard",
} = {}) => {
  const targetPhone = business?.phone ? formatE164Phone(business.phone) : "";

  if (!targetPhone || !fromNumber || !twilioClient || !twilioClient.messages?.create) {
    return false;
  }

  const result = await twilioClient.messages.create({
    to: targetPhone,
    from: fromNumber,
    body: buildLeadNotificationMessage(business, lead, dashboardUrl),
  });

  return Boolean(result?.sid);
};

const createLeadForBusiness = async (businessId, lead, firestore = db) => {
  if (!firestore) {
    throw new Error("Firebase Admin Firestore is not configured");
  }
  if (typeof businessId !== "string" || !businessId.trim()) {
    throw new Error("Business ID is required to create a lead");
  }

  const normalizedLead = {
    name: String(lead.name ?? "").trim(),
    phone: normalizePhoneNumber(lead.phone ?? ""),
    service: String(lead.service ?? "").trim().toLowerCase(),
    businessId: businessId.trim(),
    status: "new",
  };

  if (
    !normalizedLead.name ||
    normalizedLead.phone.length < 7 ||
    !normalizedLead.service
  ) {
    throw new Error("Name, valid phone number, and service are required to create a lead");
  }

  const result = await firestore.collection("leads").add({
    ...normalizedLead,
    createdAt: new Date(),
  });

  return result.id;
};

const createTwilioSignatureValidator = ({ authToken, urls }) => {
  if (!authToken) {
    throw new Error("Missing required environment variable: TWILIO_AUTH_TOKEN");
  }

  return (req, route) => {
    const signature = req.get("X-Twilio-Signature");
    const url = urls[route];

    return Boolean(
      signature &&
        twilio.validateRequest(authToken, signature, url, req.body)
    );
  };
};

const createApp = ({
  firestore = db,
  webhookUrl = TWILIO_WEBHOOK_URL,
  authToken = TWILIO_AUTH_TOKEN,
  validateTwilioRequest,
} = {}) => {
  const webhookUrls = getWebhookUrls(webhookUrl);
  const validateSignature =
    validateTwilioRequest ??
    createTwilioSignatureValidator({ authToken, urls: webhookUrls });
  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  app.get("/", (req, res) => {
    res.send("AI Server is running");
  });

  app.post("/chat", async (req, res) => {
    try {
      const { message } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const lead = extractLeadFromSpeech(message);
      let reply = "Hello! How can I assist you today?";

      if (lead.name || lead.phone || lead.service) {
        reply = `Got it 👍 ${
          lead.name ? `Name: ${lead.name}, ` : ""
        }${lead.phone ? `Phone: ${lead.phone}, ` : ""}${
          lead.service ? `Service: ${lead.service}` : ""
        }`;
      }

      if (lead.name && lead.phone && lead.service) {
        reply = JSON.stringify(lead);
      }

      return res.json({ reply });
    } catch (error) {
      console.error("CHAT ERROR:", error);
      return res.status(500).json({ error: "AI failed" });
    }
  });

  app.post("/voice", (req, res) => {
    if (!validateSignature(req, "voice")) {
      return res.status(403).type("text/plain").send("Invalid Twilio signature");
    }

    const twiml = new twilio.twiml.VoiceResponse();
    twiml.say("Hello. Welcome to Property Pulse AI Receptionist.");
    twiml.pause({ length: 1 });
    twiml.gather({
      input: "speech",
      action: webhookUrls.processSpeech,
      method: "POST",
      speechTimeout: "auto",
    }).say("Please say your name, phone number, and service you need.");

    return res.type("text/xml").send(twiml.toString());
  });

  app.post("/process-speech", async (req, res) => {
    if (!validateSignature(req, "processSpeech")) {
      return res.status(403).type("text/plain").send("Invalid Twilio signature");
    }

    const twiml = new twilio.twiml.VoiceResponse();
    const speech = req.body.SpeechResult ?? "";
    const inboundNumber = req.body.To ?? req.body.Called ?? "";

    try {
      if (!firestore) {
        throw new Error("Firebase Admin Firestore is not configured");
      }

      const lead = extractLeadFromSpeech(speech);
      if (!lead.name || !lead.phone || !lead.service) {
        twiml.say("Sorry. I could not capture all your details. Please try again.");
        return res.type("text/xml").send(twiml.toString());
      }

      if (!inboundNumber) {
        console.warn("Twilio request did not include the called business number");
        twiml.say("Sorry. I could not match this call to a business profile.");
        return res.type("text/xml").send(twiml.toString());
      }

      const business = await findBusinessByInboundNumber(inboundNumber, firestore);
      if (!business) {
        console.warn("No business mapped for inbound number:", inboundNumber);
        twiml.say("Sorry. I could not match this call to a business profile.");
        return res.type("text/xml").send(twiml.toString());
      }

      const leadId = await createLeadForBusiness(business.id, lead, firestore);
      const twilioClient =
        process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN
          ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
          : null;
      const notificationSent = await notifyBusinessOfLead({
        business,
        lead,
        twilioClient,
        fromNumber:
          process.env.TWILIO_FROM_NUMBER || process.env.TWILIO_PHONE_NUMBER || "",
        dashboardUrl: process.env.APP_URL || "https://example.com/dashboard",
      });

      console.info("Lead captured from inbound call:", {
        businessId: business.id,
        leadId,
        notificationSent,
      });
      twiml.say("Thank you. Your request has been received successfully.");
      return res.type("text/xml").send(twiml.toString());
    } catch (error) {
      console.error("Inbound lead capture failed:", error);
      twiml.say("Sorry. We could not save your request right now. Please try again later.");
      return res.status(503).type("text/xml").send(twiml.toString());
    }
  });

  return app;
};

export {
  buildLeadNotificationMessage,
  createApp,
  createLeadForBusiness,
  createTwilioSignatureValidator,
  extractLeadFromSpeech,
  findBusinessByInboundNumber,
  getPhoneNumberCandidates,
  normalizePhoneNumber,
  notifyBusinessOfLead,
};

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const urls = getWebhookUrls(TWILIO_WEBHOOK_URL);
  const validateSignature = createTwilioSignatureValidator({
    authToken: TWILIO_AUTH_TOKEN,
    urls,
  });
  const firestore = initializeFirestore();

  createApp({
    firestore,
    webhookUrl: TWILIO_WEBHOOK_URL,
    authToken: TWILIO_AUTH_TOKEN,
    validateTwilioRequest: validateSignature,
  }).listen(5001, () => {
    console.log("AI Server running on http://localhost:5001");
  });
}
