
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
      console.error("Company creation error details:", error);
      // Don't fail the registration process if company creation fails
      // The user will be able to create the company after confirming their email
      console.log("Company creation failed, but user was created. Will continue with registration.");
      return null;
    }

    console.log("Company creation response:", data);
    return data as string;
  } catch (error: any) {
    console.error("Error creating company:", error);
    // Don't fail the registration process if company creation fails
    return null;
  }
};
