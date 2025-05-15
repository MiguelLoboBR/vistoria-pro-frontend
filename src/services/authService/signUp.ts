
import { supabase } from "@/integrations/supabase/client";
import { USER_ROLES } from "./types";

export const signUp = async (email: string, password: string, fullName: string): Promise<any> => {
  try {
    // By default, sign up creates an admin user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          // Cast the role to the user_role enum type expected by the database
          role: USER_ROLES.ADMIN_TENANT,
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
