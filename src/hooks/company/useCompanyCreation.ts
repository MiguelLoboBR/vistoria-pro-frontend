
import { supabase } from "@/integrations/supabase/client";

interface CompanyCreationResult {
  success: boolean;
  companyId?: string;
  error?: string;
}

export const useCompanyCreation = () => {
  
  // Create company function
  const createCompany = async (
    name: string,
    cnpj: string,
    adminId: string,
    address?: string,
    phone?: string,
    email?: string,
    logoUrl?: string,
    adminName?: string,
    adminCpf?: string,
    adminPhone?: string,
    adminEmail?: string
  ): Promise<CompanyCreationResult> => {
    try {
      // Use RPC function to create company with admin
      const { data, error } = await supabase.rpc(
        'create_company_with_admin',
        {
          company_name: name,
          company_cnpj: cnpj,
          admin_id: adminId,
          company_address: address || null,
          company_phone: phone || null,
          company_email: email || null,
          company_logo_url: logoUrl || null,
          admin_name: adminName || null,
          admin_cpf: adminCpf || null,
          admin_phone: adminPhone || null,
          admin_email: adminEmail || null
        }
      );
      
      if (error) {
        console.error("Error creating company:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true, companyId: data as string };
    } catch (error: any) {
      console.error("Error in createCompany:", error);
      return { success: false, error: error.message };
    }
  };
  
  // Create individual profile function
  const createIndividualProfile = async (
    fullName: string,
    cpf: string,
    userId: string,
    address?: string,
    phone?: string,
    email?: string
  ): Promise<CompanyCreationResult> => {
    try {
      // Use RPC function to create individual profile
      const { data, error } = await supabase.rpc(
        'create_individual_profile',
        {
          full_name: fullName,
          cpf: cpf,
          user_id: userId,
          address: address || null,
          phone: phone || null,
          email: email || null
        }
      );
      
      if (error) {
        console.error("Error creating individual profile:", error);
        return { success: false, error: error.message };
      }
      
      return { success: true, companyId: data as string };
    } catch (error: any) {
      console.error("Error in createIndividualProfile:", error);
      return { success: false, error: error.message };
    }
  };
  
  return {
    createCompany,
    createIndividualProfile
  };
};
