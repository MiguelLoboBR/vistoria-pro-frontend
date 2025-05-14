
export type UserRole = "admin_master" | "admin_tenant" | "inspector";

export const USER_ROLES = {
  ADMIN_MASTER: "admin_master" as UserRole,
  ADMIN_TENANT: "admin_tenant" as UserRole,
  INSPECTOR: "inspector" as UserRole
};
