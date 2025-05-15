
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";
import { USER_ROLES } from "@/services/authService/types";

export function useAuthMethods() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  /**
   * Sign in a user with email and password
   */
  const signIn = async (email: string, password: string) => {
    try {
      setIsSubmitting(true);
      console.log("Signing in user:", email);
      
      const data = await authService.signIn(email, password);
      
      return data;
    } catch (error: any) {
      console.error("Error signing in:", error);
      toast.error("Login failed: " + error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Sign up a new user with email, password and name
   */
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsSubmitting(true);
      return await authService.signUp(email, password, fullName);
    } catch (error: any) {
      toast.error("Registration failed: " + error.message);
      return { error };
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Sign out the current user and redirect to login page
   */
  const signOut = async () => {
    try {
      setIsSubmitting(true);
      await authService.signOut();
      navigate("/login");
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Sign out failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Create a company with an admin user
   */
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
      return companyId;
    } catch (error: any) {
      console.error("Error creating company:", error);
      toast.error("Company creation failed: " + error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Register a new admin user
   */
  const registerAdmin = async (email: string, password: string, fullName: string) => {
    try {
      setIsSubmitting(true);
      return await authService.registerAdmin(email, password, fullName);
    } catch (error: any) {
      toast.error("Admin registration failed: " + error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Register a new inspector user
   */
  const registerInspector = async (email: string, password: string, fullName: string, companyId: string) => {
    try {
      setIsSubmitting(true);
      return await authService.registerInspector(email, password, fullName, companyId);
    } catch (error: any) {
      toast.error("Inspector registration failed: " + error.message);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Refresh the user profile
   */
  const refreshUserProfile = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        // Profile fetching will be handled by the auth state change listener
        console.log("User session refreshed");
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  return {
    signIn,
    signUp,
    signOut,
    registerAdmin,
    registerInspector,
    createCompanyWithAdmin,
    refreshUserProfile,
    isSubmitting,
    USER_ROLES
  };
}

// For backward compatibility
export function useAuth() {
  return useAuthMethods();
}
