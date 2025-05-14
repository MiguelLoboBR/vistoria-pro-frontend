
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
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching user profile for:", userId);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, role, company_id, avatar_url")
        .eq("id", userId)
        .maybeSingle();
      
      if (error) {
        throw error;
      }

      if (data) {
        console.log("User profile found:", data);
        setUser(data as UserProfile);
        
        // If the user has a company, fetch company data
        if (data.company_id) {
          fetchCompanyData(data.company_id);
        } else {
          setCompany(null);
          console.log("User has no company associated");
          setIsLoading(false);
        }
      } else {
        console.log("No profile found for user:", userId);
        setUser(null);
        setCompany(null);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(null);
      setCompany(null);
      setIsLoading(false);
    }
  };

  const fetchCompanyData = async (companyId: string) => {
    try {
      console.log("Fetching company data for:", companyId);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .maybeSingle();
        
      if (error) {
        throw error;
      }

      if (data) {
        console.log("Company found:", data);
        setCompany(data as Company);
      } else {
        console.log("No company found with ID:", companyId);
        setCompany(null);
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      setCompany(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("AuthContext initializing...");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, "Has session:", !!currentSession);
        setSession(currentSession);
        
        if (currentSession) {
          fetchUserProfile(currentSession.user.id);
        } else {
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
          fetchUserProfile(existingSession.user.id);
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

  const refreshUserProfile = async () => {
    if (session && session.user) {
      setIsLoading(true);
      await fetchUserProfile(session.user.id);
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
    createCompanyWithAdmin,
    refreshUserProfile
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
