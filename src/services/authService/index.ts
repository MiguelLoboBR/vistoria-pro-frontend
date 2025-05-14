
// Re-export individual service functions
import { createCompanyWithAdmin } from "./createCompanyWithAdmin";
import { registerAdmin } from "./registerAdmin";
import { registerInspector } from "./registerInspector";
import { signOut } from "./signOut";
import { signUp } from "./signUp";

// Re-export types using 'export type' for isolatedModules compatibility
export type { UserRole } from './types';

// Bundle all service functions into a single authService object
export const authService = {
  createCompanyWithAdmin,
  registerAdmin,
  registerInspector,
  signOut,
  signUp,
};
