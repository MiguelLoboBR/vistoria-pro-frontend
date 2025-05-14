
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, UserRole } from "../types";

export const registerAdmin = async (
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
