
import { supabase } from "@/integrations/supabase/client";
import { Company, UserProfile } from "@/contexts/types";

// Define and export the UserRole type
export type UserRole = "admin" | "inspector";

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
    // 1. Create user in Supabase auth with role=admin in metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "admin",
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

    // 2. Create user profile in Supabase DB with role=admin
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId,
          email: email,
          full_name: fullName,
          role: "admin",
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
      role: "admin",
    } as UserProfile;
  } catch (error: any) {
    console.error("Error registering admin:", error.message);
    throw error;
  }
};

const signUp = async (email: string, password: string, fullName: string): Promise<any> => {
  try {
    // By default, sign up creates an admin user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: "admin", // Default role is admin for direct sign ups
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      // Create a user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email,
            full_name: fullName,
            role: 'admin', // Default role is admin for direct sign ups
          },
        ]);

      if (profileError) {
        throw profileError;
      }
    }

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

// Modified to directly create company entry and update admin profile
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
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("No authenticated user found");
    }

    // Call the RPC function to create company and set up the admin with all the data
    const { data, error } = await supabase.rpc(
      "create_company_with_admin", 
      { 
        company_name: name, 
        company_cnpj: cnpj, 
        admin_id: user.id,
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
