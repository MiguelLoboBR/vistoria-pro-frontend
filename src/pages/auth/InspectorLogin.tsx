import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import LoginForm from "@/components/auth/LoginForm";
import { loginAndRedirect } from "@/services/loginFlow";

const InspectorLogin = () => {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          await loginAndRedirect((path, options) => navigate(path, options));
        }
      } catch (err: any) {
        console.error("Erro ao verificar sessão:", err.message);
      } finally {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [navigate]);

  if (checkingSession) {
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
