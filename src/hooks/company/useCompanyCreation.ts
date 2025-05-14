
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface CompanyFormValues {
  companyName: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  adminName: string;
  adminCpf: string;
  adminPhone: string;
  adminEmail: string;
  logoFile?: File; // Add logoFile property
}

export interface IndividualFormValues {
  fullName: string;
  cpf: string;
  address: string;
  phone: string;
  email: string;
}

export const useCompanyCreation = (userId: string | null) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const createCompany = async (values: CompanyFormValues) => {
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
      
      // First ensure the user profile exists with role=admin
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert([
          {
            id: actualUserId,
            email: sessionData.session.user.email,
            full_name: values.adminName,
            role: "admin",
            cpf: values.adminCpf,
            phone: values.adminPhone
          }
        ], { onConflict: 'id' });
        
      if (profileError) {
        console.error("Error creating profile:", profileError);
        throw new Error("Error creating user profile");
      }
      
      // Upload logo if selected
      let logoUrl = null;
      if (values.logoFile) {
        const { data: storageData, error: storageError } = await supabase.storage
          .from('company_logos')
          .upload(`${values.cnpj}/logo`, values.logoFile);
          
        if (storageError) {
          console.error("Error uploading logo:", storageError);
        } else if (storageData) {
          logoUrl = supabase.storage.from('company_logos').getPublicUrl(storageData.path).data.publicUrl;
        }
      }
      
      // Create the company directly using normal insert
      const { data: companyData, error: companyError } = await supabase
        .from("companies")
        .insert([
          {
            name: values.companyName,
            cnpj: values.cnpj,
            address: values.address,
            phone: values.phone,
            email: values.email,
            logo_url: logoUrl,
            admin_id: actualUserId
          }
        ])
        .select('id')
        .single();
        
      if (companyError) {
        console.error("Error creating company:", companyError);
        throw new Error(companyError.message);
      }
      
      // Link the user profile to the company
      if (companyData) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ company_id: companyData.id })
          .eq("id", actualUserId);
          
        if (updateError) {
          console.error("Error linking profile to company:", updateError);
        }
      }
      
      // Clear the stored company details
      localStorage.removeItem('pendingCompanySetup');
      
      toast.success("Empresa criada com sucesso!");
      navigate("/admin/dashboard");
    } catch (error: any) {
      toast.error(`Erro ao criar empresa: ${error.message}`);
      console.error("Erro detalhado:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const createIndividualProfile = async (values: IndividualFormValues) => {
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
      
      // Create individual profile (treated as a company but with individual flag)
      const { data, error } = await supabase.rpc(
        "create_individual_profile", 
        { 
          full_name: values.fullName, 
          cpf: values.cpf, 
          user_id: actualUserId,
          address: values.address,
          phone: values.phone,
          email: values.email
        }
      );
      
      if (error) {
        console.error("Error details:", error);
        throw new Error(error.message);
      }
      
      console.log("Individual profile creation response:", data);
      
      // Clear the stored details
      localStorage.removeItem('pendingCompanySetup');
      
      toast.success("Perfil criado com sucesso!");
      navigate("/admin/tenant/dashboard");
    } catch (error: any) {
      toast.error(`Erro ao criar perfil: ${error.message}`);
      console.error("Erro detalhado:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    createCompany,
    createIndividualProfile
  };
};
