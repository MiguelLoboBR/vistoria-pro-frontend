// src/services/loginFlow.ts
import { supabase } from "@/integrations/supabase/client";

export async function loginAndRedirect(
  navigate: (path: string, options?: { replace?: boolean }) => void,
  replace: boolean = true
) {
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user) {
    throw new Error("Erro ao obter usuário autenticado.");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userData.user.id)
    .single();

  if (profileError || !profile?.role) {
    throw new Error("Erro ao obter o papel do usuário.");
  }

  const role = profile.role;

  if (role === "admin_master") {
    navigate("/master/dashboard", { replace });
  } else if (role === "admin_tenant") {
    navigate("/admin/dashboard", { replace });
  } else if (role === "inspector") {
    navigate("/inspector/dashboard", { replace });
  } else {
    throw new Error(`Papel desconhecido: ${role}`);
  }
}
