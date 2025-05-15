// src/services/loginFlow.ts
import { supabase } from "@/integrations/supabase/client";

export async function loginAndRedirect(
  navigate: (path: string, options?: { replace?: boolean }) => void,
  replace: boolean = true
) {
  // Obter usuário autenticado
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    console.error("Erro ao obter usuário autenticado:", userError);
    throw new Error("Erro ao obter usuário autenticado.");
  }

  // Obter o papel do usuário
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profile?.role) {
    console.error("Erro ao obter o papel do usuário:", profileError);
    throw new Error("Erro ao obter o papel do usuário.");
  }

  const role = profile.role;

  // Redirecionar conforme o papel
  if (role === "admin_master") {
    navigate("/master/dashboard", { replace });
  } else if (role === "admin_tenant") {
    navigate("/admin/dashboard", { replace });
  } else if (role === "inspector") {
    navigate("/inspector/dashboard", { replace });
  } else {
    console.warn(`Papel desconhecido: ${role}`);
    throw new Error(`Papel desconhecido: ${role}`);
  }
}
