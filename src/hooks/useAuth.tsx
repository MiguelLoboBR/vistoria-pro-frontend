
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAuthMethods = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error("Login error:", error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsSubmitting(true);
    try {
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
      return data;
    } catch (error: any) {
      console.error("Registration error:", error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error("Logout error:", error.message);
      throw error;
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    isSubmitting,
  };
};
