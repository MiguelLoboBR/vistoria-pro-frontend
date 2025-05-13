
import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/services/authService";
import CompanySetup from "./CompanySetup";
import { supabase } from "@/integrations/supabase/client";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { user, isLoading, session, company } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [verifyingAuth, setVerifyingAuth] = useState(true);

  useEffect(() => {
    const verifyAuthentication = async () => {
      console.log("AuthGuard - Verificando autenticação, isLoading:", isLoading);
      
      if (!isLoading) {
        // Verificação adicional da sessão diretamente do Supabase
        const { data } = await supabase.auth.getSession();
        console.log("AuthGuard - Sessão atual:", data.session ? "Ativa" : "Inativa");
        console.log("AuthGuard - Estado da sessão no contexto:", session ? "Presente" : "Ausente");
        console.log("AuthGuard - Dados do usuário:", user);
        
        // Se não há sessão no Supabase mas temos no contexto, atualize o contexto
        if (!data.session && session) {
          console.log("AuthGuard - Inconsistência detectada: Sessão inválida");
          // O useEffect no AuthContext lidará com isso
        }
        
        setVerifyingAuth(false);
      }
    };
    
    verifyAuthentication();
  }, [isLoading, session, user]);
  
  if (isLoading || verifyingAuth) {
    // Show loading state while checking authentication
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vistoria-blue mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }
  
  console.log("AuthGuard - Decisão de roteamento:", 
    !session ? "Sem sessão -> Redirecionar para login" : 
    !user ? "Sem dados de usuário -> Redirecionar para login" :
    !company && user.role === "admin" ? "Admin sem empresa -> CompanySetup" :
    !company && user.role === "inspector" ? "Inspetor sem empresa -> Mensagem" :
    requiredRole && user.role !== requiredRole ? "Papel incorreto -> Redirecionar para dashboard apropriado" :
    "Autenticado e autorizado -> Mostrar conteúdo"
  );

  if (!session || !user) {
    // Redirect to login if not authenticated
    console.log("AuthGuard - Redirecionando para login de:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has a company assigned
  if (!company) {
    // If admin but no company yet, show company setup
    if (user.role === "admin") {
      return <CompanySetup />;
    } else {
      // If inspector but no company yet, show info page
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Vistoriador não associado</h1>
          <p className="text-center mb-6">
            Sua conta ainda não foi associada a uma empresa. Por favor, entre em contato com o administrador da sua empresa para ser adicionado.
          </p>
          <button
            onClick={() => navigate("/login/inspector")}
            className="px-4 py-2 bg-vistoria-blue text-white rounded-md hover:bg-vistoria-darkBlue"
          >
            Voltar para o login
          </button>
        </div>
      );
    }
  }

  // Check if user has the required role
  if (requiredRole && user.role !== requiredRole) {
    console.log(`AuthGuard - Papel requerido: ${requiredRole}, Papel do usuário: ${user.role} - Redirecionando`);
    // Redirect to appropriate dashboard based on actual role
    if (user.role === "admin") {
      return <Navigate to="/admin/tenant/dashboard" replace />;
    } else {
      return <Navigate to="/app/inspector/dashboard" replace />;
    }
  }

  console.log("AuthGuard - Renderizando conteúdo protegido");
  return <>{children}</>;
};

export default AuthGuard;
