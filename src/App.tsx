
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import contexts
import { AuthProvider } from "@/contexts/AuthContext";

// Import components
import AuthGuard from "@/components/auth/AuthGuard";

// Import pages
import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import RegisterSuccess from "./pages/auth/RegisterSuccess";
import NotFound from "./pages/NotFound";

// Company Setup
import CompanySetup from "./pages/company-setup/CompanySetup";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInspections from "./pages/admin/Inspections";
import AdminProfile from "./pages/admin/Profile";
import AdminInspectors from "./pages/admin/Inspectors";
import InspectorList from "./pages/admin/InspectorList";
import Vistorias from "./pages/admin/Vistorias";
import UnderConstruction from "./pages/admin/UnderConstruction";

// Inspector pages
import InspectorDashboard from "./pages/inspector/Dashboard";
import InspectorInspection from "./pages/inspector/Inspection";
import InspectorProfile from "./pages/inspector/Profile";
import AdminLogin from "./pages/auth/AdminLogin";
import InspectorLogin from "./pages/auth/InspectorLogin";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Navigate to="/landing" replace />} />
    <Route path="/landing" element={<Landing />} />
    <Route path="/login" element={<AdminLogin />} />
    <Route path="/login/inspector" element={<InspectorLogin />} />
    <Route path="/register" element={<Register />} />
    <Route path="/register/success" element={<RegisterSuccess />} />
    
    {/* Company Setup Route - Protected but no role needed */}
    <Route path="/setup/company" element={
      <AuthGuard>
        <CompanySetup />
      </AuthGuard>
    } />
    
    {/* Admin Routes */}
    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="/admin/dashboard" element={
      <AuthGuard requiredRole="admin_tenant">
        <AdminDashboard />
      </AuthGuard>
    } />
    <Route path="/admin/profile" element={
      <AuthGuard requiredRole="admin_tenant">
        <AdminProfile />
      </AuthGuard>
    } />
    <Route path="/admin/inspectors" element={
      <AuthGuard requiredRole="admin_tenant">
        <AdminInspectors />
      </AuthGuard>
    } />
    <Route path="/admin/inspector-list" element={
      <AuthGuard requiredRole="admin_tenant">
        <InspectorList />
      </AuthGuard>
    } />
    <Route path="/admin/inspections" element={
      <AuthGuard requiredRole="admin_tenant">
        <AdminInspections />
      </AuthGuard>
    } />
    
    {/* Rota para a página Vistorias (alternativa para Inspections) */}
    <Route path="/admin/vistorias" element={
      <AuthGuard requiredRole="admin_tenant">
        <Vistorias />
      </AuthGuard>
    } />
    
    {/* Rotas adicionais para páginas futuras */}
    <Route path="/admin/financeiro" element={
      <AuthGuard requiredRole="admin_tenant">
        <UnderConstruction pageName="Financeiro" />
      </AuthGuard>
    } />
    <Route path="/admin/relatorios" element={
      <AuthGuard requiredRole="admin_tenant">
        <UnderConstruction pageName="Relatórios" />
      </AuthGuard>
    } />
    
    {/* Inspector Routes */}
    <Route path="/inspector" element={<Navigate to="/inspector/dashboard" replace />} />
    <Route path="/inspector/dashboard" element={
      <AuthGuard requiredRole="inspector">
        <InspectorDashboard />
      </AuthGuard>
    } />
    <Route path="/inspector/inspection/:id" element={
      <AuthGuard requiredRole="inspector">
        <InspectorInspection />
      </AuthGuard>
    } />
    <Route path="/inspector/profile" element={
      <AuthGuard requiredRole="inspector">
        <InspectorProfile />
      </AuthGuard>
    } />
    
    {/* Add the missing inspector routes */}
    <Route path="/inspector/schedule" element={
      <AuthGuard requiredRole="inspector">
        <UnderConstruction pageName="Agenda" />
      </AuthGuard>
    } />
    <Route path="/inspector/history" element={
      <AuthGuard requiredRole="inspector">
        <UnderConstruction pageName="Histórico" />
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
