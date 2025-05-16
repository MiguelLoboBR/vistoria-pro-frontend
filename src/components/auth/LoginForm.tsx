
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { ResendConfirmation } from "./ResendConfirmation";
import { toast } from "sonner";
import { useLoginForm } from "@/hooks/useLoginForm";
import { UserRole } from "@/services/authService/types";
import { supabase } from "@/integrations/supabase/client";

interface LoginFormProps {
  role: UserRole;
}

export const LoginForm = ({ role }: LoginFormProps) => {
  const navigate = useNavigate();
  const [showResendUI, setShowResendUI] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  const [isResending, setIsResending] = useState(false);

  const {
    form,
    isSubmitting,
    onSubmit
  } = useLoginForm({
    role,
    onSuccess: async () => {
      try {
        // Check user role
        const { data } = await supabase.auth.getUser();
        let role = data.user?.user_metadata?.role;
        
        if (!role && data.user) {
          try {
            const { data: roleData } = await supabase.rpc('get_current_user_role');
            role = roleData;
          } catch (error) {
            console.error("Error fetching role:", error);
          }
        }
        
        // Redirect based on role
        if (role === "admin_master") {
          navigate("/master/dashboard", { replace: true });
        } else if (role === "admin_tenant") {
          navigate("/admin/dashboard", { replace: true });
        } else {
          navigate("/inspector/dashboard", { replace: true });
        }
      } catch (err: any) {
        toast.error("Erro ao redirecionar", {
          description: err.message || "Erro inesperado ao redirecionar Contate o Suporte"
        });
      }
    },
    onError: (error) => {
      if (error.message.includes("Email not confirmed")) {
        setResendEmail(form.getValues("email"));
        setShowResendUI(true);
        toast.warning("Email não confirmado", {
          description: "Verifique seu email para confirmar sua conta"
        });
      } else {
        toast.error("Erro ao fazer login", {
          description: error.message || "Verifique suas credenciais"
        });
      }
    }
  });

  const handleResendConfirmation = async () => {
    setIsResending(true);
    try {
      // Simulação de reenvio (substitua pela lógica real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Email enviado", {
        description: "Verifique sua caixa de entrada"
      });
    } catch (error) {
      toast.error("Erro ao reenviar email", {
        description: "Tente novamente mais tarde"
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <EmailField control={form.control} />
          <PasswordField control={form.control} />

          <Button
            type="submit"
            className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Form>

      <ResendConfirmation
        show={showResendUI}
        email={resendEmail}
        isLoading={isResending}
        onResend={handleResendConfirmation}
      />
    </div>
  );
};

export default LoginForm;
