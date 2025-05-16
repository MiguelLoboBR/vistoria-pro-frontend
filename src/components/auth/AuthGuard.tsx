
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { UserRole } from "@/services/authService/types";
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
    isCheckingAuth,
    userRole
  } = useAuthGuard(requiredRole);
  
  // Don't show any content while loading
  if (isCheckingAuth) {
    console.log("AuthGuard: Checking authentication...");
    return <LoadingAuthentication />;
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log("AuthGuard: User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // If authenticated but doesn't have required role, redirect to appropriate dashboard
  if (!hasRequiredRole) {
    console.log(`AuthGuard: User has role ${userRole} but needs ${requiredRole}, redirecting`);
    
    // Explicitly check for admin roles to ensure proper redirection
    if (userRole === "admin_master") {
      return <Navigate to="/master/dashboard" replace />;
    } else if (userRole === "admin_tenant") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/inspector/dashboard" replace />;
    }
  }
  
  // If all checks pass, render the children
  console.log("AuthGuard: All checks passed, rendering children");
  return <>{children}</>;
};

export default AuthGuard;
