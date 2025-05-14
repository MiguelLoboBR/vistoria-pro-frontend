
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCompanySetup = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [registrationType, setRegistrationType] = useState<'company' | 'individual'>('company');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  const navigate = useNavigate();

  // Check authentication status
  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        console.log("Checking authentication status...");
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        console.log("Session data:", data);
        
        if (!data.session) {
          console.log("No active session found.");
          // Redirect to login if no session
          toast.error("Sessão expirada. Por favor, faça login novamente.");
          navigate("/login");
          return;
        }
        
        console.log("User authenticated:", data.session.user.id);
        setUserId(data.session.user.id);
        setAuthChecked(true);
        
        // Check if the user has the correct role
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .single();
        
        if (profileError) {
          console.error("Erro ao buscar perfil:", profileError);
        }
        
        console.log("User profile:", profile);
        
        if (profile && profile.role === 'inspector') {
          console.log("Updating role from inspector to admin");
          // Update the role to admin
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: 'admin' })
            .eq("id", data.session.user.id);
            
          if (updateError) {
            console.error("Erro ao atualizar função:", updateError);
          } else {
            console.log("Role updated successfully to admin");
          }
        }
      } catch (error: any) {
        console.error("Erro ao buscar sessão:", error.message);
        toast.error("Erro ao verificar autenticação.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSession();
  }, [navigate]);

  // Load stored company details
  useEffect(() => {
    const storedCompanyDetails = localStorage.getItem('pendingCompanySetup');
    if (storedCompanyDetails) {
      try {
        const details = JSON.parse(storedCompanyDetails);
        setRegistrationType(details.type || 'company');
      } catch (e) {
        console.error("Error parsing stored registration details:", e);
      }
    }
  }, []);

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

  const createCompany = async (
    values: {
      companyName: string;
      cnpj: string;
      address: string;
      phone: string;
      email: string;
      adminName: string;
      adminCpf: string;
      adminPhone: string;
      adminEmail: string;
    }
  ) => {
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
      
      // Upload logo if selected
      let logoUrl = null;
      if (logoFile) {
        const { data: storageData, error: storageError } = await supabase.storage
          .from('company_logos')
          .upload(`${values.cnpj}/logo`, logoFile);
          
        if (storageError) {
          console.error("Error uploading logo:", storageError);
        } else if (storageData) {
          logoUrl = supabase.storage.from('company_logos').getPublicUrl(storageData.path).data.publicUrl;
        }
      }
      
      // Call the updated RPC function to create company with admin
      const { data, error } = await supabase.rpc(
        "create_company_with_admin", 
        { 
          company_name: values.companyName, 
          company_cnpj: values.cnpj, 
          admin_id: actualUserId,
          company_address: values.address,
          company_phone: values.phone,
          company_email: values.email,
          company_logo_url: logoUrl,
          admin_name: values.adminName,
          admin_cpf: values.adminCpf,
          admin_phone: values.adminPhone,
          admin_email: values.adminEmail
        }
      );
      
      if (error) {
        console.error("Error details:", error);
        throw new Error(error.message);
      }
      
      console.log("Company creation response:", data);
      
      // Clear the stored company details
      localStorage.removeItem('pendingCompanySetup');
      
      toast.success("Empresa criada com sucesso!");
      navigate("/admin/tenant/dashboard");
    } catch (error: any) {
      toast.error(`Erro ao criar empresa: ${error.message}`);
      console.error("Erro detalhado:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const createIndividualProfile = async (
    values: {
      fullName: string;
      cpf: string;
      address: string;
      phone: string;
      email: string;
    }
  ) => {
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
    user,
    isSubmitting,
    userId,
    loading,
    authChecked,
    registrationType,
    setRegistrationType,
    logoFile,
    logoPreview,
    handleLogoChange,
    createCompany,
    createIndividualProfile
  };
};
