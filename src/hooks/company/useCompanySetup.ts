import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";

export const useCompanySetup = () => {
  const { user, refreshUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationType, setRegistrationType] = useState<'company' | 'individual'>('company');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      // Simulate auth check
      await new Promise(resolve => setTimeout(resolve, 500));
      setLoading(false);
      setAuthChecked(true);
    };
    checkAuth();
  }, []);
  
  useEffect(() => {
    if (user && user.company_id) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);
  
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
  
  const createCompany = async (values: any) => {
    setIsSubmitting(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      let logoUrl = null;
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile, user.id);
      }
      
      // Call the createCompanyWithAdmin function
      await authService.createCompanyWithAdmin(
        values.companyName,
        values.cnpj,
        values.address,
        values.phone,
        values.email,
        logoUrl,
        values.adminName,
        values.adminCpf,
        values.adminPhone,
        values.adminEmail
      );
      
      // Refresh user profile to get the new company ID
      await refreshUserProfile();
      
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error("Error creating company:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const createIndividualProfile = async (values: any) => {
    setIsSubmitting(true);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      // Call the createIndividualProfile RPC function
      const { data, error } = await supabase.rpc('create_individual_profile', {
        user_id: user.id,
        full_name: values.fullName,
        cpf: values.cpf,
        address: values.address,
        phone: values.phone,
        email: values.email
      });
      
      if (error) {
        throw error;
      }
      
      // Refresh user profile to get the new company ID
      await refreshUserProfile();
      
      navigate('/admin/dashboard');
    } catch (error: any) {
      console.error("Error creating individual profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Inside your createCompany function, update the storage path:
  const uploadLogo = async (logoFile: File, companyId: string) => {
    try {
      if (logoFile) {
        const filePath = `${companyId}/logo.png`;
        const { data, error } = await supabase.storage
          .from('company_logos')
          .upload(filePath, logoFile);
          
        if (error) {
          throw error;
        }
        
        return supabase.storage
          .from('company_logos')
          .getPublicUrl(filePath).data.publicUrl;
      }
      return null;
    } catch (error) {
      console.error("Error uploading logo:", error);
      throw error;
    }
  };
  
  return {
    user,
    isSubmitting,
    loading,
    authChecked,
    registrationType,
    setRegistrationType,
    logoPreview,
    handleLogoChange,
    createCompany,
    createIndividualProfile
  };
};
