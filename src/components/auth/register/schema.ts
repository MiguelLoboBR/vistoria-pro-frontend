
import { z } from "zod";

export const registerFormSchema = z.object({
  // User auth fields
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  
  // Company fields
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  companyAddress: z.string().optional(),
  companyPhone: z.string().optional(),
  companyEmail: z.string().optional(),
  cnpj: z.string().min(1, "CNPJ/CPF é obrigatório"),
  
  // Admin fields
  adminName: z.string().min(3, "Nome do administrador é obrigatório"),
  adminCpf: z.string().min(11, "CPF inválido"),
  adminPhone: z.string().optional(),
  adminEmail: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
