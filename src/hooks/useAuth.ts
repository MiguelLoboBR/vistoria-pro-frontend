
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth as useAuthContext } from "@/contexts/AuthContext";

export const useAuthMethods = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting to sign in:", email);
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      console.log("Sign in successful:", data.session ? "Session established" : "No session");
      return { data };
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) throw error;
      
      return { data };
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserProfile = async () => {
    // This function should be implemented according to your needs
    console.log("Refreshing user profile...");
    // Logic to refresh user profile would go here
  };

  return {
    isLoading,
    signIn,
    signUp,
    signOut,
    refreshUserProfile
  };
};

export const useAuth = () => {
  return useAuthContext();
};
