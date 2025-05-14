
import { Link } from "react-router-dom";
import RegisterLogo from "@/components/auth/RegisterLogo";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { RegisterBanner } from "@/components/auth/RegisterBanner";

export const Register = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <RegisterLogo className="mx-auto mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold">Cadastro</h1>
            <p className="text-gray-500 mt-2">Preencha os dados para criar sua conta</p>
          </div>
          
          <RegisterForm />
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>VistoriaPro © {new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
      </div>
      
      {/* Right Side - Banner */}
      <div className="hidden lg:block lg:w-1/2">
        <RegisterBanner />
      </div>
    </div>
  );
};

export default Register;
