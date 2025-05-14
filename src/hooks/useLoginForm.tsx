
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/services/authService/types";

interface UseLoginFormProps {
  role: UserRole | string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const loginFormSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres")
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export const useLoginForm = ({ role, onSuccess, onError }: UseLoginFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      
      if (error) {
        throw error;
      }
      
      if (!data.user) {
        throw new Error("Usuário não encontrado");
      }
      
      // Check user role from metadata
      const userRole = data.user.user_metadata?.role;
      
      // Role validation - only if role is provided and doesn't match
      if (role && userRole && role !== 'admin_tenant' && userRole !== role) {
        // Allow admin_master to login through admin_tenant route
        if (!(role === 'admin_tenant' && userRole === 'admin_master')) {
          await supabase.auth.signOut();
          throw new Error(`Acesso não autorizado para tipo ${userRole}`);
        }
      }
      
      // Success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Transform error message for better user experience
      let errorMessage = error.message;
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Credenciais inválidas";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Email não confirmado";
      }
      
      // Error callback
      if (onError) {
        error.message = errorMessage;
        onError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    form,
    isSubmitting,
    onSubmit
  };
};
