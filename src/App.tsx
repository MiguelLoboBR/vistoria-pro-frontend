import { Route, Routes, Outlet } from "react-router-dom";
import AuthGuard from "./components/auth/AuthGuard";
import Landing from "./pages/landing/Landing";
import Login from "./pages/auth/Login";
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

function App() {
  return (
    <Routes>
      {/* Landing Page agora é a raiz "/" */}
      <Route path="/" element={<Landing />} />
      <Route path="/install-pwa" element={<InstallPWA />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/success" element={<RegisterSuccess />} />

      {/* Admin Tenant */}
      <Route path="/admin" element={<AuthGuard requiredRole="admin_tenant"><Outlet /></AuthGuard>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="vistorias" element={<Vistorias />} />
        <Route path="inspections" element={<Inspections />} />
        <Route path="inspectors" element={<Inspectors />} />
        <Route path="profile" element={<Profile />} />
        <Route path="company-profile" element={<CompanyProfile />} />
      </Route>

      {/* Inspector */}
      <Route path="/inspector" element={<AuthGuard requiredRole="inspector"><Outlet /></AuthGuard>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="inspection/:id" element={<Inspection />} />
        <Route path="execute/:id" element={<InspectionExecute />} />
        <Route path="inspections" element={<InspectionList />} />
        <Route path="schedule" element={<Dashboard />} />
        <Route path="history" element={<InspectionList />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Setup */}
      <Route path="/setup/company" element={<AuthGuard><CompanySetup /></AuthGuard>} />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
