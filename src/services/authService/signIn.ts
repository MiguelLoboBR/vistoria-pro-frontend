
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
    
    // Check user role from metadata or database
    let role = data.user?.user_metadata?.role;
    
    // Se o papel não estiver nos metadados, tente obtê-lo da tabela profiles
    if (!role && data.user) {
      try {
        const { data: profileData } = await supabase
          .rpc('get_current_user_role');
        
        if (profileData) {
          role = profileData;
          console.log("Role obtida do banco de dados:", role);
        }
      } catch (profileError) {
        console.error("Erro ao obter o papel do usuário:", profileError);
      }
    }
    
    console.log("User role:", role);
    
    // Redirecionamento baseado no papel
    if (role === "admin_master") {
      window.location.href = "/master/dashboard";
    } else if (role === "admin_tenant") {
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
