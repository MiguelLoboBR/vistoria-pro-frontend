
import { Company, UserProfile } from "@/contexts/types";

// Define and export the UserRole type as a literal union type
export type UserRole = "admin_tenant" | "inspector";

// Export a helper function to check role validity
export const isValidUserRole = (role: string): role is UserRole => {
  return role === "admin_tenant" || role === "inspector";
};

// Re-export types from contexts
export { type Company, type UserProfile };
