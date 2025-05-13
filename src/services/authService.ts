
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type UserRole = "admin" | "inspector";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company_id?: string;
  role: UserRole;
}

export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  admin_id: string;
}

export const authService = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.session;
  },

  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "admin", // Explicitly set role to admin for new users during registration
        },
        emailRedirectTo: window.location.origin + "/company-setup",
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.session;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  },

  async getUserProfile(): Promise<UserProfile | null> {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) return null;
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.session.user.id)
      .single();

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    return data as UserProfile;
  },

  async getCompany(companyId: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .single();

    if (error) {
      console.error("Error fetching company:", error);
      return null;
    }

    return data as Company;
  },

  async createCompanyWithAdmin(name: string, cnpj: string): Promise<string | null> {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      toast.error("Você precisa estar logado para criar uma empresa");
      return null;
    }

    const { data, error } = await supabase.rpc(
      "create_company_with_admin", 
      { 
        company_name: name, 
        company_cnpj: cnpj, 
        admin_id: session.session.user.id 
      }
    );

    if (error) {
      console.error("Error creating company:", error);
      throw new Error(error.message);
    }

    return data;
  },

  async addInspectorToCompany(inspectorId: string, companyId: string): Promise<void> {
    const { error } = await supabase.rpc(
      "add_inspector_to_company",
      {
        inspector_id: inspectorId,
        company_id: companyId
      }
    );

    if (error) {
      console.error("Error adding inspector to company:", error);
      throw new Error(error.message);
    }
  }
};
