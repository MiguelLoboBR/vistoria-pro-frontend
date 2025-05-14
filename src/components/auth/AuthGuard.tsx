
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { UserRole } from "@/services/types"; // Import from services/types for consistency
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { LoadingAuthentication } from "./LoadingAuthentication";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const {
    isAuthenticated,
    hasRequiredRole,
    needsCompanySetup,
    isCheckingAuth,
    userRole
  } = useAuthGuard(requiredRole);
  
  // Don't show any content while loading
  if (isCheckingAuth) {
    return <LoadingAuthentication />;
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log("AuthGuard: User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // If admin without company, redirect to company setup
  if (needsCompanySetup) {
    console.log("AuthGuard: Admin without company, redirecting to company setup");
    return <Navigate to="/setup/company" replace />;
  }
  
  // If authenticated but doesn't have required role, redirect to appropriate dashboard
  if (!hasRequiredRole) {
    if (userRole === "admin_tenant") {
      console.log("AuthGuard: User is admin, redirecting to admin dashboard");
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      console.log("AuthGuard: User is inspector, redirecting to inspector dashboard");
      return <Navigate to="/inspector/dashboard" replace />;
    }
  }
  
  // If all checks pass, render the children
  return <>{children}</>;
};

export default AuthGuard;
