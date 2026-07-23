import { env } from "../lib/env";

export const askAI = async (message: string) => {
  const res = await fetch(env.ai.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  return res.json();
};