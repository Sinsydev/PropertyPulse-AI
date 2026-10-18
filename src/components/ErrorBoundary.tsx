import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  message: string | null;
};

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    message: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      message: error.message || "The app failed to load.",
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App render error:", error, info.componentStack);
  }

  render() {
    if (this.state.message) {
      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
          <div className="max-w-md w-full rounded-2xl border border-white/10 bg-white/5 p-8">
            <h1 className="text-xl font-bold">PropertyPulse AI could not load</h1>
            <p className="mt-3 text-sm text-red-400">{this.state.message}</p>
            <p className="mt-4 text-sm text-gray-400">
              Copy <code className="text-yellow-400">.env.example</code> to{" "}
              <code className="text-yellow-400">.env</code>, add your Firebase
              keys, then restart <code className="text-yellow-400">npm run dev</code>.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
