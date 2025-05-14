
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilePlus2, UploadCloud } from "lucide-react";

// Define the schema with all company fields
const companyFormSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa deve ter no mínimo 2 caracteres"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  address: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  // Logo will be handled separately
  
  // Admin fields
  adminName: z.string().min(3, "Nome completo deve ter no mínimo 3 caracteres"),
  adminCpf: z.string().min(11, "CPF inválido"),
  adminPhone: z.string().min(10, "Telefone inválido"),
  adminEmail: z.string().email("E-mail inválido")
});

// Define schema for individual registration
const individualFormSchema = z.object({
  fullName: z.string().min(3, "Nome completo deve ter no mínimo 3 caracteres"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres"),
  email: z.string().email("E-mail inválido")
});

const CompanySetup = () => {
  const { createCompanyWithAdmin, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [registrationType, setRegistrationType] = useState<'company' | 'individual'>('company');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Company form
  const companyForm = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      cnpj: "",
      address: "",
      phone: "",
      email: "",
      adminName: "",
      adminCpf: "",
      adminPhone: "",
      adminEmail: ""
    },
  });
  
  // Individual form
  const individualForm = useForm<z.infer<typeof individualFormSchema>>({
    resolver: zodResolver(individualFormSchema),
    defaultValues: {
      fullName: "",
      cpf: "",
      phone: "",
      address: "",
      email: ""
    },
  });

  // Check for stored company details from registration
  useEffect(() => {
    const storedCompanyDetails = localStorage.getItem('pendingCompanySetup');
    if (storedCompanyDetails) {
      try {
        const details = JSON.parse(storedCompanyDetails);
        
        if (details.type === 'company') {
          setRegistrationType('company');
          companyForm.setValue('companyName', details.name || '');
          companyForm.setValue('cnpj', details.cnpj || '');
          companyForm.setValue('address', details.address || '');
          companyForm.setValue('phone', details.phone || '');
          companyForm.setValue('email', details.email || '');
          
          // If user data is available, pre-fill admin fields
          if (user) {
            companyForm.setValue('adminName', user.full_name || '');
            companyForm.setValue('adminEmail', user.email || '');
          }
        } else if (details.type === 'individual') {
          setRegistrationType('individual');
          individualForm.setValue('fullName', details.name || '');
          individualForm.setValue('cpf', details.cpf || '');
          individualForm.setValue('phone', details.phone || '');
          individualForm.setValue('email', details.email || '');
        }
      } catch (e) {
        console.error("Error parsing stored registration details:", e);
      }
    } else if (user) {
      // Pre-fill forms with user data if available
      if (registrationType === 'company') {
        companyForm.setValue('adminName', user.full_name || '');
        companyForm.setValue('adminEmail', user.email || '');
      } else {
        individualForm.setValue('fullName', user.full_name || '');
        individualForm.setValue('email', user.email || '');
      }
    }
  }, [user, registrationType]);

  useEffect(() => {
    // Retrieve the user ID from the current session
    const fetchSession = async () => {
      try {
        setLoading(true);
        console.log("Checking authentication status...");
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        console.log("Session data:", data);
        
        if (!data.session) {
          console.log("No active session found.");
          // Redirect to login if no session
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          navigate("/login");
          return;
        }
        
        console.log("User authenticated:", data.session.user.id);
        setUserId(data.session.user.id);
        setAuthChecked(true);
        
        // Check if the user has the correct role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .single();
        
        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
        }
        
        console.log("User profile:", profile);
        
        if (profile && profile.role === 'inspector') {
          console.log("Updating role from inspector to admin");
          // Update the role to admin
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: 'admin' })
            .eq("id", data.session.user.id);
            
          if (updateError) {
            console.error("Erro ao atualizar função:", updateError);
          } else {
            console.log("Role updated successfully to admin");
          }
        }
      } catch (error: any) {
        console.error("Erro ao buscar sessão:", error.message);
        toast.error("Erro ao verificar autenticação.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [navigate]);

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

  const onCompanySubmit = async (values: z.infer<typeof companyFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Double-check authentication status before proceeding
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        navigate("/login");
        setIsSubmitting(false);
        return;
      }
      
      const actualUserId = sessionData.session.user.id;
      console.log("Authenticated user ID for company creation:", actualUserId);
      
      // Ensure the user is an admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", actualUserId)
        .single();
      
      if (profile && profile.role === 'inspector') {
        console.log("User has inspector role, updating to admin");
        await supabase
          .from("profiles")
          .update({ role: 'admin' })
          .eq("id", actualUserId);
      }
      
      console.log("Creating company with details:", {
        name: values.companyName,
        cnpj: values.cnpj,
        address: values.address,
        phone: values.phone,
        email: values.email,
        userId: actualUserId
      });
      
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
      
      // Call the RPC function to create company with admin
      const { data, error } = await supabase.rpc(
        "create_company_with_admin", 
        { 
          company_name: values.companyName, 
          company_cnpj: values.cnpj, 
          admin_id: actualUserId,
          company_address: values.address,
          company_phone: values.phone,
          company_email: values.email,
          company_logo_url: logoUrl,
          admin_name: values.adminName,
          admin_cpf: values.adminCpf,
          admin_phone: values.adminPhone,
          admin_email: values.adminEmail
        }
      );
      
      if (error) {
        console.error("Error details:", error);
        throw new Error(error.message);
      }
      
      console.log("Company creation response:", data);
      
      // Clear the stored company details
      localStorage.removeItem('pendingCompanySetup');
      
      toast.success("Empresa criada com sucesso!");
      navigate("/admin/tenant/dashboard");
    } catch (error: any) {
      toast.error(`Erro ao criar empresa: ${error.message}`);
      console.error("Erro detalhado:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onIndividualSubmit = async (values: z.infer<typeof individualFormSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Double-check authentication status before proceeding
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        navigate("/login");
        setIsSubmitting(false);
        return;
      }
      
      const actualUserId = sessionData.session.user.id;
      
      // Create individual profile (treated as a company but with individual flag)
      const { data, error } = await supabase.rpc(
        "create_individual_profile", 
        { 
          full_name: values.fullName, 
          cpf: values.cpf, 
          user_id: actualUserId,
          address: values.address,
          phone: values.phone,
          email: values.email
        }
      );
      
      if (error) {
        console.error("Error details:", error);
        throw new Error(error.message);
      }
      
      console.log("Individual profile creation response:", data);
      
      // Clear the stored details
      localStorage.removeItem('pendingCompanySetup');
      
      toast.success("Perfil criado com sucesso!");
      navigate("/admin/tenant/dashboard");
    } catch (error: any) {
      toast.error(`Erro ao criar perfil: ${error.message}`);
      console.error("Erro detalhado:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vistoria-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!authChecked || !userId) {
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
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-3xl w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center">
            <Logo className="mx-auto mb-4" />
          </div>
          <h1 className="text-2xl font-bold">Configuração de Perfil</h1>
          <p className="text-gray-600 mt-2">
            {user?.full_name ? `Olá, ${user.full_name}! ` : ''}
            Complete suas informações para continuar.
          </p>
        </div>

        <Tabs defaultValue={registrationType} onValueChange={(value) => setRegistrationType(value as 'company' | 'individual')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="company">Empresa (CNPJ)</TabsTrigger>
            <TabsTrigger value="individual">Pessoa Física (CPF)</TabsTrigger>
          </TabsList>
          
          <TabsContent value="company">
            <Form {...companyForm}>
              <form onSubmit={companyForm.handleSubmit(onCompanySubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <h2 className="font-bold text-lg flex items-center">
                      <FilePlus2 className="mr-2 h-5 w-5" />
                      Dados da Empresa
                    </h2>
                    
                    <FormField
                      control={companyForm.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome da Empresa</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da sua empresa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={companyForm.control}
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
                      control={companyForm.control}
                      name="address"
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={companyForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(00) 0000-0000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={companyForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input placeholder="empresa@exemplo.com" type="email" {...field} />
                            </FormControl>
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
                  
                  <div className="space-y-6">
                    <h2 className="font-bold text-lg">Dados do Administrador</h2>
                    
                    <FormField
                      control={companyForm.control}
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
                      control={companyForm.control}
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
                      control={companyForm.control}
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
                      control={companyForm.control}
                      name="adminEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
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
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    className="w-full max-w-md bg-vistoria-blue hover:bg-vistoria-darkBlue"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Salvando..." : "Salvar Dados da Empresa"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="individual">
            <Form {...individualForm}>
              <form onSubmit={individualForm.handleSubmit(onIndividualSubmit)} className="space-y-6 max-w-lg mx-auto">
                <h2 className="font-bold text-lg">Dados Pessoais</h2>
                
                <FormField
                  control={individualForm.control}
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
                  control={individualForm.control}
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
                  control={individualForm.control}
                  name="address"
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
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={individualForm.control}
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
                  
                  <FormField
                    control={individualForm.control}
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
                </div>
                
                <div className="flex justify-center pt-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Salvando..." : "Salvar Dados Pessoais"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CompanySetup;
