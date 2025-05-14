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

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminInspections from "./pages/admin/Inspections";
import AdminProfile from "./pages/admin/Profile";
import AdminInspectors from "./pages/admin/Inspectors";

// Inspector pages
import InspectorDashboard from "./pages/inspector/Dashboard";
import InspectorInspection from "./pages/inspector/Inspection";
import InspectorProfile from "./pages/inspector/Profile";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login role="admin" />} />
    <Route path="/login/inspector" element={<Login role="inspector" />} />
    <Route path="/register" element={<Register />} />
    <Route path="/register/success" element={<RegisterSuccess />} />
    
    {/* Admin Routes */}
    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="/admin/dashboard" element={
      <AuthGuard requiredRole="admin">
        <AdminDashboard />
      </AuthGuard>
    } />
    <Route path="/admin/profile" element={
      <AuthGuard requiredRole="admin">
        <AdminProfile />
      </AuthGuard>
    } />
    <Route path="/admin/inspectors" element={
      <AuthGuard requiredRole="admin">
        <AdminInspectors />
      </AuthGuard>
    } />
    <Route path="/admin/inspections" element={
      <AuthGuard requiredRole="admin">
        <AdminInspections />
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
