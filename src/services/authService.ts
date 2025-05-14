
import { supabase } from "@/integrations/supabase/client";
import { Company, UserProfile } from "@/contexts/types";

// Define and export the UserRole type
export type UserRole = "admin_master" | "admin_tenant" | "inspector";

const registerInspector = async (
  email: string,
  password: string,
  fullName: string,
  companyId: string
): Promise<UserProfile | null> => {
  try {
    // 1. Create user in Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_id: companyId,
          role: "inspector",
        },
      },
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const userId = authData.user?.id;

    if (!userId) {
      throw new Error("User ID not found after signup");
    }

    // 2. Create user profile in Supabase DB
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId,
          email: email,
          full_name: fullName,
          company_id: companyId,
          role: "inspector",
        },
      ]);

    if (profileError) {
      // If profile creation fails, delete the user from auth
      await supabase.auth.admin.deleteUser(userId);
      throw new Error(profileError.message);
    }

    // 3. Return inspector profile
    return {
      id: userId,
      email: email,
      full_name: fullName,
      company_id: companyId,
      role: "inspector",
    } as UserProfile;
  } catch (error: any) {
    console.error("Error registering inspector:", error.message);
    throw error;
  }
};

const registerAdmin = async (
  email: string,
  password: string,
  fullName: string
): Promise<UserProfile | null> => {
  try {
    // 1. Create user in Supabase auth with role=admin_tenant in metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "admin_tenant", // Updated from "admin" to "admin_tenant"
        },
      },
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const userId = authData.user?.id;

    if (!userId) {
      throw new Error("User ID not found after signup");
    }

    // 2. Create user profile in Supabase DB with role=admin_tenant
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId,
          email: email,
          full_name: fullName,
          role: "admin_tenant", // Updated from "admin" to "admin_tenant"
        },
      ]);

    if (profileError) {
      // If profile creation fails, delete the user from auth
      await supabase.auth.admin.deleteUser(userId);
      throw new Error(profileError.message);
    }

    // 3. Return admin profile
    return {
      id: userId,
      email: email,
      full_name: fullName,
      role: "admin_tenant" as UserRole, // Type assertion to ensure compatibility
    } as UserProfile;
  } catch (error: any) {
    console.error("Error registering admin:", error.message);
    throw error;
  }
};

const signUp = async (email: string, password: string, fullName: string): Promise<any> => {
  try {
    // By default, sign up creates an admin_tenant user (was admin before)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "admin_tenant", // Updated from "admin" to "admin_tenant"
        },
      },
    });

    if (error) {
      throw error;
    }

    // Removed profile creation since it will be handled by the database trigger
    // The profile will be automatically created by the database trigger

    return data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Modified to work without requiring authenticated session
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
): Promise<string | null> => {
  try {
    // Call the RPC function directly without requiring authentication
    // The function will use the provided data to create the company
    const { data, error } = await supabase.rpc(
      "create_company_with_admin", 
      { 
        company_name: name, 
        company_cnpj: cnpj, 
        admin_id: null, // Will be linked later when user confirms email
        company_address: address || null,
        company_phone: phone || null,
        company_email: email || null,
        company_logo_url: logoUrl || null,
        admin_name: adminName || null,
        admin_cpf: adminCpf || null,
        admin_phone: adminPhone || null,
        admin_email: adminEmail || null
      }
    );

    if (error) {
      throw error;
    }

    return data as string;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};

export const authService = {
  registerInspector,
  registerAdmin,
  signUp,
  signOut,
  createCompanyWithAdmin
};

export { type Company, type UserProfile };
