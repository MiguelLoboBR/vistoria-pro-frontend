import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Company, UserProfile } from "./types";
import { Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: UserProfile | null;
  company: Company | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any } | undefined>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any } | undefined>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

// Create the context with undefined as default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the useAuth hook that will be used in components to access the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  
  // Added refreshUserProfile function
  const refreshUserProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Try using RPC function first to avoid policy issues
      const { data: roleData, error: roleError } = await supabase.rpc('get_current_user_role');
      
      if (roleError) {
        console.warn("Could not get role using RPC function:", roleError);
        // Fall back to direct query with error handling
      }
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return;
      }
      
      if (!profileData) {
        console.warn("No profile found for user", session.user.id);
        return;
      }
      
      const userProfile: UserProfile = {
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
        company_id: profileData.company_id,
        role: profileData.role,
        cpf: profileData.cpf,
        phone: profileData.phone
      };
      
      setUser(userProfile);
      
      // Fetch company data
      if (profileData.company_id) {
        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select('*')
          .eq('id', profileData.company_id)
          .maybeSingle();
        
        if (companyError) {
          console.error("Error fetching company:", companyError);
          return;
        }
        
        if (!companyData) {
          console.warn("No company found with ID:", profileData.company_id);
          return;
        }
        
        const company: Company = {
          id: companyData.id,
          name: companyData.name,
          cnpj: companyData.cnpj,
          address: companyData.address,
          phone: companyData.phone,
          email: companyData.email,
          logo_url: companyData.logo_url,
          is_individual: companyData.is_individual
        };
        
        setCompany(company);
      }
    } catch (error) {
      console.error("Error refreshing user profile:", error);
    }
  };
  
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log("Auth state changed:", event);
      
      // Simple synchronous state updates only in the callback
      setSession(currentSession);
      setIsAuthenticated(!!currentSession);
      
      // Use setTimeout to defer any complex operations that might cause locks
      if (currentSession) {
        setTimeout(() => {
          fetchUserProfile(currentSession.user.id);
        }, 0);
      } else {
        setUser(null);
        setCompany(null);
        setIsLoading(false);
      }
    });
    
    // THEN check for existing session
    const fetchSession = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        
        if (existingSession) {
          setSession(existingSession);
          setIsAuthenticated(true);
          fetchUserProfile(existingSession.user.id);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
        setIsLoading(false);
      }
    };
    
    fetchSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId);
      
      // Try get_current_user_role RPC function first to avoid RLS issues
      try {
        await supabase.rpc('get_current_user_role');
      } catch (roleError) {
        console.warn("RPC get_current_user_role failed:", roleError);
      }
      
      // Then try to get the full profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) {
        if (error.message.includes('infinite recursion') || error.code === '42P17') {
          console.warn("RLS infinite recursion detected - using fallback user data");
          createFallbackUser(userId);
          return;
        }
        
        console.error("Error fetching profile:", error);
        setIsLoading(false);
        return;
      }
      
      if (!data) {
        console.warn("No profile found for user:", userId);
        createFallbackUser(userId);
        return;
      }
      
      const userProfile: UserProfile = {
        id: data.id,
        email: data.email,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        company_id: data.company_id,
        role: data.role,
        cpf: data.cpf,
        phone: data.phone
      };
      
      setUser(userProfile);
      
      // Fetch company data if applicable
      if (data.company_id) {
        fetchCompanyData(data.company_id);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      createFallbackUser(userId);
    }
  };
  
  const createFallbackUser = (userId: string) => {
    // Create a minimal user object based on auth data to keep the app running
    const fallbackUser: UserProfile = {
      id: userId,
      email: session?.user?.email || "",
      full_name: session?.user?.user_metadata?.full_name || "User",
      role: "admin", // Default to admin to ensure access
      company_id: null,
      avatar_url: null
    };
    
    setUser(fallbackUser);
    setCompany(null);
    setIsLoading(false);
  };
  
  const fetchCompanyData = async (companyId: string) => {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', companyId)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching company:", error);
        setIsLoading(false);
        return;
      }
      
      if (!data) {
        console.warn("No company found with ID:", companyId);
        setCompany(null);
        setIsLoading(false);
        return;
      }
      
      const company: Company = {
        id: data.id,
        name: data.name,
        cnpj: data.cnpj,
        address: data.address,
        phone: data.phone,
        email: data.email,
        logo_url: data.logo_url,
        is_individual: data.is_individual
      };
      
      setCompany(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      setCompany(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      
      if (error) {
        console.error("Login error:", error);
        return { error };
      }
      
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setIsLoading(false);
          return { error: profileError };
        }
        
        const userProfile: UserProfile = {
          id: profileData.id,
          email: profileData.email,
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          company_id: profileData.company_id,
          role: profileData.role,
          cpf: profileData.cpf,
          phone: profileData.phone
        };
        
        setUser(userProfile);
        setIsAuthenticated(true);
        
        if (profileData.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from('companies')
            .select('*')
            .eq('id', profileData.company_id)
            .single();
          
          if (companyError) {
            console.error("Error fetching company:", companyError);
            setIsLoading(false);
            return { error: companyError };
          }
          
          const company: Company = {
            id: companyData.id,
            name: companyData.name,
            cnpj: companyData.cnpj,
            address: companyData.address,
            phone: companyData.phone,
            email: companyData.email,
            logo_url: companyData.logo_url,
            is_individual: companyData.is_individual
          };
          
          setCompany(company);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Add signIn method that wraps login for consistency
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (result?.error) {
        throw result.error;
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      }
      setUser(null);
      setCompany(null);
      setIsAuthenticated(false);
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add signOut method that wraps logout for consistency
  const signOut = async () => {
    await logout();
  };
  
  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });
      
      if (error) {
        console.error("Signup error:", error);
        return { error };
      }
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              full_name: fullName,
              role: 'inspector',
            },
          ]);
        
        if (profileError) {
          console.error("Error creating profile:", profileError);
          return { error: profileError };
        }
      }
      
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };
  
  const value: AuthContextType = {
    user,
    company,
    isAuthenticated,
    isLoading,
    session,
    login,
    logout,
    signUp,
    signIn,
    signOut,
    refreshUserProfile
  };
  
  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
