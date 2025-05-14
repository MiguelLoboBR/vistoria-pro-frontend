
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import RegisterLogo from "@/components/auth/RegisterLogo";

export const RegisterSuccess = () => {
  const location = useLocation();
  const registeredEmail = location.state?.email || "";
  const hasError = location.state?.error || false;
  const errorMessage = location.state?.errorMessage || "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-8">
          <RegisterLogo className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold">Cadastro Realizado!</h1>
          <p className="text-gray-600 mt-3">
            Enviamos um email de confirmação para:
          </p>
          <p className="font-medium text-vistoria-blue mt-1">{registeredEmail}</p>
        </div>
        
        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <InfoIcon className="h-5 w-5 text-blue-500" />
          <AlertTitle className="text-blue-700">Por favor, confirme seu email</AlertTitle>
          <AlertDescription className="text-blue-600">
            Você precisa confirmar seu email antes de poder fazer login. Por favor, verifique sua caixa de entrada e clique no link de confirmação.
          </AlertDescription>
        </Alert>
        
        {hasError && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <InfoIcon className="h-5 w-5 text-red-500" />
            <AlertTitle className="text-red-700">Atenção</AlertTitle>
            <AlertDescription className="text-red-600">
              Seu usuário foi criado, mas houve um erro ao criar a empresa. Você poderá configurar sua empresa após confirmar seu email e fazer login.
              {errorMessage && <div className="mt-2 text-sm">{errorMessage}</div>}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <Button 
            className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue"
            asChild
          >
            <Link to="/login">Ir para o Login</Link>
          </Button>
          
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Não recebeu o email? Verifique sua caixa de spam ou entre em contato conosco.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterSuccess;
