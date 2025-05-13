
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
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve the user ID from the current session
    const fetchSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data.session) {
          // Redirect to login if no session
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          navigate("/login");
          return;
        }
        
        setUserId(data.session.user.id);
        
        // Check if the user has the correct role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .single();
        
        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
        }
        
        if (profile && profile.role === 'inspector') {
          console.log("Atualizando papel de inspector para admin");
          // Update the role to admin
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: 'admin' })
            .eq("id", data.session.user.id);
            
          if (updateError) {
            console.error("Erro ao atualizar função:", updateError);
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
      if (!userId) {
        // Tenta buscar a sessão novamente se não houver ID do usuário
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw new Error("Erro ao recuperar a sessão do usuário: " + error.message);
        }
        
        if (!data.session) {
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          navigate("/login");
          setIsSubmitting(false);
          return;
        }
        
        // Atualiza o ID do usuário
        setUserId(data.session.user.id);
        
        // Garante que o usuário é um admin
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .single();
        
        if (profile && profile.role === 'inspector') {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: 'admin' })
            .eq("id", data.session.user.id);
            
          if (updateError) {
            console.error("Erro ao atualizar função:", updateError);
          }
        }
        
        // Cria a empresa com o ID do usuário
        const result = await supabase.rpc(
          "create_company_with_admin", 
          { 
            company_name: values.companyName, 
            company_cnpj: values.cnpj, 
            admin_id: data.session.user.id 
          }
        );
        
        if (result.error) {
          throw new Error(result.error.message);
        }
        
        toast.success("Empresa criada com sucesso!");
        navigate("/admin/tenant/dashboard");
        return;
      }
      
      // Call RPC function with user ID
      console.log("Criando empresa para o usuário:", userId);
      const { data, error } = await supabase.rpc(
        "create_company_with_admin", 
        { 
          company_name: values.companyName, 
          company_cnpj: values.cnpj, 
          admin_id: userId 
        }
      );
      
      if (error) {
        throw new Error(error.message);
      }
      
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
