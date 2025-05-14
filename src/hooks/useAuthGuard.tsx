import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/services/authService";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardState {
  isAuthenticated: boolean;
  matchesRole: boolean;
  checking: boolean;
  userRole?: string;
  hasCompany: boolean;
}

export function useAuthGuard(requiredRole?: UserRole) {
  const { session, user, isLoading, refreshUserProfile } = useAuth();
  const navigate = useNavigate();
  const [directCheck, setDirectCheck] = useState<AuthGuardState>({
    isAuthenticated: false,
    matchesRole: false,
    checking: true,
    userRole: undefined,
    hasCompany: false
  });
  
  const [checkAttempts, setCheckAttempts] = useState(0);
  const maxAttempts = 3; // Prevent excessive recursion

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
        
        // Get the user role from user metadata first
        const userMetadata = sessionData.session.user.user_metadata;
        const roleFromMetadata = userMetadata?.role as UserRole | undefined;
        
        if (roleFromMetadata) {
          // If we have a role in metadata, use it directly
          const matchesRole = requiredRole ? requiredRole === roleFromMetadata : true;
          const hasCompany = !!userMetadata?.company_id;
          
          setDirectCheck({
            isAuthenticated: true,
            matchesRole: matchesRole,
            checking: false,
            userRole: roleFromMetadata,
            hasCompany: hasCompany
          });
          
          if (checkAttempts < maxAttempts && (!user || user.role !== roleFromMetadata)) {
            setCheckAttempts(prev => prev + 1);
            refreshUserProfile();
          }
        } else {
          // Otherwise, try the safer RPC function to get role
          try {
            const { data: roleData, error: roleError } = await supabase
              .rpc('get_user_role_safely');
            
            if (roleError) {
              console.error("AuthGuard: Error getting role:", roleError.message);
              // Default to inspector role if there's an error
              const assumedRole = sessionData.session.user.user_metadata?.role || "inspector";
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
            
            // Use user metadata to avoid profile query that might cause recursion
            const hasCompanyInMetadata = !!sessionData.session.user.user_metadata?.company_id;
            
            // Fallback to profile query only if metadata doesn't have the info
            let hasCompany = hasCompanyInMetadata;
            
            if (!hasCompanyInMetadata && checkAttempts < maxAttempts) {
              try {
                const { data: profileData, error: profileError } = await supabase
                  .from('profiles')
                  .select('company_id')
                  .eq('id', sessionData.session.user.id)
                  .maybeSingle();
                  
                if (!profileError && profileData) {
                  hasCompany = !!profileData.company_id;
                }
              } catch (err) {
                console.warn("AuthGuard: Error checking company in profile:", err);
                // Continue with what we know from metadata
              }
            }
            
            // Check if required role exists and matches
            const matchesRole = requiredRole ? roleData === requiredRole : true;
            
            setDirectCheck({
              isAuthenticated: true,
              matchesRole: matchesRole,
              checking: false,
              userRole: roleData,
              hasCompany: hasCompany
            });
            
            // If the context doesn't have up-to-date profile data, refresh it
            // But only if we haven't reached max attempts to avoid loops
            if (checkAttempts < maxAttempts && (!user || user.role !== roleData)) {
              setCheckAttempts(prev => prev + 1);
              refreshUserProfile();
            }
          } catch (err) {
            console.error("AuthGuard: Error checking profile:", err);
            // Use user metadata as fallback
            const metadataRole = sessionData.session.user.user_metadata?.role || "inspector";
            setDirectCheck({
              isAuthenticated: true,
              matchesRole: requiredRole ? requiredRole === metadataRole : true,
              checking: false,
              userRole: metadataRole,
              hasCompany: !!sessionData.session.user.user_metadata?.company_id || false
            });
          }
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
  }, [requiredRole, refreshUserProfile, checkAttempts, user]);

  // Compute the final auth state by combining context and direct check
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

  // Check if admin needs company setup
  // Only admins without companies need to set up a company
  const needsCompanySetup = 
    (user?.role === "admin" || directCheck.userRole === "admin") &&
    !user?.company_id &&
    !directCheck.hasCompany;
    
  const isCheckingAuth = isLoading || directCheck.checking;
  const userRole = user?.role || directCheck.userRole;

  return {
    isAuthenticated,
    hasRequiredRole,
    needsCompanySetup,
    isCheckingAuth,
    userRole
  };
}
