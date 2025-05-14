
// Import types from the main types file
import type { UserRole } from "../types";

// Re-export the UserRole type using 'export type' for isolatedModules compatibility
export type { UserRole };

// Add constants for available roles
export const USER_ROLES = {
  ADMIN: "admin" as const,
  INSPECTOR: "inspector" as const
};
