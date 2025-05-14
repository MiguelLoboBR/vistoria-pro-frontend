
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import contexts
import { AuthProvider } from "@/contexts/AuthContext";

// Import components
import AuthGuard from "@/components/auth/AuthGuard";
import CompanySetup from "@/components/auth/CompanySetup";

// Import pages
import Landing from "./pages/landing/Landing";
import AdminLogin from "./pages/auth/AdminLogin";
import InspectorLogin from "./pages/auth/InspectorLogin";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/admin/Dashboard";
import Vistorias from "./pages/admin/Vistorias";
import CompanyProfile from "./pages/admin/CompanyProfile";
import InspectorList from "./pages/admin/InspectorList";
import InspectionList from "./pages/inspector/InspectionList";
import InspectionForm from "./pages/inspector/InspectionForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<AdminLogin />} />
    <Route path="/login/inspector" element={<InspectorLogin />} />
    <Route path="/register" element={<Register />} />
    
    {/* Company Setup Route - Move to standalone route for better accessibility */}
    <Route path="/setup/company" element={<CompanySetup />} />
    
    {/* Admin Routes - redirect to dashboard as primary entry point */}
    <Route path="/admin/tenant" element={<Navigate to="/admin/tenant/dashboard" replace />} />
    <Route path="/admin/tenant/dashboard" element={
      <AuthGuard requiredRole="admin">
        <Dashboard />
      </AuthGuard>
    } />
    <Route path="/admin/tenant/perfil" element={
      <AuthGuard requiredRole="admin">
        <CompanyProfile />
      </AuthGuard>
    } />
    <Route path="/admin/tenant/vistoriadores" element={
      <AuthGuard requiredRole="admin">
        <InspectorList />
      </AuthGuard>
    } />
    <Route path="/admin/tenant/vistorias" element={
      <AuthGuard requiredRole="admin">
        <Vistorias />
      </AuthGuard>
    } />
    
    {/* Inspector Routes */}
    <Route path="/app/inspector" element={<Navigate to="/app/inspector/dashboard" replace />} />
    <Route path="/app/inspector/dashboard" element={
      <AuthGuard requiredRole="inspector">
        <InspectionList />
      </AuthGuard>
    } />
    <Route path="/app/inspector/inspection/:id" element={
      <AuthGuard requiredRole="inspector">
        <InspectionForm />
      </AuthGuard>
    } />
    
    {/* Catch-all route */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
