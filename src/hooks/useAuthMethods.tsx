
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";

export function useAuthMethods(fetchUserProfile: (userId: string) => Promise<void>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const signIn = async (email: string, password: string) => {
    console.log("Iniciando login para:", email);
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      console.log("Login bem-sucedido:", data.session ? "Session obtida" : "Sem session");
      
      // Check user role from metadata and redirect accordingly
      const role = data.user?.user_metadata?.role || "inspector";
      
      console.log("User role:", role);
      
      if (role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/inspector/dashboard";
      }
      
      return data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsSubmitting(true);
      return await authService.signUp(email, password, fullName);
    } catch (error) {
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

  const createCompanyWithAdmin = async (
    name: string, 
    cnpj: string,
    address?: string,
    phone?: string,
    email?: string,
    logoUrl?: string,
    adminName?: string,
    adminCpf?: string,
    adminPhone?: string,
    adminEmail?: string
  ) => {
    try {
      setIsSubmitting(true);
      const companyId = await authService.createCompanyWithAdmin(
        name, 
        cnpj,
        address,
        phone,
        email,
        logoUrl,
        adminName,
        adminCpf,
        adminPhone,
        adminEmail
      );
      if (companyId) {
        // Instead of just refreshing the profile, force a reload to ensure we have fresh data
        window.location.href = "/admin/dashboard";
      }
      return companyId;
    } catch (error) {
      console.error("Error creating company:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshUserProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      await fetchUserProfile(session.user.id);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    createCompanyWithAdmin,
    refreshUserProfile,
    isSubmitting
  };
}
