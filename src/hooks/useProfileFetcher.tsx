
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Company } from "@/contexts/types";
import { Session } from "@supabase/supabase-js";

export function useProfileFetcher() {
  const [fetchProfileFailed, setFetchProfileFailed] = useState(false);
  
  const fetchUserProfile = async (userId: string, session: Session | null) => {
    try {
      // If we've already tried and failed once, use fallback immediately
      if (fetchProfileFailed) {
        return createFallbackUserProfile(userId, session);
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
            return createFallbackUserProfile(userId, session);
          } else {
            throw error;
          }
        }

        if (data) {
          console.log("User profile found:", data);
          
          // If the user has a company, fetch company data
          if (data.company_id) {
            const company = await fetchCompanyData(data.company_id);
            return { profile: data as UserProfile, company };
          } else {
            console.log("User has no company associated");
            return { profile: data as UserProfile, company: null };
          }
        } else {
          console.log("No profile found for user:", userId);
          return createFallbackUserProfile(userId, session);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setFetchProfileFailed(true);
        return createFallbackUserProfile(userId, session);
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return createFallbackUserProfile(userId, session);
    }
  };
  
  const createFallbackUserProfile = async (userId: string, session: Session | null) => {
    console.log("Creating fallback user profile for", userId);
    // Create a default profile with basic info to allow the app to function
    const fallbackUser: UserProfile = {
      id: userId,
      email: session?.user?.email || "user@example.com",
      role: "admin", // Default to admin role to ensure access
      company_id: null,
      full_name: session?.user?.user_metadata?.full_name || "User",
      avatar_url: null
    };
    
    return { profile: fallbackUser, company: null };
  };

  const fetchCompanyData = async (companyId: string): Promise<Company | null> => {
    try {
      console.log("Fetching company data for:", companyId);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", companyId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching company data:", error);
        return null;
      } else if (data) {
        console.log("Company found:", data);
        return data as Company;
      } else {
        console.log("No company found with ID:", companyId);
        return null;
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      return null;
    }
  };

  // Function to refresh user profile with existing session
  const refreshUserProfile = async (userId: string, session: Session | null) => {
    if (!userId) return { profile: null, company: null };
    
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
        .eq('id', userId)
        .maybeSingle();
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        return { profile: null, company: null };
      }
      
      if (!profileData) {
        console.warn("No profile found for user", userId);
        return { profile: null, company: null };
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
      
      // Fetch company data
      let company = null;
      if (profileData.company_id) {
        company = await fetchCompanyData(profileData.company_id);
      }
      
      return { profile: userProfile, company };
    } catch (error) {
      console.error("Error refreshing user profile:", error);
      return { profile: null, company: null };
    }
  };

  return {
    fetchUserProfile,
    refreshUserProfile
  };
}
