
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";
import { USER_ROLES } from "./types";

export const registerInspector = async (
  email: string,
  password: string,
  fullName: string,
  companyId: string
): Promise<UserProfile | null> => {
  try {
    // 1. Create user in Supabase auth with proper metadata
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_id: companyId,
          role: USER_ROLES.INSPECTOR,
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

    // Return inspector profile
    return {
      id: userId,
      email: email,
      full_name: fullName,
      company_id: companyId,
      role: USER_ROLES.INSPECTOR,
    } as UserProfile;
  } catch (error: any) {
    console.error("Error registering inspector:", error.message);
    throw error;
  }
};
