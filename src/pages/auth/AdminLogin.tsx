
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";

export const AdminLogin = () => {
  const { session, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar se já estiver autenticado
    if (session && user && !isLoading) {
      console.log("AdminLogin: Usuário já autenticado, redirecionando...");
      
      if (user.role === "admin") {
        navigate("/admin/tenant/dashboard");
      } else {
        navigate("/app/inspector/dashboard");
      }
    }
  }, [session, user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vistoria-blue"></div>
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

export default AdminLogin;
