
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";
import { registerFormSchema, RegisterFormValues } from "@/components/auth/register/schema";

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
      
      // Upload logo if selected
      let logoUrl = null;
      if (logoFile) {
        try {
          // Check if company_logos bucket exists
          const { data: bucketData } = await supabase.storage
            .getBucket('company_logos');
            
          if (!bucketData) {
            // Create bucket if it doesn't exist
            await supabase.storage
              .createBucket('company_logos', { public: true });
          }
          
          const { data: storageData, error: storageError } = await supabase.storage
            .from('company_logos')
            .upload(`${values.cnpj}/logo`, logoFile);
              
          if (storageError) {
            console.error("Error uploading logo:", storageError);
          } else if (storageData) {
            logoUrl = supabase.storage.from('company_logos').getPublicUrl(storageData.path).data.publicUrl;
            console.log("Logo uploaded successfully at:", logoUrl);
          }
        } catch (uploadError) {
          console.error("Logo upload failed:", uploadError);
          // Continue with registration even if logo upload fails
        }
      }

      // Sign up the user first
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
      
      let companyError = null;
      let errorMessage = "";
      
      // Save the company setup details for later use after email confirmation
      localStorage.setItem('pendingCompanySetup', JSON.stringify({
        type: 'company',
        name: values.companyName,
        cnpj: values.cnpj,
        address: values.companyAddress,
        phone: values.companyPhone,
        email: values.companyEmail || values.email,
        admin: {
          name: values.adminName,
          cpf: values.adminCpf,
          phone: values.adminPhone,
          email: values.adminEmail || values.email
        }
      }));
      
      try {
        // Try to create company but don't fail if this part fails
        // We no longer pass the user ID directly - it will be handled after email confirmation
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
        
        console.log("Company creation attempted successfully");
      } catch (err: any) {
        console.error("Error creating company:", err);
        companyError = err;
        errorMessage = err.message || "Ocorreu um erro durante a criação da empresa.";
      }
      
      toast.success("Cadastro enviado com sucesso!");
      
      navigate('/register/success', { 
        state: { 
          email: authEmail,
          error: !!companyError,
          errorMessage: errorMessage
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
