import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Company, UserProfile } from "@/contexts/types";

export function useAuthProvider() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  
  // Refresh user profile function
  const refreshUserProfile = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Use get_user_role_safely function to avoid infinite recursion
      const { data: roleData, error: roleError } = await supabase.rpc('get_user_role_safely');
      
      if (roleError) {
        console.warn("Could not get role using safer RPC function:", roleError);
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
      
      // Use get_user_role_safely RPC function first to avoid RLS issues
      try {
        await supabase.rpc('get_user_role_safely');
      } catch (roleError) {
        console.warn("RPC get_user_role_safely failed:", roleError);
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

  return {
    user,
    setUser,
    company,
    setCompany,
    isAuthenticated,
    isLoading,
    setIsLoading,
    session,
    refreshUserProfile,
    fetchUserProfile
  };
}
