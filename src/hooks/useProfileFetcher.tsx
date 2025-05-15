
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, Company } from "@/contexts/types";

export function useProfileFetcher() {
  // Function to fetch user profile by ID
  const fetchUserProfile = async (userId: string) => {
    let profile: UserProfile | null = null;
    let company: Company | null = null;

    try {
      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }

      if (profileData) {
        profile = profileData as UserProfile;

        // If the profile has a company_id, also fetch the company
        if (profile.company_id) {
          const { data: companyData, error: companyError } = await supabase
            .from("companies")
            .select("*")
            .eq("id", profile.company_id)
            .single();

          if (companyError) {
            console.error("Error fetching company:", companyError);
          } else if (companyData) {
            company = companyData as Company;
          }
        }
      }

      return { profile, company };
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
      return { profile: null, company: null };
    }
  };

  // Function to refresh user profile (basically an alias to fetchUserProfile)
  const refreshUserProfile = async (userId: string) => {
    return await fetchUserProfile(userId);
  };

  return { fetchUserProfile, refreshUserProfile };
}
