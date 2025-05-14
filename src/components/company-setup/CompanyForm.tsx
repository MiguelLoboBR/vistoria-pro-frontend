import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FilePlus2, UploadCloud } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// Define the schema with all company fields
const companyFormSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa deve ter no mínimo 2 caracteres"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  address: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres"),
  phone: z.string().min(10, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  
  // Admin fields
  adminName: z.string().min(3, "Nome completo deve ter no mínimo 3 caracteres"),
  adminCpf: z.string().min(11, "CPF inválido"),
  adminPhone: z.string().min(10, "Telefone inválido"),
  adminEmail: z.string().email("E-mail inválido")
});

type CompanyFormProps = {
  onSubmit: (values: z.infer<typeof companyFormSchema>) => void;
  isSubmitting: boolean;
  logoPreview: string | null;
  onLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const CompanyForm = ({
  onSubmit,
  isSubmitting,
  logoPreview,
  onLogoChange
}: CompanyFormProps) => {
  const { user } = useAuth();
  
  const form = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      cnpj: "",
      address: "",
      phone: "",
      email: "",
      adminName: user?.full_name || "",
      adminCpf: "",
      adminPhone: "",
      adminEmail: user?.email || "",
    },
  });
  
  // Check for stored company details from registration
  useEffect(() => {
    const storedCompanyDetails = localStorage.getItem('pendingCompanySetup');
    if (storedCompanyDetails) {
      try {
        const details = JSON.parse(storedCompanyDetails);
        
        if (details.type === 'company') {
          form.setValue('companyName', details.name || '');
          form.setValue('cnpj', details.cnpj || '');
          form.setValue('address', details.address || '');
          form.setValue('phone', details.phone || '');
          form.setValue('email', details.email || '');
          
          // If user data is available, pre-fill admin fields
          if (user) {
            form.setValue('adminName', user.full_name || '');
            form.setValue('adminEmail', user.email || '');
          }
        }
      } catch (e) {
        console.error("Error parsing stored registration details:", e);
      }
    } else if (user) {
      // Pre-fill forms with user data if available
      form.setValue('adminName', user.full_name || '');
      form.setValue('adminEmail', user.email || '');
    }
  }, [user, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h2 className="font-bold text-lg flex items-center">
              <FilePlus2 className="mr-2 h-5 w-5" />
              Dados da Empresa
            </h2>
            
            {/* Company fields section */}
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
                      <Input placeholder="(00) 0000-0000" {...field} />
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
                  onChange={onLogoChange}
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
            
            {/* Admin fields section */}
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
  );
};
