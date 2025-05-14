
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthCheck } from "./company/useAuthCheck";
import { useCompanyCreation } from "./company/useCompanyCreation";
import { useLogoUpload } from "./company/useLogoUpload";
import { useRegistrationType } from "./company/useRegistrationType";

export function useCompanySetup() {
  const { user, company, refreshUserProfile } = useAuth();
  const { userId, loading: authLoading, authChecked } = useAuthCheck();
  const { createCompany: createCompanyRecord, createIndividualProfile: createIndividualRecord } = useCompanyCreation();
  const { logoFile, logoPreview, handleLogoChange, setLogoFile } = useLogoUpload();
  const { registrationType, setRegistrationType } = useRegistrationType();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Create company function
  const createCompany = async (values: any) => {
    try {
      setIsSubmitting(true);
      
      if (!userId) {
        toast.error("Você precisa estar logado para criar uma empresa");
        return;
      }
      
      // Upload logo if provided
      let logoUrl = null;
      if (logoFile) {
        try {
          // Create file path using company name for uniqueness
          const fileName = `${Date.now()}_${logoFile.name.replace(/\s+/g, '_')}`;
          const filePath = `${userId}/${fileName}`;
          
          // Upload to Supabase Storage
          const { data: storageData, error: storageError } = await supabase.storage
            .from('company_logos')
            .upload(filePath, logoFile, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (storageError) {
            console.error("Error uploading logo:", storageError);
            // Continue without logo
          } else {
            // Get public URL for the uploaded file
            const { data: publicUrlData } = supabase.storage
              .from('company_logos')
              .getPublicUrl(filePath);
              
            logoUrl = publicUrlData.publicUrl;
          }
        } catch (error) {
          console.error("Error in logo upload:", error);
          toast.error("Erro ao fazer upload do logo");
          // Continue without logo
        }
      }
      
      // Create company record
      const result = await createCompanyRecord(
        values.companyName, 
        values.cnpj, 
        userId, 
        values.address,
        values.phone,
        values.email,
        logoUrl,
        values.adminName,
        values.adminCpf,
        values.adminPhone,
        values.adminEmail
      );
      
      if (!result.success) {
        throw new Error(result.error || "Erro ao criar empresa");
      }
      
      toast.success("Empresa criada com sucesso!");
      
      // Refresh user profile to get updated data
      await refreshUserProfile();
      
      // Redirect to admin dashboard
      navigate("/admin/dashboard");
      
    } catch (error: any) {
      console.error("Error creating company:", error);
      toast.error(`Erro ao criar empresa: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Create individual profile function
  const createIndividualProfile = async (values: any) => {
    try {
      setIsSubmitting(true);
      
      if (!userId) {
        toast.error("Você precisa estar logado para criar um perfil");
        return;
      }
      
      // Create individual record
      const result = await createIndividualRecord(
        values.fullName,
        values.cpf,
        userId,
        values.address,
        values.phone,
        values.email
      );
      
      if (!result.success) {
        throw new Error(result.error || "Erro ao criar perfil individual");
      }
      
      toast.success("Perfil criado com sucesso!");
      
      // Refresh user profile to get updated data
      await refreshUserProfile();
      
      // Redirect to admin dashboard
      navigate("/admin/dashboard");
      
    } catch (error: any) {
      console.error("Error creating individual profile:", error);
      toast.error(`Erro ao criar perfil: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    user,
    company,
    isSubmitting,
    loading: authLoading,
    authChecked,
    registrationType,
    setRegistrationType,
    logoPreview,
    handleLogoChange,
    createCompany,
    createIndividualProfile
  };
}
