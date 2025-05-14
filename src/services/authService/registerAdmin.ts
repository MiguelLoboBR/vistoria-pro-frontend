
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";
import { USER_ROLES } from "./types";

export const registerAdmin = async (
  email: string,
  password: string,
  fullName: string
): Promise<UserProfile | null> => {
  try {
    // 1. Create user with metadata that the trigger expects
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: USER_ROLES.ADMIN_TENANT,
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

    // 2. Return simulated profile (trigger will create the real one)
    return {
      id: userId,
      email: email,
      full_name: fullName,
      role: USER_ROLES.ADMIN_TENANT,
    } as UserProfile;
  } catch (error: any) {
    console.error("Error registering admin:", error.message);
    throw error;
  }
};
