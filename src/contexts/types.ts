
export interface Company {
  id: string;
  name: string;
  cnpj?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  is_individual?: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  company_id?: string;
  role: "admin_tenant" | "inspector"; // Updated to match the role in services/types.ts
  cpf?: string;
  phone?: string;
}
