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
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
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
          .single();
        
        if (companyError) {
          console.error("Error fetching company:", companyError);
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
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setSession(session);
        setIsAuthenticated(true);
        
        const userId = session.user.id;
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setIsLoading(false);
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
            .single();
          
          if (companyError) {
            console.error("Error fetching company:", companyError);
            setIsLoading(false);
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
      }
      
      setIsLoading(false);
    };
    
    fetchSession();
    
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setSession(session);
        fetchSession();
        setIsAuthenticated(true);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setCompany(null);
        setSession(null);
        setIsAuthenticated(false);
      }
    });
  }, [navigate]);
  
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
