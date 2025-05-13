
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { session, user, isLoading } = useAuth();
  const [directCheck, setDirectCheck] = useState<{
    isAuthenticated: boolean;
    matchesRole: boolean;
    checking: boolean;
  }>({
    isAuthenticated: false,
    matchesRole: false,
    checking: true
  });

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Direct check with Supabase
        const { data: sessionData } = await supabase.auth.getSession();
        
        console.log("AuthGuard: Direct session check:", 
          sessionData.session ? "Session exists" : "No session");
          
        if (!sessionData.session) {
          setDirectCheck({
            isAuthenticated: false,
            matchesRole: false,
            checking: false
          });
          return;
        }
        
        // Check profile for role
        if (requiredRole) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', sessionData.session.user.id)
              .maybeSingle();
            
            console.log("AuthGuard: Direct profile check:", 
              profileData ? `Role: ${profileData.role}` : "No profile", 
              profileError ? `Error: ${profileError.message}` : "No error");
              
            if (profileError || !profileData) {
              setDirectCheck({
                isAuthenticated: true,
                matchesRole: false,
                checking: false
              });
              return;
            }
            
            setDirectCheck({
              isAuthenticated: true,
              matchesRole: profileData.role === requiredRole,
              checking: false
            });
          } catch (err) {
            console.error("AuthGuard: Error checking profile:", err);
            setDirectCheck({
              isAuthenticated: true,
              matchesRole: false,
              checking: false
            });
          }
        } else {
          setDirectCheck({
            isAuthenticated: true,
            matchesRole: true,
            checking: false
          });
        }
      } catch (err) {
        console.error("AuthGuard: Error during direct check:", err);
        setDirectCheck({
          isAuthenticated: false,
          matchesRole: false,
          checking: false
        });
      }
    };
    
    checkAuthentication();
  }, [requiredRole]);
  
  // Don't show any content while loading
  if (isLoading || directCheck.checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vistoria-blue mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  // Check using direct connection AND context
  const isAuthenticated = session !== null || directCheck.isAuthenticated;
  const hasRequiredRole = requiredRole 
    ? (user?.role === requiredRole || directCheck.matchesRole)
    : true;
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log("AuthGuard: User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // Redirect if doesn't have required role
  if (!hasRequiredRole) {
    console.log("AuthGuard: User doesn't have required role, redirecting to appropriate dashboard");
    
    if (user?.role === "admin" || directCheck.isAuthenticated) {
      return <Navigate to="/admin/tenant/dashboard" replace />;
    } else {
      return <Navigate to="/app/inspector/dashboard" replace />;
    }
  }
  
  // If all checks pass, render the children
  return <>{children}</>;
};

export default AuthGuard;
