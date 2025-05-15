
export type UserRole = "admin_master" | "admin_tenant" | "inspector";

// Definir as constantes com o tipo correto para garantir compatibilidade com o enum do banco de dados
export const USER_ROLES = {
  ADMIN_MASTER: "admin_master" as UserRole,
  ADMIN_TENANT: "admin_tenant" as UserRole,
  INSPECTOR: "inspector" as UserRole
};
