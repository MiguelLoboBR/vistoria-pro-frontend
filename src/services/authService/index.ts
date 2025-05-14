
import { registerInspector } from "./registerInspector";
import { registerAdmin } from "./registerAdmin";
import { signUp } from "./signUp";
import { signOut } from "./signOut";
import { createCompanyWithAdmin } from "./createCompanyWithAdmin";
import { UserRole } from "../types";

export const authService = {
  registerInspector,
  registerAdmin,
  signUp,
  signOut,
  createCompanyWithAdmin
};

export { UserRole };
export * from "../types";
