
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa deve ter no mínimo 2 caracteres"),
  cnpj: z.string().min(14, "CNPJ inválido")
});

const CompanySetup = () => {
  const { createCompanyWithAdmin, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  // Check for stored company details from registration
  useEffect(() => {
    const storedCompanyDetails = localStorage.getItem('pendingCompanySetup');
    if (storedCompanyDetails) {
      try {
        const { name, cnpj } = JSON.parse(storedCompanyDetails);
        form.setValue('companyName', name || '');
        form.setValue('cnpj', cnpj || '');
      } catch (e) {
        console.error("Error parsing stored company details:", e);
      }
    }
  }, []);

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      cnpj: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
        userId: actualUserId
      });
      
      // Call the RPC function directly
      const { data, error } = await supabase.rpc(
        "create_company_with_admin", 
        { 
          company_name: values.companyName, 
          company_cnpj: values.cnpj, 
          admin_id: actualUserId 
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
          <p className="mb-4">Você precisa estar logado para configurar sua empresa.</p>
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
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="flex justify-center items-center">
            <Logo className="mx-auto mb-4" />
          </div>
          <h1 className="text-2xl font-bold">Configuração da Empresa</h1>
          <p className="text-gray-600 mt-2">
            {user?.full_name ? `Olá, ${user.full_name}! ` : ''}
            Complete as informações da sua empresa para continuar.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome da sua empresa" {...field} autoComplete="organization" />
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
                    <Input placeholder="00.000.000/0000-00" {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Criando..." : "Criar Empresa"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CompanySetup;
