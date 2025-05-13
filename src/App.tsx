
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import pages
import Landing from "./pages/landing/Landing";
import AdminLogin from "./pages/auth/AdminLogin";
import InspectorLogin from "./pages/auth/InspectorLogin";
import Dashboard from "./pages/admin/Dashboard";
import CompanyProfile from "./pages/admin/CompanyProfile";
import InspectorList from "./pages/admin/InspectorList";
import InspectionList from "./pages/inspector/InspectionList";
import InspectionForm from "./pages/inspector/InspectionForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/login/inspector" element={<InspectorLogin />} />
          
          {/* Admin Routes */}
          <Route path="/admin/tenant/dashboard" element={<Dashboard />} />
          <Route path="/admin/tenant/perfil" element={<CompanyProfile />} />
          <Route path="/admin/tenant/vistoriadores" element={<InspectorList />} />
          
          {/* Inspector Routes */}
          <Route path="/app/inspector/dashboard" element={<InspectionList />} />
          <Route path="/app/inspector/inspection/:id" element={<InspectionForm />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
