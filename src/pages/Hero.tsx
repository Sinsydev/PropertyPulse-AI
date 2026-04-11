export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* NAV */}
      <div className="flex justify-between items-center px-8 py-6 border-b border-gray-900">
        <h1 className="text-xl font-bold">
          PropertyPulse <span className="text-green-400">AI</span>
        </h1>

        <a href="/login" className="text-gray-300 hover:text-white">
          Login
        </a>
      </div>

      {/* HERO */}
      <div className="flex flex-col items-center justify-center flex-1 text-center px-6">

        <h2 className="text-5xl font-bold leading-tight max-w-3xl">
          Never Miss a Property Call Again with AI Voice Reception
        </h2>

        <p className="text-gray-400 mt-6 max-w-2xl">
          AutoReception answers real estate calls 24/7, qualifies buyers,
          and books property viewings automatically — so you never lose a lead again.
        </p>

        <div className="mt-8 flex gap-4">
          <button className="bg-green-500 px-6 py-3 rounded-xl font-semibold">
            Get Started
          </button>

          <button className="border border-gray-700 px-6 py-3 rounded-xl">
            Book Demo
          </button>
        </div>

        {/* TRUST LINE */}
        <p className="text-gray-600 mt-10 text-sm">
          Built for real estate agencies • Powered by AI voice agents
        </p>

      </div>

    </div>
  );
}