
import { supabase } from "@/integrations/supabase/client";

export const signIn = async (email: string, password: string) => {
  try {
    console.log("Iniciando login para:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    console.log("Login bem-sucedido:", data.session ? "Session obtida" : "Sem session");
    
    // Check user role from metadata and redirect accordingly
    const role = data.user?.user_metadata?.role || "inspector";
    
    console.log("User role:", role);
    
    if (role === "admin") {
      window.location.href = "/admin/dashboard";
    } else {
      window.location.href = "/inspector/dashboard";
    }
    
    return data;
  } catch (error) {
    console.error("Erro no login:", error);
    throw error;
  }
};
