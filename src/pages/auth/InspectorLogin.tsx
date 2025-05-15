import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const InspectorLogin = () => {
  const { session, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      setCheckingSession(true);

      try {
        const { data } = await supabase.auth.getSession();
        const currentSession = data.session;

        if (currentSession) {
          const userRole = user?.role || currentSession.user.user_metadata?.role;

          if (userRole === "inspector") {
            navigate("/inspector/dashboard", { replace: true });
          } else if (userRole === "admin_tenant" || userRole === "admin_master") {
            navigate("/admin/dashboard", { replace: true });
          }
          return;
        }

        // fallback para contexto
        if (session && !isLoading) {
          if (user?.role === "inspector") {
            navigate("/inspector/dashboard", { replace: true });
          } else if (user?.role === "admin_tenant" || user?.role === "admin_master") {
            navigate("/admin/dashboard", { replace: true });
          }
        }
      } catch (error) {
        console.error("InspectorLogin: erro ao verificar sessão", error);
      } finally {
        setCheckingSession(false);
      }
    };

    checkAuthentication();
  }, [session, isLoading, navigate, user]);

  if (isLoading || checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vistoria-blue mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <LoginForm role="inspector" />
      </div>
    </div>
  );
};

export default InspectorLogin;
