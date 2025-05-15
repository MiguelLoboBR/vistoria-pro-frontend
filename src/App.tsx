
import {
  Route,
  Routes,
  Outlet,
} from "react-router-dom";
import AuthGuard from "./components/auth/AuthGuard";
import Index from "./pages/Index";
import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import InspectorLogin from "./pages/auth/InspectorLogin";
import Register from "./pages/auth/Register";
import RegisterSuccess from "./pages/auth/RegisterSuccess";
import Dashboard from "./pages/admin/Dashboard";
import Vistorias from "./pages/admin/Vistorias";
import Inspections from "./pages/admin/Inspections";
import Inspectors from "./pages/admin/Inspectors";
import Profile from "./pages/admin/Profile";
import CompanyProfile from "./pages/admin/CompanyProfile";
import CompanySetup from "./pages/company-setup/CompanySetup";
import NotFound from "./pages/NotFound";
import Inspection from "./pages/inspector/Inspection";
import InspectionList from "./pages/inspector/InspectionList";
import InspectionExecute from "./pages/inspector/InspectionExecute";
import InstallPWA from "./pages/InstallPWA";
import { USER_ROLES } from "@/services/authService/types";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/install-pwa" element={<InstallPWA />} />

        {/* Auth Routes - Fixed paths */}
        <Route path="/login" element={<Login role={USER_ROLES.ADMIN_TENANT} />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/inspector/login" element={<InspectorLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/success" element={<RegisterSuccess />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AuthGuard requiredRole="admin_tenant"><Outlet /></AuthGuard>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="vistorias" element={<Vistorias />} />
          <Route path="inspections" element={<Inspections />} />
          <Route path="inspectors" element={<Inspectors />} />
          <Route path="profile" element={<Profile />} />
          <Route path="company-profile" element={<CompanyProfile />} />
        </Route>

        {/* Inspector Routes */}
        <Route path="/inspector" element={<AuthGuard requiredRole="inspector"><Outlet /></AuthGuard>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="inspection/:id" element={<Inspection />} />
          <Route path="execute/:id" element={<InspectionExecute />} />
          <Route path="inspections" element={<InspectionList />} />
          <Route path="schedule" element={<Dashboard />} />
          <Route path="history" element={<InspectionList />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Company Setup */}
        <Route path="/setup/company" element={
          <AuthGuard>
            <CompanySetup />
          </AuthGuard>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
