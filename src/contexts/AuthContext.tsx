
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Company, authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface AuthContextType {
  session: Session | null;
  user: UserProfile | null;
  company: Company | null;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  createCompanyWithAdmin: (name: string, cnpj: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("AuthContext initializing...");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, "Has session:", !!currentSession);
        setSession(currentSession);
        
        if (currentSession) {
          console.log("Session exists, fetching user profile...");
          
          // Use setTimeout to prevent recursive auth calls
          setTimeout(async () => {
            try {
              // First attempt: Get role directly from the user metadata
              let userRole = currentSession.user.user_metadata.role;
              let userData: UserProfile | null = null;
              
              try {
                // Second attempt: Try to fetch profile data from profiles table
                const { data, error } = await supabase
                  .from("profiles")
                  .select("id, email, full_name, role, company_id, avatar_url")
                  .eq("id", currentSession.user.id)
                  .maybeSingle();
                
                if (error) {
                  console.error("Error fetching user profile:", error);
                  // Don't fail here, we'll use a default profile
                } else if (data) {
                  userData = data as UserProfile;
                  userRole = data.role;
                }
              } catch (profileError) {
                console.error("Error in profile fetch:", profileError);
                // Continue with fallback approach
              }
              
              // If we still don't have user data, create a minimal profile
              if (!userData) {
                userData = {
                  id: currentSession.user.id,
                  email: currentSession.user.email!,
                  full_name: currentSession.user.user_metadata.full_name,
                  role: userRole as any || "inspector",
                };
                
                console.log("Created fallback user profile:", userData);
              }
              
              setUser(userData);
              
              // Try to fetch company data if we have a company_id
              if (userData?.company_id) {
                try {
                  const { data: companyData, error: companyError } = await supabase
                    .from("companies")
                    .select("*")
                    .eq("id", userData.company_id)
                    .maybeSingle();
                    
                  if (companyError) {
                    console.error("Error fetching company data:", companyError);
                  } else if (companyData) {
                    setCompany(companyData as Company);
                  }
                } catch (compErr) {
                  console.error("Company fetch error:", compErr);
                }
              }
            } catch (error) {
              console.error("Error in the profile/company fetch process:", error);
            } finally {
              setIsLoading(false);
            }
          }, 0);
        } else {
          console.log("No active session, clearing user and company data");
          setUser(null);
          setCompany(null);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const checkExistingSession = async () => {
      try {
        console.log("Checking for existing session...");
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        console.log("Existing session check result:", existingSession ? "Session found" : "No session");
        
        if (existingSession) {
          setSession(existingSession);
          
          // Use fallback approach similar to onAuthStateChange
          setTimeout(async () => {
            try {
              // First, try to get a minimal profile from user metadata
              let userData: UserProfile = {
                id: existingSession.user.id,
                email: existingSession.user.email!,
                full_name: existingSession.user.user_metadata.full_name,
                role: (existingSession.user.user_metadata.role as any) || "inspector",
              };
              
              try {
                // Try to enhance with profile data
                const { data, error } = await supabase
                  .from("profiles")
                  .select("id, email, full_name, role, company_id, avatar_url")
                  .eq("id", existingSession.user.id)
                  .maybeSingle();
                
                if (!error && data) {
                  userData = data as UserProfile;
                  
                  // Try to fetch company data if we have a company_id
                  if (userData.company_id) {
                    try {
                      const { data: companyData, error: companyError } = await supabase
                        .from("companies")
                        .select("*")
                        .eq("id", userData.company_id)
                        .maybeSingle();
                        
                      if (!companyError && companyData) {
                        setCompany(companyData as Company);
                      }
                    } catch (compErr) {
                      console.error("Company fetch error:", compErr);
                    }
                  }
                } else {
                  console.log("Using fallback profile data from session");
                }
              } catch (profileError) {
                console.error("Error fetching profile data:", profileError);
                // Continue with minimal profile from metadata
              }
              
              setUser(userData);
            } catch (error) {
              console.error("Error in existing session handling:", error);
            } finally {
              setIsLoading(false);
            }
          }, 0);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking existing session:", error);
        setIsLoading(false);
      }
    };
    
    checkExistingSession();

    return () => {
      console.log("Cleaning up auth subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log("Iniciando login para:", email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      console.log("Login bem-sucedido:", data.session ? "Session obtida" : "Sem session");
      
      // The session will be updated by onAuthStateChange
      return;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      await authService.signUp(email, password, fullName);
      // A sessão será atualizada pelo onAuthStateChange
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const createCompanyWithAdmin = async (name: string, cnpj: string) => {
    try {
      const companyId = await authService.createCompanyWithAdmin(name, cnpj);
      if (companyId) {
        // Instead of just refreshing the profile, force a reload to ensure we have fresh data
        window.location.href = "/admin/tenant/dashboard";
      }
      return companyId;
    } catch (error) {
      console.error("Error creating company:", error);
      throw error;
    }
  };

  const isAdmin = user?.role === "admin";

  const value = {
    session,
    user,
    company,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut,
    createCompanyWithAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
