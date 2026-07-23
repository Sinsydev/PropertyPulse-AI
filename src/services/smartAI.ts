import { env } from "../lib/env";

export interface AIReply {
  reply: string;
}

export const askAI = async (message: string): Promise<AIReply> => {
  const res = await fetch(env.ai.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    throw new Error("AI service unavailable");
  }

  const data = await res.json();

  if (typeof data?.reply !== "string" || !data.reply.trim()) {
    throw new Error("AI service returned an invalid response");
  }

  return data as AIReply;
};