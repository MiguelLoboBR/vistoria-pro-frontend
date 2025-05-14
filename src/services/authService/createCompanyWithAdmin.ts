
import { supabase } from "@/integrations/supabase/client";

export const createCompanyWithAdmin = async (
  name: string, 
  cnpj: string,
  address?: string,
  phone?: string,
  email?: string,
  logoUrl?: string,
  adminName?: string,
  adminCpf?: string,
  adminPhone?: string,
  adminEmail?: string
): Promise<string | null> => {
  try {
    // Call the RPC function directly without requiring authentication
    // The function will use the provided data to create the company
    const { data, error } = await supabase.rpc(
      "create_company_with_admin", 
      { 
        company_name: name, 
        company_cnpj: cnpj, 
        admin_id: null, // Will be linked later when user confirms email
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
      throw error;
    }

    return data as string;
  } catch (error) {
    console.error("Error creating company:", error);
    throw error;
  }
};
