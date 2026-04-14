type AIState = {
  step: "start" | "name" | "phone" | "service" | "done";
  name?: string;
  phone?: string;
};

const state: AIState = {
  step: "start",
};

export const handleAI = (message: string) => {
  if (state.step === "start") {
    state.step = "name";
    return "Hello! Welcome to PropertyPulse AI. What is your name?";
  }

  if (state.step === "name") {
    state.name = message;
    state.step = "phone";
    return "Great! Please provide your phone number.";
  }

  if (state.step === "phone") {
    state.phone = message;
    state.step = "service";
    return "What service do you need?";
  }

  if (state.step === "service") {
    const service = message;

    state.step = "done";

    return {
      text: "Thank you! Your appointment has been booked.",
      lead: {
        name: state.name || "",
        phone: state.phone || "",
        service,
        status: "new",
      },
    };
  }

  return "Conversation ended.";
};