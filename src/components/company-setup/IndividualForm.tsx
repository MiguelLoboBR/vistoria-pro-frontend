
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

// Define schema for individual registration
const individualFormSchema = z.object({
  fullName: z.string().min(3, "Nome completo deve ter no mínimo 3 caracteres"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  address: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres"),
  email: z.string().email("E-mail inválido")
});

type IndividualFormProps = {
  onSubmit: (values: z.infer<typeof individualFormSchema>) => void;
  isSubmitting: boolean;
};

export const IndividualForm = ({ onSubmit, isSubmitting }: IndividualFormProps) => {
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof individualFormSchema>>({
    resolver: zodResolver(individualFormSchema),
    defaultValues: {
      fullName: user?.full_name || "",
      cpf: "",
      phone: "",
      address: "",
      email: user?.email || ""
    },
  });
  
  // Check for stored details from registration
  useEffect(() => {
    const storedCompanyDetails = localStorage.getItem('pendingCompanySetup');
    if (storedCompanyDetails) {
      try {
        const details = JSON.parse(storedCompanyDetails);
        
        if (details.type === 'individual') {
          form.setValue('fullName', details.name || '');
          form.setValue('cpf', details.cpf || '');
          form.setValue('phone', details.phone || '');
          form.setValue('email', details.email || '');
        }
      } catch (e) {
        console.error("Error parsing stored registration details:", e);
      }
    } else if (user) {
      // Pre-fill forms with user data if available
      form.setValue('fullName', user.full_name || '');
      form.setValue('email', user.email || '');
    }
  }, [user, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
        <h2 className="font-bold text-lg">Dados Pessoais</h2>
        
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
  );
};
