interface EnvConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  ai: {
    baseUrl: string;
  };
}

const FIREBASE_ENV_VARS = [
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_STORAGE_BUCKET",
  "VITE_FIREBASE_MESSAGING_SENDER_ID",
  "VITE_FIREBASE_APP_ID",
] as const;

const OPTIONAL_ENV_VARS = ["VITE_AI_BASE_URL"] as const;

function readEnv(name: string): string {
  const value = import.meta.env[name];
  return typeof value === "string" ? value.trim() : "";
}

function isPlaceholderValue(value: string): boolean {
  if (!value) {
    return true;
  }

  const normalized = value.toLowerCase();

  return (
    normalized.startsWith("your_") ||
    normalized.includes("your_project") ||
    normalized.includes("your_firebase") ||
    normalized.includes("your_sender") ||
    normalized.includes("your_app")
  );
}

export const missingEnvVars: string[] = [
  ...FIREBASE_ENV_VARS.filter((name) => isPlaceholderValue(readEnv(name))),
  ...OPTIONAL_ENV_VARS.filter((name) => !readEnv(name)),
];

export const isEnvConfigured = FIREBASE_ENV_VARS.every(
  (name) => !isPlaceholderValue(readEnv(name))
);

export const env: EnvConfig = {
  firebase: {
    apiKey: readEnv("VITE_FIREBASE_API_KEY"),
    authDomain: readEnv("VITE_FIREBASE_AUTH_DOMAIN"),
    projectId: readEnv("VITE_FIREBASE_PROJECT_ID"),
    storageBucket: readEnv("VITE_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readEnv("VITE_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readEnv("VITE_FIREBASE_APP_ID"),
  },
  ai: {
    baseUrl: readEnv("VITE_AI_BASE_URL") || "http://localhost:5001/chat",
  },
};
