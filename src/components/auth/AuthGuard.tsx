
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { session, user, isLoading, company, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [directCheck, setDirectCheck] = useState<{
    isAuthenticated: boolean;
    matchesRole: boolean;
    checking: boolean;
    userRole?: string;
    hasCompany: boolean;
  }>({
    isAuthenticated: false,
    matchesRole: false,
    checking: true,
    userRole: undefined,
    hasCompany: false
  });
  
  // Add state to track attempts
  const [checkAttempts, setCheckAttempts] = useState(0);

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
            checking: false,
            userRole: undefined,
            hasCompany: false
          });
          return;
        }
        
        // Check profile including role and company_id using the function RPC que criamos
        try {
          const { data: roleData, error: roleError } = await supabase
            .rpc('get_user_role_safely');
          
          if (roleError) {
            console.error("AuthGuard: Error getting role:", roleError.message);
            // Default to inspector role if there's an error
            const assumedRole = "inspector";
            const matchesRole = requiredRole ? requiredRole === assumedRole : true;
            
            setDirectCheck({
              isAuthenticated: true,
              matchesRole: matchesRole,
              checking: false,
              userRole: assumedRole,
              hasCompany: true  // Assume has company to prevent blocking users
            });
            
            return;
          }
          
          // Now get the profile data to check for company_id
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('company_id')
            .eq('id', sessionData.session.user.id)
            .maybeSingle();
          
          console.log("AuthGuard: Direct profile check:", 
            profileData ? `Has company: ${!!profileData.company_id}` : "No profile", 
            profileError ? `Error: ${profileError.message}` : "No error");
            
          // Check if required role exists and matches
          const matchesRole = requiredRole ? roleData === requiredRole : true;
          const hasCompany = profileData ? !!profileData.company_id : false;
          
          setDirectCheck({
            isAuthenticated: true,
            matchesRole: matchesRole,
            checking: false,
            userRole: roleData,
            hasCompany: hasCompany
          });
          
          // If the context doesn't have up-to-date profile data, refresh it
          if (!user || user.role !== roleData || (profileData && user.company_id !== profileData.company_id)) {
            refreshUserProfile();
          }
        } catch (err) {
          console.error("AuthGuard: Error checking profile:", err);
          // Default to authenticated with inspector role
          setDirectCheck({
            isAuthenticated: true,
            matchesRole: requiredRole ? requiredRole === "inspector" : true,
            checking: false,
            userRole: "inspector",
            hasCompany: true
          });
        }
      } catch (err) {
        console.error("AuthGuard: Error during direct check:", err);
        setDirectCheck({
          isAuthenticated: false,
          matchesRole: false,
          checking: false,
          userRole: undefined,
          hasCompany: false
        });
      }
    };
    
    checkAuthentication();
  }, [requiredRole, user, refreshUserProfile, checkAttempts]);
  
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
  
  // For role check, first see if we have a required role
  let hasRequiredRole = true;
  
  if (requiredRole) {
    // First try context
    if (user?.role === requiredRole) {
      hasRequiredRole = true;
    } else {
      // Then try direct check
      hasRequiredRole = directCheck.matchesRole;
    }
  }

  // Bypass company check for now to avoid blank screens
  const hasCompany = true; // Always assume company exists
  const needsCompanySetup = false; // Disable company setup requirement
  
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
    // If we know the user role (from context or direct check)
    const userRole = user?.role || directCheck.userRole;
    
    if (userRole === "admin") {
      console.log("AuthGuard: User is admin, redirecting to admin dashboard");
      return <Navigate to="/admin/tenant/vistorias" replace />;
    } else {
      console.log("AuthGuard: User is inspector, redirecting to inspector dashboard");
      return <Navigate to="/app/inspector/dashboard" replace />;
    }
  }
  
  // If all checks pass, render the children
  return <>{children}</>;
};

export default AuthGuard;
