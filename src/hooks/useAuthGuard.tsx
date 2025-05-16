
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/services/authService/types";
import { supabase } from "@/integrations/supabase/client";

export const useAuthGuard = (requiredRole?: UserRole) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  
  useEffect(() => {
    const checkUserRole = async () => {
      // Wait for authentication to finish loading
      if (!isLoading) {
        // Check if user is authenticated
        if (isAuthenticated && user) {
          let role = user.role;
          
          // Se o papel não estiver definido no contexto, tente obtê-lo usando a função RPC
          if (!role) {
            try {
              const { data: roleData, error } = await supabase.rpc('get_current_user_role');
              if (!error && roleData) {
                role = roleData as UserRole;
                console.log("Role obtida da função RPC:", role);
              }
            } catch (rpcError) {
              console.error("Erro ao chamar função RPC:", rpcError);
            }
          }
          
          setUserRole(role);
          console.log("useAuthGuard: User authenticated with role:", role);
          
          // Check if user has required role
          if (requiredRole) {
            // Special case: if required role is admin_tenant, allow both admin_tenant and admin_master
            if (requiredRole === "admin_tenant" && 
                (role === "admin_tenant" || role === "admin_master")) {
              setHasRequiredRole(true);
            } 
            // Special case for admin_master role
            else if (requiredRole === "admin_master" && role === "admin_master") {
              setHasRequiredRole(true);
            }
            else {
              setHasRequiredRole(role === requiredRole);
            }
          } else {
            // If no specific role is required, allow access
            setHasRequiredRole(true);
          }
        } else {
          console.log("useAuthGuard: User not authenticated");
          setUserRole(undefined);
          setHasRequiredRole(false);
        }
        setIsCheckingAuth(false);
      }
    };
    
    checkUserRole();
  }, [isLoading, isAuthenticated, user, requiredRole]);
  
  return {
    isAuthenticated,
    hasRequiredRole,
    isCheckingAuth,
    userRole
  };
};
