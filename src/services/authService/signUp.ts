
import { supabase } from "@/integrations/supabase/client";
import { USER_ROLES } from "./types";

export const signUp = async (email: string, password: string, fullName: string): Promise<any> => {
  try {
    // Registrar um novo usuário com o papel admin_tenant
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: USER_ROLES.ADMIN_TENANT, // Usar a constante para garantir tipo correto
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};
