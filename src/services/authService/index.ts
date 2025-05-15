
// Re-export individual service functions
import { createCompanyWithAdmin } from "./createCompanyWithAdmin";
import { registerAdmin } from "./registerAdmin";
import { registerInspector } from "./registerInspector";
import { signIn } from "./signIn";
import { signOut } from "./signOut";
import { signUp } from "./signUp";

// Re-export types using 'export type' for isolatedModules compatibility
export type { UserRole } from './types';
export { USER_ROLES } from './types';

// Bundle all service functions into a single authService object
export const authService = {
  createCompanyWithAdmin,
  registerAdmin,
  registerInspector,
  signIn,
  signOut,
  signUp,
};
