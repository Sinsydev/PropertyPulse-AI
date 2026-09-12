 import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";
import Onboarding from "../pages/Onboarding";
import ProtectedRoute from "../components/ProtectedRoute";
import { routes } from "./routes";

const routeLabels: Record<string, string> = {
  [routes.home]: "Home",
  [routes.login]: "Login",
  [routes.signup]: "Sign up",
  [routes.dashboard]: "Dashboard",
  [routes.onboarding]: "Onboarding",
};

function RouteCheck() {
  const location = useLocation();
  const currentLabel = routeLabels[location.pathname] ?? "Unknown page";

  useEffect(() => {
    const destination = `${currentLabel} (${location.pathname})`;
    document.title = `PropertyPulse AI • ${currentLabel}`;
    console.info(`[Route Check] Heading to: ${destination}`);
  }, [currentLabel, location.pathname]);

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        background: "rgba(15, 23, 42, 0.9)",
        color: "#f8fafc",
        padding: "8px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 0.2,
        boxShadow: "0 10px 25px rgba(15, 23, 42, 0.2)",
        border: "1px solid rgba(148, 163, 184, 0.3)",
      }}
    >
      Route Check: {destinationToText(currentLabel, location.pathname)}
    </div>
  );
}

function destinationToText(label: string, pathname: string) {
  return `${label} (${pathname})`;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <RouteCheck />
      <Routes>
        <Route path={routes.home} element={<Landing />} />
        <Route path={routes.login} element={<Login />} />
        <Route path={routes.signup} element={<Signup />} />
        <Route
          path={routes.dashboard}
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path={routes.onboarding}
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}