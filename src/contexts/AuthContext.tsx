
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
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        
        // Fetch user profile when session changes
        if (session) {
          setTimeout(() => {
            fetchUserProfile();
          }, 0);
        } else {
          setUser(null);
          setCompany(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session) {
        fetchUserProfile();
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const profile = await authService.getUserProfile();
      setUser(profile);

      if (profile?.company_id) {
        const companyData = await authService.getCompany(profile.company_id);
        setCompany(companyData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await authService.signIn(email, password);
      // onAuthStateChange will update the session
    } catch (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      await authService.signUp(email, password, fullName);
      // onAuthStateChange will update the session
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
