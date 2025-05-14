
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon, UploadCloud } from "lucide-react";
import RegisterLogo from "@/components/auth/RegisterLogo";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { authService, UserRole } from "@/services/authService";

const formSchema = z.object({
  // User auth fields
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  
  // Registration type
  registrationType: z.enum(["company", "individual"]),
  
  // Company fields
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().optional(),
  cnpj: z.string().optional(),
  
  // Individual/admin fields
  fullName: z.string().optional(),
  cpf: z.string().optional(),
  phone: z.string().optional(),
  
  // Admin fields (when company)
  adminName: z.string().optional(),
  adminCpf: z.string().optional(),
  adminPhone: z.string().optional(),
  adminEmail: z.string().optional(),
  
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
}).refine(
  (data) => {
    if (data.registrationType === 'company') {
      return !!data.companyName && !!data.cnpj;
    }
    return true;
  },
  {
    message: "Dados da empresa obrigatórios",
    path: ["companyName"]
  }
).refine(
  (data) => {
    if (data.registrationType === 'individual') {
      return !!data.fullName && !!data.cpf;
    }
    return true;
  },
  {
    message: "Dados pessoais obrigatórios",
    path: ["fullName"]
  }
).refine(
  (data) => {
    if (data.registrationType === 'company') {
      return !!data.adminName && !!data.adminCpf && !!data.adminPhone;
    }
    return true;
  },
  {
    message: "Dados do administrador obrigatórios",
    path: ["adminName"]
  }
);

export const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registrationType: "company",
      email: "",
      password: "",
      confirmPassword: "",
      
      // Company fields
      companyName: "",
      companyAddress: "",
      companyPhone: "",
      companyEmail: "",
      cnpj: "",
      
      // Individual fields
      fullName: "",
      cpf: "",
      phone: "",
      
      // Admin fields
      adminName: "",
      adminCpf: "",
      adminPhone: "",
      adminEmail: "",
    },
  });

  // Watch the registration type to conditionally render fields
  const registrationType = form.watch("registrationType");

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Use admin email for authentication (or regular email for individual)
      const authEmail = values.registrationType === 'company' 
        ? (values.adminEmail || values.email) 
        : values.email;
      
      // Upload logo if selected
      let logoUrl = null;
      if (logoFile) {
        const { data: storageData, error: storageError } = await supabase.storage
          .from('company_logos')
          .upload(`${values.cnpj}/logo`, logoFile);
            
        if (storageError) {
          console.error("Error uploading logo:", storageError);
        } else if (storageData) {
          logoUrl = supabase.storage.from('company_logos').getPublicUrl(storageData.path).data.publicUrl;
        }
      }

      let role: UserRole = "admin";
      let result;
      
      if (values.registrationType === 'company') {
        // Register with company information directly
        result = await authService.registerAdmin(
          authEmail, 
          values.password,
          values.adminName || ""
        );
        
        if (result) {
          // Create company directly with the registered user
          await authService.createCompanyWithAdmin(
            values.companyName || "",
            values.cnpj || "",
            values.companyAddress,
            values.companyPhone,
            values.companyEmail || values.email,
            logoUrl,
            values.adminName,
            values.adminCpf,
            values.adminPhone,
            values.adminEmail || values.email
          );
        }
      } else {
        // Register as individual
        result = await authService.registerAdmin(
          values.email, 
          values.password,
          values.fullName || ""
        );
        
        if (result) {
          // Create an individual company entry
          await authService.createCompanyWithAdmin(
            values.fullName || "",
            values.cpf || "",
            "", // address
            values.phone,
            values.email,
            null, // logo url
            values.fullName,
            values.cpf,
            values.phone,
            values.email
          );
        }
      }
      
      setRegisteredEmail(authEmail);
      setRegistrationComplete(true);
      toast.success("Cadastro enviado com sucesso! Verifique seu email para confirmar sua conta.");
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
            <h1 className="text-2xl md:text-3xl font-bold">Cadastro</h1>
            <p className="text-gray-500 mt-2">Preencha os dados para criar sua conta</p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Tipo de registro */}
              <FormField
                control={form.control}
                name="registrationType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Tipo de Cadastro</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="company" id="company" />
                          <FormLabel htmlFor="company" className="font-normal">
                            Empresa (CNPJ)
                          </FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="individual" id="individual" />
                          <FormLabel htmlFor="individual" className="font-normal">
                            Pessoa Física (CPF)
                          </FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {registrationType === 'company' ? (
                <>
                  {/* Company Fields */}
                  <div className="space-y-5">
                    <h2 className="font-bold text-lg border-b pb-2">Dados da Empresa</h2>
                    
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da empresa" {...field} />
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
                      name="companyAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Input placeholder="Endereço completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="companyPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone da Empresa</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 0000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="companyEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail da Empresa</FormLabel>
                            <FormControl>
                              <Input placeholder="empresa@exemplo.com" type="email" {...field} />
                            </FormControl>
                            <FormDescription>
                              Opcional, se diferente do e-mail de login
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <FormLabel>Logo da Empresa</FormLabel>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                        {logoPreview ? (
                          <div className="mb-4">
                            <img 
                              src={logoPreview} 
                              alt="Logo preview" 
                              className="max-h-32 max-w-full object-contain" 
                            />
                          </div>
                        ) : (
                          <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                        )}
                        
                        <p className="text-sm text-gray-500 mb-2">Arraste ou clique para fazer upload</p>
                        
                        <Input
                          id="logo"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleLogoChange}
                        />
                        <label htmlFor="logo">
                          <div className="bg-vistoria-blue text-white px-4 py-2 rounded cursor-pointer hover:bg-vistoria-darkBlue text-sm">
                            Selecionar arquivo
                          </div>
                        </label>
                        <p className="text-xs text-gray-400 mt-2">
                          PNG ou JPEG, max 2MB
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Admin Fields */}
                  <div className="space-y-5 pt-4">
                    <h2 className="font-bold text-lg border-b pb-2">Dados do Administrador</h2>
                    
                    <FormField
                      control={form.control}
                      name="adminName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="adminCpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input placeholder="000.000.000-00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="adminPhone"
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
                    
                    <FormField
                      control={form.control}
                      name="adminEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail do Administrador</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@exemplo.com" type="email" {...field} />
                          </FormControl>
                          <FormDescription>
                            Este será o e-mail usado para login no sistema
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Individual Fields */}
                  <div className="space-y-5">
                    <h2 className="font-bold text-lg border-b pb-2">Dados Pessoais</h2>
                    
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cpf"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF</FormLabel>
                          <FormControl>
                            <Input placeholder="000.000.000-00" {...field} />
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
                </>
              )}
              
              {/* Common Auth Fields */}
              <div className="space-y-5 pt-4">
                <h2 className="font-bold text-lg border-b pb-2">Dados de Acesso</h2>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail de Login</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
              </div>
              
              <Button type="submit" className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue" disabled={isSubmitting}>
                {isSubmitting ? "Cadastrando..." : "Cadastrar"}
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
