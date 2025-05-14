
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";

export function useAuthActions(fetchUserProfile: (userId: string) => Promise<void>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error("Erro ao fazer login: " + error.message);
        return { error };
      }

      // If sign in is successful, fetch the user profile
      if (data.session && data.user) {
        // We'll use the session change event to trigger profile fetching
        return;
      }

      return undefined;
    } catch (error: any) {
      toast.error("Erro inesperado: " + error.message);
      return { error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      setIsSubmitting(true);
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsSubmitting(true);
      return await authService.signUp(email, password, fullName);
    } catch (error: any) {
      return { error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error("Erro ao fazer login: " + error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const signOut = async () => {
    try {
      setIsSubmitting(true);
      await authService.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    login,
    logout,
    signUp,
    signIn,
    signOut,
    isSubmitting
  };
}
