
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import LoginForm from "@/components/auth/LoginForm";

export const InspectorLogin = () => {
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
