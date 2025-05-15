
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";

export const useAuthMethods = () => {
  const { session } = useAuthContext() || {};

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error signing in:", error);
      return { data: null, error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error("Error signing up:", error);
      return { data: null, error };
    }
  };

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, []);
  
  const refreshUserProfile = useCallback(async () => {
    try {
      if (!session?.user?.id) {
        console.warn("Cannot refresh profile: no user ID in session");
        return;
      }
      
      // Fetch updated profile data from database
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error("Error refreshing user profile:", error);
    }
  }, [session?.user?.id]);

  // Adding registerInspector function to be exported
  const registerInspector = async (email: string, password: string, fullName: string, companyId: string) => {
    try {
      return await authService.registerInspector(email, password, fullName, companyId);
    } catch (error) {
      console.error("Error registering inspector:", error);
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    refreshUserProfile,
    registerInspector
  };
};

// Re-export for compatibility
export const useAuth = useAuthContext;
