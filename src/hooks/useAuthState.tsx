
import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Company } from "@/contexts/types";
import { UserRole } from "@/services/types";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchProfileFailed, setFetchProfileFailed] = useState(false);
  
  useEffect(() => {
    console.log("AuthContext initializing...");
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, "Has session:", !!currentSession);
        setSession(currentSession);
        
        if (currentSession) {
          // Reset fetch fail flag on new session
          setFetchProfileFailed(false);
          
          // Use a timeout to prevent potential lock issues when fetching profile
          setTimeout(() => {
            fetchUserProfile(currentSession.user.id);
          }, 0);
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

  const fetchUserProfile = async (userId: string) => {
    try {
      // If we've already tried and failed once, use fallback immediately
      if (fetchProfileFailed) {
        createFallbackUserProfile(userId);
        return;
      }
      
      console.log("Fetching user profile for:", userId);
      
      try {
        // Try using RPC function to avoid RLS issues
        const { data, error } = await supabase
          .rpc('get_user_role_safely')
          .then(async (roleResult) => {
            if (roleResult.error) {
              throw roleResult.error;
            }
            
            // If we successfully got the role, we can now try to fetch the full profile
            return supabase
              .from("profiles")
              .select("id, email, full_name, role, company_id, avatar_url, cpf, phone")
              .eq("id", userId)
              .maybeSingle();
          });
        
        if (error) {
          if (error.message.includes('infinite recursion') || error.code === '42P17') {
            console.warn("Detected infinite recursion in policy - using fallback approach");
            createFallbackUserProfile(userId);
            return;
          } else {
            throw error;
          }
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
          createFallbackUserProfile(userId);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setFetchProfileFailed(true);
        createFallbackUserProfile(userId);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      createFallbackUserProfile(userId);
    }
  };
  
  const createFallbackUserProfile = (userId: string) => {
    console.log("Creating fallback user profile for", userId);
    // Create a default profile with basic info to allow the app to function
    const fallbackUser: UserProfile = {
      id: userId,
      email: session?.user?.email || "user@example.com",
      role: "admin_tenant", // Updated from "admin" to "admin_tenant"
      company_id: null,
      full_name: session?.user?.user_metadata?.full_name || "User",
      avatar_url: null
    };
    
    setUser(fallbackUser);
    setCompany(null);
    setIsLoading(false);
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
        console.error("Error fetching company data:", error);
        setCompany(null);
      } else if (data) {
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

  return {
    session,
    user,
    company,
    isLoading,
    setUser,
    setCompany,
    setIsLoading,
    fetchUserProfile
  };
}
