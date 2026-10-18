import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { after, before, test } from "node:test";
import { createServer } from "node:http";
import {
  buildLeadNotificationMessage,
  createApp,
  createLeadForBusiness,
  createTwilioSignatureValidator,
  extractLeadFromSpeech,
  findBusinessByInboundNumber,
  notifyBusinessOfLead,
} from "./index.js";

const businessDocuments = [
  {
    id: "business-1",
    data: () => ({
      businessName: "Acme Plumbing",
      phone: "15550001111",
      twilioNumber: "15551234567",
    }),
  },
];

const createMockFirestore = (documents = businessDocuments) => {
  const leads = [];

  return {
    leads,
    collection(name) {
      if (name === "leads") {
        return {
          add: async (lead) => {
            leads.push(lead);
            return { id: `lead-${leads.length}` };
          },
        };
      }

      return {
        where(field, operator, candidates) {
          assert.equal(operator, "in");
          return {
            limit() {
              return {
                get: async () => {
                  const matches = documents.filter((document) =>
                    candidates.includes(document.data()[field])
                  );
                  return {
                    docs: matches,
                    empty: matches.length === 0,
                    size: matches.length,
                  };
                },
              };
            },
          };
        },
      };
    },
  };
};

let server;
let baseUrl;
let routeFirestore;

before(async () => {
  routeFirestore = createMockFirestore();
  server = createServer(
    createApp({
      firestore: routeFirestore,
      webhookUrl: "https://voice.example.test/process-speech",
      validateTwilioRequest: () => true,
    })
  );
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) =>
    server.close((error) => (error ? reject(error) : resolve()))
  );
});

test("extracts complete call details from a natural spoken response", () => {
  assert.deepEqual(
    extractLeadFromSpeech(
      "My name is Jane Doe. My phone number is +1 (555) 123-4567. I need plumbing."
    ),
    {
      name: "Jane Doe",
      phone: "15551234567",
      service: "plumbing",
    }
  );
});

test("does not infer a service from unrelated speech", () => {
  assert.equal(extractLeadFromSpeech("I am calling today.").service, "");
});

test("builds a concise business notification for a new lead", () => {
  assert.equal(
    buildLeadNotificationMessage(
      { businessName: "Acme Plumbing", phone: "15550001111" },
      { name: "Jane Doe", phone: "15551234567", service: "Plumbing" }
    ),
    "New lead for Acme Plumbing: Jane Doe (5551234567) - plumbing. Review in your dashboard: https://example.com/dashboard"
  );
});

test("sends an SMS to the business phone when a lead is created", async () => {
  const calls = [];
  const sent = await notifyBusinessOfLead({
    business: { businessName: "Acme Plumbing", phone: "+1 (555) 000-1111" },
    lead: { name: "Jane Doe", phone: "5551234567", service: "Plumbing" },
    twilioClient: {
      messages: {
        create: async (payload) => {
          calls.push(payload);
          return { sid: "SM-test" };
        },
      },
    },
    fromNumber: "+15550002222",
    dashboardUrl: "https://example.com/dashboard",
  });

  assert.equal(sent, true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].to, "+15550001111");
  assert.equal(calls[0].from, "+15550002222");
  assert.match(calls[0].body, /Acme Plumbing/);
});

test("routes by Twilio number and creates a dashboard-compatible new lead", async () => {
  const firestore = createMockFirestore();
  const business = await findBusinessByInboundNumber(
    "+1 (555) 123-4567",
    firestore
  );
  assert.equal(business.id, "business-1");

  const leadId = await createLeadForBusiness(
    business.id,
    {
      name: "Jane Doe",
      phone: "+1 (555) 123-4567",
      service: "Plumbing",
    },
    firestore
  );

  assert.equal(leadId, "lead-1");
  assert.deepEqual(
    {
      ...firestore.leads[0],
      createdAt: undefined,
    },
    {
      name: "Jane Doe",
      phone: "15551234567",
      service: "plumbing",
      businessId: "business-1",
      status: "new",
      createdAt: undefined,
    }
  );
  assert.ok(firestore.leads[0].createdAt instanceof Date);
});

test("voice webhook sends speech collection to the process-speech route", async () => {
  const response = await fetch(`${baseUrl}/voice`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(),
  });

  assert.equal(response.status, 200);
  const twiml = await response.text();
  assert.match(twiml, /<Gather/);
  assert.match(twiml, /https:\/\/voice\.example\.test\/process-speech/);
});

test("Twilio speech webhook creates a lead for the called business number", async () => {
  const response = await fetch(`${baseUrl}/process-speech`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      To: "+15551234567",
      From: "+15559876543",
      SpeechResult:
        "My name is Jane Doe. My phone number is +1 (555) 123-4567. I need plumbing.",
    }),
  });

  assert.equal(response.status, 200);
  assert.match(await response.text(), /received successfully/i);
  assert.equal(routeFirestore.leads.length, 1);
  assert.equal(routeFirestore.leads[0].businessId, "business-1");
  assert.equal(routeFirestore.leads[0].status, "new");
});

test("does not create a lead when capture details are incomplete", async () => {
  const response = await fetch(`${baseUrl}/process-speech`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      To: "+15551234567",
      From: "+15559876543",
      SpeechResult: "My name is Jane Doe and I need help.",
    }),
  });

  assert.equal(response.status, 200);
  assert.match(await response.text(), /could not capture all your details/i);
  assert.equal(routeFirestore.leads.length, 1);
});

test("does not treat the caller number as the called business number", async () => {
  const response = await fetch(`${baseUrl}/process-speech`, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      From: "+15551234567",
      SpeechResult:
        "My name is Jane Doe. My phone number is 5551234567. I need plumbing.",
    }),
  });

  assert.equal(response.status, 200);
  assert.match(await response.text(), /could not match this call to a business/i);
  assert.equal(routeFirestore.leads.length, 1);
});

test("rejects webhook requests with an invalid Twilio signature", async (t) => {
  const rejectedServer = createServer(
    createApp({
      firestore: routeFirestore,
      webhookUrl: "https://voice.example.test/process-speech",
      validateTwilioRequest: () => false,
    })
  );
  await new Promise((resolve) =>
    rejectedServer.listen(0, "127.0.0.1", resolve)
  );
  t.after(
    () =>
      new Promise((resolve, reject) =>
        rejectedServer.close((error) => (error ? reject(error) : resolve()))
      )
  );

  const response = await fetch(
    `http://127.0.0.1:${rejectedServer.address().port}/process-speech`,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        To: "+15551234567",
        SpeechResult:
          "My name is Jane Doe. My phone number is 5551234567. I need plumbing.",
      }),
    }
  );

  assert.equal(response.status, 403);
  assert.match(await response.text(), /invalid twilio signature/i);
  assert.equal(routeFirestore.leads.length, 1);
});

test("accepts a valid Twilio signature for the configured webhook URL", () => {
  const url = "https://voice.example.test/process-speech";
  const authToken = "test-auth-token";
  const params = {
    To: "+15551234567",
    SpeechResult: "My name is Jane Doe",
  };
  const signedValues = Object.keys(params)
    .sort()
    .map((key) => `${key}${params[key]}`)
    .join("");
  const signature = createHmac("sha1", authToken)
    .update(`${url}${signedValues}`)
    .digest("base64");
  const validateRequest = createTwilioSignatureValidator({
    authToken,
    urls: {
      processSpeech: url,
      voice: "https://voice.example.test/voice",
    },
  });

  assert.equal(
    validateRequest(
      {
        get: () => signature,
        body: params,
      },
      "processSpeech"
    ),
    true
  );
});
