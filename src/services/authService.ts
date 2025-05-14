
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
      // Check specifically for the email not confirmed error
      if (error.message.includes("Email not confirmed")) {
        // Send another confirmation email if needed
        await supabase.auth.resend({
          type: 'signup',
          email: email,
        });
        throw new Error("Email não confirmado. Um novo link de confirmação foi enviado para seu e-mail.");
      }
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
        // Removed the emailRedirectTo since it might be causing issues
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    // If successful but confirmation is required, inform the user
    if (data.session === null && data.user !== null) {
      // This means email confirmation is required
      return { requiresEmailConfirmation: true, user: data.user };
    }

    return { session: data.session, user: data.user };
  },

  async registerInspector(email: string, password: string, fullName: string, companyId: string) {
    try {
      // First, create the user
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Automatically confirm the email
        user_metadata: {
          full_name: fullName,
          role: "inspector",
          company_id: companyId
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error("Erro ao criar usuário");
      }

      // Link inspector to the company
      try {
        await this.addInspectorToCompany(data.user.id, companyId);
      } catch (error: any) {
        console.error("Error linking inspector to company:", error);
        throw new Error(`Erro ao vincular inspetor à empresa: ${error.message}`);
      }

      return data.user;
    } catch (error: any) {
      // If this is a regular API error and not an admin function error,
      // try the regular signup method
      if (error.message.includes("auth.admin") || error.message.includes("permission denied")) {
        console.log("Falling back to regular signup method for inspector...");
        return this.registerInspectorFallback(email, password, fullName, companyId);
      }
      throw error;
    }
  },

  // Fallback method using regular signup
  async registerInspectorFallback(email: string, password: string, fullName: string, companyId: string) {
    // Create the user with regular signup (will require email confirmation)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "inspector",
          company_id: companyId
        }
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("Erro ao criar usuário");
    }

    // Link inspector to the company
    try {
      await this.addInspectorToCompany(data.user.id, companyId);
    } catch (error: any) {
      console.error("Error linking inspector to company:", error);
      // If adding to company fails, we should clean up the created user
      // This would require admin privileges, which we don't have in the client
      // We'll just log the error for now
    }

    toast.info("Um e-mail de confirmação foi enviado para o vistoriador. Ele precisa confirmar para acessar o sistema.");
    return data.user;
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
    
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.session.user.id)
        .maybeSingle();
  
      if (error) {
        console.error("Error fetching user profile:", error);
        // Return a fallback profile based on session metadata
        return {
          id: session.session.user.id,
          email: session.session.user.email!,
          full_name: session.session.user.user_metadata.full_name,
          role: session.session.user.user_metadata.role as UserRole || "inspector",
          company_id: session.session.user.user_metadata.company_id
        };
      }
  
      return data as UserProfile;
    } catch (error) {
      console.error("Error in getUserProfile:", error);
      // Return fallback profile
      return {
        id: session.session.user.id,
        email: session.session.user.email!,
        full_name: session.session.user.user_metadata.full_name,
        role: session.session.user.user_metadata.role as UserRole || "inspector",
        company_id: session.session.user.user_metadata.company_id
      };
    }
  },

  async getCompany(companyId: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .eq("id", companyId)
      .maybeSingle();

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

    console.log("Creating company for user ID:", session.session.user.id);
    console.log("Company details:", { name, cnpj });

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

    console.log("Company creation successful, returned data:", data);
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
  },
  
  async updateUserProfile(updates: Partial<UserProfile>): Promise<void> {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session.session) {
      toast.error("Você precisa estar logado para atualizar seu perfil");
      return;
    }
    
    // Update the profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", session.session.user.id);
      
    if (profileError) {
      console.error("Error updating profile:", profileError);
      throw new Error(profileError.message);
    }
    
    // Also update metadata in auth.users
    const { error: metadataError } = await supabase.auth.updateUser({
      data: updates
    });
    
    if (metadataError) {
      console.error("Error updating user metadata:", metadataError);
      // Don't throw here as the profile update succeeded
    }
  }
};
