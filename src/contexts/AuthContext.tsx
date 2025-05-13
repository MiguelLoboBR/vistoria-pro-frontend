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
              const { data, error } = await supabase
                .from("profiles")
                .select("id, email, full_name, role, company_id, avatar_url")
                .eq("id", currentSession.user.id)
                .maybeSingle(); // Use maybeSingle instead of single
              
              if (error) {
                console.error("Error fetching user profile from auth state change:", error);
                setUser(null);
                setIsLoading(false);
                return;
              }
              
              console.log("Profile data fetched:", data);
              
              if (data) {
                setUser(data as UserProfile);
                
                if (data?.company_id) {
                  try {
                    const { data: companyData, error: companyError } = await supabase
                      .from("companies")
                      .select("*")
                      .eq("id", data.company_id)
                      .maybeSingle();
                      
                    if (companyError) {
                      console.error("Error fetching company data:", companyError);
                      setCompany(null);
                    } else {
                      console.log("Company data fetched:", companyData);
                      setCompany(companyData as Company);
                    }
                  } catch (compErr) {
                    console.error("Company fetch error:", compErr);
                    setCompany(null);
                  }
                } else {
                  console.log("User has no company_id");
                  setCompany(null);
                }
              } else {
                console.log("No profile data found");
                setUser(null);
              }
            } catch (error) {
              console.error("Error in the profile/company fetch process:", error);
              setUser(null);
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
          
          // Direct query for user profile data
          setTimeout(async () => {
            try {
              const { data, error } = await supabase
                .from("profiles")
                .select("id, email, full_name, role, company_id, avatar_url")
                .eq("id", existingSession.user.id)
                .maybeSingle();
                
              if (error) {
                console.error("Error fetching user profile from existing session:", error);
                setIsLoading(false);
                return;
              }
              
              if (data) {
                console.log("Profile data fetched from existing session:", data);
                setUser(data as UserProfile);
                
                if (data?.company_id) {
                  try {
                    const { data: companyData, error: companyError } = await supabase
                      .from("companies")
                      .select("*")
                      .eq("id", data.company_id)
                      .maybeSingle();
                      
                    if (companyError) {
                      console.error("Error fetching company data:", companyError);
                      setCompany(null);
                    } else {
                      console.log("Company data fetched:", companyData);
                      setCompany(companyData as Company);
                    }
                  } catch (compErr) {
                    console.error("Company fetch error:", compErr);
                    setCompany(null);
                  }
                }
              } else {
                console.log("No profile data found for existing session");
                setUser(null);
              }
            } catch (error) {
              console.error("Error in the existing session profile fetch:", error);
              setUser(null);
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
