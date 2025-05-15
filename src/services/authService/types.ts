
export type UserRole = "admin_master" | "admin_tenant" | "inspector";

// Definir as constantes com o tipo correto para garantir compatibilidade com o enum do banco de dados
export const USER_ROLES: Record<string, UserRole> = {
  ADMIN_MASTER: "admin_master",
  ADMIN_TENANT: "admin_tenant",
  INSPECTOR: "inspector"
};
