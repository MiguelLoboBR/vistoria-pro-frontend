
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Do not export useAuth from here to avoid circular dependency
// We only export auth methods

// Export auth methods for use in other components
export const useAuthMethods = () => {
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: "user",
          },
        },
      });
      
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error("Signup error:", error);
      throw error;
    }
  };
  
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
    } catch (error: any) {
      console.error("Logout error:", error);
      throw error;
    }
  };
  
  return {
    signIn,
    signUp,
    signOut
  };
};
