
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Company, authService } from "@/services/authService";
import { useNavigate } from "react-router-dom";

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
      async (event, currentSession) => {
        console.log("Auth state changed:", event, "Has session:", !!currentSession);
        setSession(currentSession);
        
        // Fetch user profile when session changes
        if (currentSession) {
          console.log("Session exists, fetching user profile...");
          try {
            const profile = await authService.getUserProfile();
            console.log("Profile fetched:", profile);
            setUser(profile);

            if (profile?.company_id) {
              console.log("Fetching company data...");
              const companyData = await authService.getCompany(profile.company_id);
              console.log("Company data fetched:", companyData);
              setCompany(companyData);
            } else {
              console.log("User has no company_id");
              setCompany(null);
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        } else {
          console.log("No active session, clearing user and company data");
          setUser(null);
          setCompany(null);
        }
        
        setIsLoading(false);
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
          await fetchUserProfile();
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

  const fetchUserProfile = async () => {
    setIsLoading(true);
    console.log("Fetching user profile manually...");
    try {
      const profile = await authService.getUserProfile();
      console.log("User profile fetched:", profile);
      setUser(profile);

      if (profile?.company_id) {
        const companyData = await authService.getCompany(profile.company_id);
        console.log("Company data fetched:", companyData);
        setCompany(companyData);
      } else {
        console.log("User has no company_id");
        setCompany(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log("Iniciando login para:", email);
    try {
      const result = await authService.signIn(email, password);
      console.log("Resultado do login:", result);
      // A sessão será atualizada pelo onAuthStateChange
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
        await fetchUserProfile(); // Refresh user profile after company creation
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
