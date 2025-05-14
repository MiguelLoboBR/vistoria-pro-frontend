
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";
import { CompanyFieldsSection } from "./CompanyFieldsSection";
import { AdminFieldsSection } from "./AdminFieldsSection";
import { AccessFieldsSection } from "./AccessFieldsSection";

export const registerFormSchema = z.object({
  // User auth fields
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  
  // Company fields
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().optional(),
  cnpj: z.string().min(1, "CNPJ/CPF é obrigatório"),
  
  // Admin fields
  adminName: z.string().min(3, "Nome do administrador é obrigatório"),
  adminCpf: z.string().min(11, "CPF inválido"),
  adminPhone: z.string().optional(),
  adminEmail: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const RegisterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      
      // Company fields
      companyName: "",
      companyAddress: "",
      companyPhone: "",
      companyEmail: "",
      cnpj: "",
      
      // Admin fields
      adminName: "",
      adminCpf: "",
      adminPhone: "",
      adminEmail: "",
    },
  });

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

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Use admin email for authentication
      const authEmail = values.adminEmail || values.email;
      
      // Upload logo if selected
      let logoUrl = null;
      if (logoFile) {
        try {
          const { data: storageData, error: storageError } = await supabase.storage
            .from('company_logos')
            .upload(`${values.cnpj}/logo`, logoFile);
              
          if (storageError) {
            console.error("Error uploading logo:", storageError);
          } else if (storageData) {
            logoUrl = supabase.storage.from('company_logos').getPublicUrl(storageData.path).data.publicUrl;
          }
        } catch (uploadError) {
          console.error("Logo upload failed:", uploadError);
          // Continue with registration even if logo upload fails
        }
      }

      console.log("Starting signup with email:", authEmail);
      
      // Simple signup that relies on trigger to create profile
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: values.password,
        options: {
          data: {
            full_name: values.adminName,
            role: "admin"
          }
        }
      });
      
      if (error) {
        console.error("Error during signup:", error);
        throw error;
      }
      
      if (!data.user) {
        throw new Error("User creation failed");
      }
      
      console.log("User created successfully:", data.user.id);
      
      try {
        // Create company immediately after signup without requiring email confirmation
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
        
        console.log("Company created successfully");
      } catch (companyError) {
        console.error("Error creating company:", companyError);
        toast({
          variant: "destructive",
          title: "Erro ao criar empresa",
          description: "Seu usuário foi criado, mas houve um erro ao criar a empresa."
        });
      }
      
      navigate('/register/success', { 
        state: { email: authEmail } 
      });
      
      toast({
        title: "Cadastro enviado com sucesso!",
        description: "Verifique seu email para confirmar sua conta."
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao cadastrar",
        description: error.message || "Ocorreu um erro durante o cadastro."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Company Fields */}
        <CompanyFieldsSection 
          form={form} 
          logoPreview={logoPreview} 
          handleLogoChange={handleLogoChange} 
        />
        
        {/* Admin Fields */}
        <AdminFieldsSection form={form} />
        
        {/* Common Auth Fields */}
        <AccessFieldsSection form={form} />
        
        <Button type="submit" className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue" disabled={isSubmitting}>
          {isSubmitting ? "Cadastrando..." : "Cadastrar"}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-gray-500">Já tem uma conta? <Link to="/login" className="text-vistoria-blue font-medium hover:underline">Entrar</Link></p>
        </div>
      </form>
    </Form>
  );
};
