
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

export const AuthErrorState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <Logo className="mx-auto mb-4" />
        <h2 className="text-xl font-bold text-red-600 mb-2">Não autenticado</h2>
        <p className="mb-4">Você precisa estar logado para configurar seu perfil.</p>
        <Button 
          onClick={() => navigate('/login')}
          className="bg-vistoria-blue hover:bg-vistoria-darkBlue"
        >
          Ir para o Login
        </Button>
      </div>
    </div>
  );
};
