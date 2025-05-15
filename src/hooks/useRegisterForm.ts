// src/hooks/useRegisterForm.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  registerFormSchema,
  RegisterFormValues,
} from "@/components/auth/register/schema";
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
      companyName: "",
      companyAddress: "",
      companyPhone: "",
      companyEmail: "",
      cnpj: "",
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
      const authEmail = values.adminEmail || values.email;
      const userRole = USER_ROLES.ADMIN_TENANT;

      // 1. Cadastra no Supabase Auth
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: authEmail,
        password: values.password,
        options: {
          data: {
            full_name: values.adminName,
            role: userRole,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (signUpError || !signUpData?.user?.id) {
        throw signUpError || new Error("Erro ao criar conta no Auth.");
      }

      const newUserId = signUpData.user.id;
      let logoUrl = null;

      // 2. Envia a logo da empresa
      if (logoFile) {
        const filePath = `${newUserId}/logo.png`;
        const { data: storageData, error: storageError } = await supabase.storage
          .from("company_logos")
          .upload(filePath, logoFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (storageError) {
          console.warn("Erro ao subir logo:", storageError.message);
        } else {
          logoUrl = supabase.storage.from("company_logos").getPublicUrl(storageData.path).data.publicUrl;
        }
      }

      // 3. Cria a empresa e o perfil do admin
      const { error: companyError } = await supabase.rpc("create_company_register", {
        new_user_id: newUserId,
        company_name: values.companyName,
        company_cnpj: values.cnpj,
        company_address: values.companyAddress || null,
        company_phone: values.companyPhone || null,
        company_email: values.companyEmail || values.email,
        company_logo_url: logoUrl,
        admin_name: values.adminName,
        admin_cpf: values.adminCpf,
        admin_phone: values.adminPhone,
        admin_email: authEmail,
      });

      if (companyError) {
        throw companyError;
      }

      toast.success("Cadastro realizado com sucesso!");
      navigate("/register/success", { state: { email: authEmail } });
    } catch (error: any) {
      console.error("Erro no cadastro:", error);
      toast.error(error.message || "Erro ao cadastrar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    logoPreview,
    handleLogoChange,
    onSubmit,
  };
};
