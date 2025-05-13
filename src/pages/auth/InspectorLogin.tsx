
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import LoginForm from "@/components/auth/LoginForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const InspectorLogin = () => {
  const { session, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      console.log("InspectorLogin: Verificando autenticação...");
      setCheckingSession(true);
      
      try {
        // Verificar diretamente a sessão do Supabase
        const { data } = await supabase.auth.getSession();
        console.log("InspectorLogin: Sessão do Supabase:", data.session ? "Existe" : "Não existe");
        
        // Se temos uma sessão ativa, verificar o perfil diretamente
        if (data.session) {
          // Use try-catch here to properly handle any profile fetch errors
          try {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("role, company_id")
              .eq("id", data.session.user.id)
              .maybeSingle(); // Use maybeSingle instead of single to prevent errors
              
            console.log("InspectorLogin: Dados do perfil:", profileData, "Erro:", profileError);
            
            if (!profileError && profileData) {
              console.log("InspectorLogin: Usuário autenticado, redirecionando com base no papel:", profileData.role);
              
              // Force redirect to avoid any race conditions
              if (profileData.role === "admin") {
                window.location.href = "/admin/tenant/dashboard";
                return;
              } else {
                window.location.href = "/app/inspector/dashboard";
                return;
              }
            } else if (profileError) {
              console.error("Erro ao buscar perfil:", profileError);
            }
          } catch (err) {
            console.error("Erro durante verificação de perfil:", err);
          }
        }
        
        // Usar o contexto de autenticação como fallback
        if (session && user && !isLoading) {
          console.log("InspectorLogin: Usuário autenticado via contexto, redirecionando...");
          
          if (user.role === "admin") {
            window.location.href = "/admin/tenant/dashboard";
          } else {
            window.location.href = "/app/inspector/dashboard";
          }
        }
      } catch (error) {
        console.error("InspectorLogin: Erro ao verificar autenticação:", error);
      } finally {
        setCheckingSession(false);
      }
    };
    
    checkAuthentication();
  }, [session, user, isLoading, navigate]);

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
  );
};

export default InspectorLogin;
