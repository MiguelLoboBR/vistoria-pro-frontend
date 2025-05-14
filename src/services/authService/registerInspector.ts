
import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "../types";

export const registerInspector = async (
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
