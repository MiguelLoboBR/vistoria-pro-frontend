
import { Navigate } from "react-router-dom";
import { useAuthState } from "@/hooks/useAuthState";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { UserRole } from "@/services/authService/types";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, user } = useAuthState();
  const [userRole, setUserRole] = useState<string | null>(null);
  
  useEffect(() => {
    // Se o usuário estiver autenticado, mas o papel não estiver definido,
    // tente obter usando a função RPC segura
    const fetchUserRole = async () => {
      if (isAuthenticated && user && !user.role) {
        try {
          const { data, error } = await supabase.rpc('get_current_user_role');
          if (!error && data) {
            setUserRole(data);
          }
        } catch (error) {
          console.error("Erro ao obter papel do usuário:", error);
        }
      } else if (user?.role) {
        setUserRole(user.role);
      }
    };
    
    fetchUserRole();
  }, [isAuthenticated, user]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check role if required
  const actualRole = userRole || user?.role;
  if (requiredRole && actualRole !== requiredRole) {
    // Redirecionar para o dashboard apropriado com base no papel
    if (actualRole === "admin_master") {
      return <Navigate to="/master/dashboard" replace />;
    } else if (actualRole === "admin_tenant") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/inspector/dashboard" replace />;
    }
  }
  
  return <>{children}</>;
};

export default AuthGuard;
