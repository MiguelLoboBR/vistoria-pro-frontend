
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
      
      // We will handle logo upload after user is created successfully
      let logoUrl = null;
      let tempCompanyId = crypto.randomUUID();
      
      // Sign up the user first
      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: values.password,
        options: {
          data: {
            full_name: values.adminName,
            role: USER_ROLES.ADMIN_TENANT
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
        id: tempCompanyId,
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
      
      // Try to upload logo if selected - after user is created
      // Note: The trigger should have already created the profile
      if (logoFile && data.user) {
        try {
          // We'll try to upload the logo after a slight delay
          // to ensure the profile is created first
          setTimeout(async () => {
            try {
              // Check if company_logos bucket exists
              const { data: bucketData, error: bucketError } = await supabase.storage
                .getBucket('company_logos');
                
              if (bucketError) {
                console.log("Bucket does not exist or error fetching bucket:", bucketError);
              }
              
              // Use the tempCompanyId for storage path
              const filePath = `${tempCompanyId}/logo.png`;
              
              const { data: storageData, error: storageError } = await supabase.storage
                .from('company_logos')
                .upload(filePath, logoFile);
                  
              if (storageError) {
                console.error("Error uploading logo:", storageError);
              } else if (storageData) {
                logoUrl = supabase.storage.from('company_logos').getPublicUrl(storageData.path).data.publicUrl;
                console.log("Logo uploaded successfully at:", logoUrl);
                
                // Store logo URL for later
                let pendingSetup = JSON.parse(localStorage.getItem('pendingCompanySetup') || '{}');
                pendingSetup.logoUrl = logoUrl;
                localStorage.setItem('pendingCompanySetup', JSON.stringify(pendingSetup));
              }
            } catch (uploadError) {
              console.error("Logo upload failed in delayed execution:", uploadError);
            }
          }, 2000); // 2 seconds delay to ensure profile is created first
        } catch (uploadError) {
          console.error("Logo upload failed:", uploadError);
          // Continue with registration even if logo upload fails
        }
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
