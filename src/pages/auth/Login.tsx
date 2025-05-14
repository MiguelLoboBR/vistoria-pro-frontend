import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/services/types"; // Import from services/types

interface LoginProps {
  role: UserRole;
}

const Login = ({ role = "admin_tenant" }: LoginProps) => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);
  const isInspector = role === "inspector";

  useEffect(() => {
    const checkAuthentication = async () => {
      console.log("Login: Verificando autenticação...");
      setCheckingSession(true);
      
      try {
        // Check Supabase session directly
        const { data } = await supabase.auth.getSession();
        console.log("Login: Supabase session:", data.session ? "Exists" : "Does not exist");
        
        if (data.session) {
          // If we have an active session, redirect to the appropriate dashboard
          const redirectPath = isInspector ? "/inspector/dashboard" : "/admin/dashboard";
          console.log(`Login: User authenticated, redirecting to ${redirectPath}`);
          window.location.href = redirectPath;
          return;
        }
        
        // Use auth context as fallback
        if (session && !isLoading) {
          console.log("Login: User authenticated via context, redirecting...");
          const redirectPath = isInspector ? "/inspector/dashboard" : "/admin/dashboard";
          navigate(redirectPath);
        }
      } catch (error) {
        console.error("Login: Error checking authentication:", error);
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkAuthentication();
  }, [session, isLoading, navigate, isInspector]);

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

  return isInspector ? (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Top Banner */}
      <div className="bg-vistoria-blue md:hidden text-white p-4 text-center">
        <Logo size="sm" showText={false} className="mx-auto mb-2" />
        <h1 className="text-xl font-bold">VistoriaPro</h1>
        <p className="text-sm">App para Vistoriadores</p>
      </div>
      
      {/* Left Side (Hidden on mobile) */}
      <div className="hidden md:block md:w-1/2 bg-vistoria-blue text-white p-8 flex flex-col justify-between">
        <div>
          <Logo className="mb-12" />
          <h1 className="text-3xl font-bold mb-4">App do Vistoriador</h1>
          <p className="text-xl opacity-90 mb-8">
            Sua ferramenta completa para realizar vistorias de forma eficiente e profissional.
          </p>
        </div>
        
        <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <div className="bg-white rounded-full p-1 mr-4">
              <svg className="h-6 w-6 text-vistoria-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p>Faça vistorias mesmo sem internet</p>
          </div>
          <div className="flex items-center mb-4">
            <div className="bg-white rounded-full p-1 mr-4">
              <svg className="h-6 w-6 text-vistoria-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p>Capture fotos com geolocalização</p>
          </div>
          <div className="flex items-center">
            <div className="bg-white rounded-full p-1 mr-4">
              <svg className="h-6 w-6 text-vistoria-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p>Gere laudos profissionais instantâneos</p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center p-6 md:p-12">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Acesso do Vistoriador</h2>
            <p className="text-gray-500 mt-2">Entre com suas credenciais para acessar</p>
          </div>
          
          <LoginForm userType="inspector" />
          
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Problemas para acessar? Entre em contato com sua imobiliária.</p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Logo className="mx-auto mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold">Login Administrativo</h1>
            <p className="text-gray-500 mt-2">Acesse o painel da sua empresa</p>
          </div>
          
          <LoginForm userType="admin" />
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>Não tem uma conta? <Link to="/register" className="text-vistoria-blue font-medium hover:underline">Entre em contato</Link></p>
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
              Com o Painel Administrativo do VistoriaPro, você tem controle completo sobre vistoriadores, agendamentos e relatórios em uma interface simples e intuitiva.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-vistoria-green">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">Gerenciamento completo de vistorias</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-vistoria-green">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">Controle da equipe de vistoriadores</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-vistoria-green">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">Relatórios e laudos personalizados</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
