
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { UserRole } from "@/services/authService";

const formSchema = z.object({
  email: z.string().email("Digite um e-mail válido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormValues = z.infer<typeof formSchema>;

export function useLoginForm(userType: UserRole) {
  const [isLoading, setIsLoading] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [emailForConfirmation, setEmailForConfirmation] = useState("");

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleResendConfirmation = async () => {
    if (!emailForConfirmation) return;
    
    setIsLoading(true);
    try {
      await supabase.auth.resend({
        type: 'signup',
        email: emailForConfirmation,
      });
      toast.success("Link de confirmação reenviado para seu e-mail!");
    } catch (error: any) {
      toast.error(`Erro ao reenviar o e-mail de confirmação: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setShowResendConfirmation(false);
    
    try {
      console.log("Tentando fazer login com:", values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) throw error;
      
      toast.success("Login bem-sucedido!");
      console.log("Login bem-sucedido, redirecionando...");
      
      // Get user metadata to check actual role
      const role = data.user?.user_metadata?.role || "inspector";
      
      // Direct redirects to ensure no race conditions with context
      if (role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/inspector/dashboard";
      }
      
    } catch (error: any) {
      console.error("Erro de login:", error);
      
      if (error.message.includes("Email não confirmado") || 
          error.message.includes("Email not confirmed")) {
        setShowResendConfirmation(true);
        setEmailForConfirmation(values.email);
        toast.error(
          "Email não confirmado. Por favor, verifique sua caixa de entrada para o link de confirmação."
        );
      } else {
        toast.error(`Erro ao fazer login: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    showResendConfirmation,
    emailForConfirmation,
    handleResendConfirmation,
    onSubmit
  };
}
