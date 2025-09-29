import { Navigate, useLocation } from "react-router-dom";
import { useHub } from "@/contexts/HubContext";

export default function HubGate({ children }: { children: React.ReactNode }) {
  const { hubs, loading,onboarding} = useHub();
  const location = useLocation();

  if (loading) {
    // keep it simple; replace with a spinner if you like
    return null;
  }

  const hasHub = hubs.length > 0;
  const isOnboardingPath = ["/hub-setup",  "/scan-config"]
  .some(prefix => location.pathname.startsWith(prefix));

 
  // If user has hubs but is on an onboarding route:
// allow it ONLY when onboarding is active; otherwise send to dashboard
if (hasHub && isOnboardingPath && !onboarding) {
  return <Navigate to="/dashboard" replace />;
}

  // If user has no hubs and is trying to access anywhere except hub-setup, push them there
  // if (!hasHub && !location.pathname.startsWith("/hub-setup")) {
  //   return <Navigate to="/hub-setup" replace />;
  // }
  if (!hasHub && !isOnboardingPath) {
    return <Navigate to="/hub-setup" replace />;
  }

  return <>{children}</>;
}
