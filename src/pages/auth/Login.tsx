
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { USER_ROLES } from "@/services/authService/types";
import { loginAndRedirect } from "@/services/loginFlow";

const Login = () => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      setCheckingSession(true);

      try {
        const { data } = await supabase.auth.getSession();
        const currentSession = data.session;

        if (currentSession || (session && !isLoading)) {
          await loginAndRedirect((path, options) => navigate(path, options));
        }
      } catch (error: any) {
        console.error("Login: Erro ao verificar autenticação:", error.message);
      } finally {
        setCheckingSession(false);
      }
    };

    checkAuthentication();
  }, [session, isLoading, navigate]);

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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold">Login</h1>
            <p className="text-gray-500 mt-2">Acesse sua conta com seu e-mail e senha</p>
          </div>

          <LoginForm role={USER_ROLES.ADMIN_TENANT} />

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Não tem uma conta? <Link to="/register" className="text-vistoria-blue font-medium hover:underline">Cadastre-se</Link></p>
          </div>
        </div>

        <div className="mt-16 text-center text-gray-500 text-xs">
          <p>VistoriaPro © {new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
      </div>

      {/* Right Side - Image/Banner */}
      <div className="hidden lg:block lg:w-1/2 bg-vistoria-blue/10 relative">
        <div className="absolute inset-0 flex flex-col justify-center p-16">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gerencie suas vistorias com eficiência</h2>
            <p className="text-gray-600 mb-6">
              Com o VistoriaPro, você tem controle completo sobre vistoriadores, agendamentos e relatórios em uma interface simples e intuitiva.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
