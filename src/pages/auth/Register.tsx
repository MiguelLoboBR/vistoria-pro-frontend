import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import RegisterLogo from "@/components/auth/RegisterLogo";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const formSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa deve ter no mínimo 2 caracteres"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  responsibleName: z.string().min(3, "Nome do responsável deve ter no mínimo 3 caracteres"),
  email: z.string().email("Digite um e-mail válido"),
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      cnpj: "",
      responsibleName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Register the user with admin role
      const result = await signUp(values.email, values.password, values.responsibleName);
      
      console.log("Registration result:", result);
      setRegisteredEmail(values.email);
      setRegistrationComplete(true);
      
      toast.success("Cadastro enviado com sucesso! Verifique seu email para confirmar sua conta.");
      
      // Store company details in localStorage for later use
      localStorage.setItem('pendingCompanySetup', JSON.stringify({
        name: values.companyName,
        cnpj: values.cnpj,
        email: values.email,
      }));
      
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(`Erro ao cadastrar: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (registrationComplete) {
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
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue"
              onClick={() => navigate('/login')}
            >
              Ir para o Login
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
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <RegisterLogo className="mx-auto mb-6" />
            <h1 className="text-2xl md:text-3xl font-bold">Cadastro de Empresa</h1>
            <p className="text-gray-500 mt-2">Preencha os dados para criar sua conta</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Empresa</FormLabel>
                    <FormControl>
                      <Input placeholder="Sua empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cnpj"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CNPJ</FormLabel>
                    <FormControl>
                      <Input placeholder="00.000.000/0000-00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsibleName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Sua senha" 
                          type={showPassword ? "text" : "password"} 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder="Confirme sua senha" 
                          type={showConfirmPassword ? "text" : "password"} 
                          {...field} 
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="h-4 w-4 text-gray-500" />
                          ) : (
                            <EyeIcon className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue">
                Cadastrar
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-gray-500">Já tem uma conta? <Link to="/login" className="text-vistoria-blue font-medium hover:underline">Entrar</Link></p>
              </div>
            </form>
          </Form>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>VistoriaPro © {new Date().getFullYear()} - Todos os direitos reservados</p>
        </div>
      </div>
      
      {/* Right Side - Banner */}
      <div className="hidden lg:block lg:w-1/2 bg-vistoria-blue/10 relative">
        <div className="absolute inset-0 flex flex-col justify-center p-16">
          <div className="bg-white rounded-xl p-8 shadow-lg max-w-lg mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gerencie suas vistorias com eficiência</h2>
            <p className="text-gray-600 mb-6">
              Com o VistoriaPro, você tem controle completo sobre vistorias, vistoriadores, relatórios e muito mais em uma interface simples e intuitiva.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-vistoria-green">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">Checklist dinâmico por cômodo com edição em tempo real</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-vistoria-green">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">Captura de imagens com edição e marcações diretamente no app</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-vistoria-green">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">Geração automática de relatórios em PDF personalizados</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-vistoria-green">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="ml-3 text-gray-600">Funcionamento offline com sincronização automática</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
