
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/services/authService";
import CompanySetup from "./CompanySetup";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { user, isLoading, session, company } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vistoria-blue"></div>
      </div>
    );
  }

  if (!session || !user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has a company assigned
  if (!company) {
    // If admin but no company yet, show company setup
    if (user.role === "admin") {
      return <CompanySetup />;
    } else {
      // If inspector but no company yet, show info page
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Vistoriador não associado</h1>
          <p className="text-center mb-6">
            Sua conta ainda não foi associada a uma empresa. Por favor, entre em contato com o administrador da sua empresa para ser adicionado.
          </p>
          <button
            onClick={() => window.location.href = "/login/inspector"}
            className="px-4 py-2 bg-vistoria-blue text-white rounded-md hover:bg-vistoria-darkBlue"
          >
            Voltar para o login
          </button>
        </div>
      );
    }
  }

  // Check if user has the required role
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    if (user.role === "admin") {
      return <Navigate to="/admin/tenant/dashboard" replace />;
    } else {
      return <Navigate to="/app/inspector/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default AuthGuard;
