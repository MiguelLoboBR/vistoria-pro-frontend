
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/contexts/types";

export function useAuthActions(fetchUserProfile: (userId: string) => Promise<void>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsSubmitting(true);
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
          setIsSubmitting(false);
          return { error: profileError };
        }
        
        // Profile data is fetched in the auth state change listener
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add signIn method that wraps login for consistency
  const signIn = async (email: string, password: string) => {
    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result?.error) {
        throw result.error;
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const logout = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      }
      navigate('/login');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Add signOut method that wraps logout for consistency
  const signOut = async () => {
    await logout();
  };
  
  const signUp = async (email: string, password: string, fullName: string) => {
    setIsSubmitting(true);
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
