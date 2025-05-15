
import { UserRole } from './authService/types';

export type { UserRole };

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
  role: UserRole;
  cpf?: string;
  phone?: string;
}

export interface Inspector extends UserProfile {
  // Inspectors are just user profiles with the role "inspector"
}
