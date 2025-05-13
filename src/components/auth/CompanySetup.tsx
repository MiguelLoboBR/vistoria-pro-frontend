
import { useState } from "react";
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

const formSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa deve ter no mínimo 2 caracteres"),
  cnpj: z.string().min(14, "CNPJ inválido")
});

const CompanySetup = () => {
  const { createCompanyWithAdmin, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
      const companyId = await createCompanyWithAdmin(values.companyName, values.cnpj);
      
      if (companyId) {
        toast.success("Empresa criada com sucesso!");
        navigate("/admin/tenant/dashboard");
      }
    } catch (error: any) {
      toast.error(`Erro ao criar empresa: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <Logo className="mx-auto mb-4" />
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
                    <Input placeholder="Nome da sua empresa" {...field} />
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
