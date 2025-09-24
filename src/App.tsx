import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Auth from "./pages/Auth";
import HubSetup from "./pages/HubSetup";
import ScanConfig from "./pages/ScanConfig";
import Dashboard from "./pages/Dashboard";
import Repositories from "./pages/Repositories";
import ScanPage from "./pages/ScanPage";
import FindingsPage from "./pages/FindingsPage";
import RepositoryDetailsPage from "./pages/RepositoryDetailsPage";
import ScanConfigurationPage from "./pages/ScanConfigurationPage";
import ScanStatusPage from "./pages/ScanStatusPage";
import Settings from "./pages/Settings";
import Integrations from "./pages/Integrations";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";
import { HubProvider } from "@/contexts/HubContext"; 
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/components/auth/AuthContext"; 
import AuthCallback from "./pages/authCallback";
import queryClient from "@/lib/queryClient";

//const queryClient = new QueryClient();

// Protected Route component
// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//   const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
//   return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
// };

const LayoutWrapper = () => {
  const location = useLocation();
  // const isLoginPage = location.pathname === "/login";
  const isLoginPage = ["/login", "/callback"].includes(location.pathname);

  
  if (isLoginPage) {
    return (
      <Routes>
        <Route path="/login" element={<Auth />} />
        <Route path="/callback" element={<AuthCallback />} />
      </Routes>
    );
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* <Sidebar />
      <div className="flex flex-col">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6"> */}
        <Routes>
          {/* <Route path="/login" element={<Auth />} /> */}
          <Route path="/hub-setup" element={
            <ProtectedRoute>
              <HubSetup />
            </ProtectedRoute>
          } />
          <Route path="/scan-config" element={
            <ProtectedRoute>
              <ScanConfig />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<Auth />} />
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="repositories" element={<Repositories />} />
            {/* <Route path="repositories/:repoId/scan" element={<ScanPage />} /> */}
            <Route path="repositories/:repoId/scan" element={<ScanConfigurationPage />} />
            <Route path="repositories/:repoId/scan/status" element={<ScanStatusPage />} />
            {/* <Route path="repositories/:repoId/findings" element={<FindingsPage />} /> */}
            <Route path="repositories/:repoId" element={<RepositoryDetailsPage />} />
            <Route path="scans" element={<div className="p-8 text-center text-muted-foreground">Scans & Reports page coming soon...</div>} />
            
            <Route path="integrations" element={<Integrations />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        {/* </main>
      </div> */}
    </div>
  );
  
  
};
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <HubProvider>
              <LayoutWrapper />
            </HubProvider>
        </BrowserRouter>
      </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
