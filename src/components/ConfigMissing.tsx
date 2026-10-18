import { missingEnvVars } from "../lib/env";

export default function ConfigMissing() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full rounded-2xl border border-yellow-500/20 bg-white/5 p-8">
        <h1 className="text-xl font-bold">
          PropertyPulse <span className="text-yellow-400">AI</span>
        </h1>
        <p className="mt-3 text-sm text-gray-300">
          Firebase is not configured yet. Create a{" "}
          <code className="text-yellow-400">.env.local</code> file from{" "}
          <code className="text-yellow-400">.env.example</code>, replace the
          placeholders with your Firebase Web App values, and restart the dev
          server.
        </p>

        {missingEnvVars.length > 0 ? (
          <ul className="mt-4 space-y-1 text-sm text-gray-400">
            {missingEnvVars.map((name) => (
              <li key={name}>
                Missing <code className="text-yellow-400">{name}</code>
              </li>
            ))}
          </ul>
        ) : null}

        <p className="mt-6 text-xs text-gray-500">
          The landing page still works. Login, signup, and the dashboard need
          real Firebase keys.
        </p>
      </div>
    </div>
  );
}
