
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { registerFormSchema, RegisterFormValues } from "@/components/auth/register/schema";
import { USER_ROLES } from "@/services/authService/types";

export const useRegisterForm = () => {
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
      console.log("Starting registration with email:", authEmail);
      
      // IDs temporários para referência
      let tempCompanyId = crypto.randomUUID();
      let logoUrl = null;
      
      // Primeiro enviar a logo, se houver
      if (logoFile) {
        try {
          // Usar o tempCompanyId para storage path
          const filePath = `${tempCompanyId}/logo.png`;
          
          const { data: storageData, error: storageError } = await supabase.storage
            .from('company_logos')
            .upload(filePath, logoFile, {
              cacheControl: '3600',
              upsert: true
            });
              
          if (storageError) {
            console.error("Error uploading logo:", storageError);
          } else if (storageData) {
            logoUrl = supabase.storage.from('company_logos').getPublicUrl(storageData.path).data.publicUrl;
            console.log("Logo uploaded successfully at:", logoUrl);
          }
        } catch (uploadError) {
          console.error("Logo upload failed:", uploadError);
        }
      }
      
      // Criar a empresa usando a função RPC que criamos
      const { data: companyData, error: companyError } = await supabase.rpc(
        'create_company_register',
        {
          company_name: values.companyName,
          company_cnpj: values.cnpj,
          company_address: values.companyAddress || null,
          company_phone: values.companyPhone || null,
          company_email: values.companyEmail || values.email,
          company_logo_url: logoUrl,
          admin_name: values.adminName,
          admin_cpf: values.adminCpf,
          admin_phone: values.adminPhone,
          admin_email: values.adminEmail || values.email
        }
      );
      
      if (companyError) {
        console.error("Error creating company:", companyError);
      } else {
        tempCompanyId = companyData;
        console.log("Empresa criada com sucesso, ID:", tempCompanyId);
      }
      
      // Cadastrar o usuário no Auth com o papel correto
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: values.password,
        options: {
          data: {
            full_name: values.adminName,
            role: USER_ROLES.ADMIN_TENANT, // Usar a constante para garantir tipo correto
            company_id: tempCompanyId // Adicionar company_id aos metadados
          },
          emailRedirectTo: window.location.origin + '/login'
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
      
      // Salvar detalhes para uso posterior (caso precise)
      localStorage.setItem('pendingCompanySetup', JSON.stringify({
        id: tempCompanyId,
        name: values.companyName,
        cnpj: values.cnpj,
        logoUrl: logoUrl
      }));
      
      toast.success("Cadastro enviado com sucesso!");
      
      navigate('/register/success', { 
        state: { 
          email: authEmail
        } 
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Ocorreu um erro durante o cadastro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    logoPreview,
    handleLogoChange,
    onSubmit
  };
};
