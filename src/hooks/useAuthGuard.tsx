
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/services/authService/types";

export const useAuthGuard = (requiredRole?: UserRole) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const [needsCompanySetup, setNeedsCompanySetup] = useState(false);
  
  useEffect(() => {
    // Wait for authentication to finish loading
    if (!isLoading) {
      // Check if user is authenticated
      if (isAuthenticated && user) {
        // Check if admin user needs to set up company
        const isAdmin = user.role === "admin_tenant" || user.role === "admin_master";
        if (isAdmin && !user.company_id) {
          setNeedsCompanySetup(true);
        } else {
          setNeedsCompanySetup(false);
        }
        
        // Check if user has required role
        if (requiredRole) {
          // Special case: if required role is admin, allow both admin_tenant and admin_master
          if (requiredRole === "admin_tenant" && 
              (user.role === "admin_tenant" || user.role === "admin_master")) {
            setHasRequiredRole(true);
          } else {
            setHasRequiredRole(user.role === requiredRole);
          }
        } else {
          // If no specific role is required, allow access
          setHasRequiredRole(true);
        }
      }
      setIsCheckingAuth(false);
    }
  }, [isLoading, isAuthenticated, user, requiredRole]);
  
  return {
    isAuthenticated,
    hasRequiredRole,
    needsCompanySetup,
    isCheckingAuth,
    userRole: user?.role
  };
};
