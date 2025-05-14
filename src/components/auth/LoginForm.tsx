
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { ResendConfirmation } from "./ResendConfirmation";
import { toast } from "@/components/ui/use-toast";
import { useLoginForm } from "@/hooks/useLoginForm";

interface LoginFormProps {
  role: "admin_tenant" | "inspector";
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
    onSuccess: () => {
      // Redirect to appropriate dashboard
      if (role === "admin_tenant") {
        navigate("/admin/dashboard");
      } else {
        navigate("/inspector/dashboard");
      }
    },
    onError: (error) => {
      if (error.message.includes("Email not confirmed")) {
        setResendEmail(form.getValues("email"));
        setShowResendUI(true);
        toast("Email não confirmado", {
          description: "Verifique seu email para confirmar sua conta",
          type: "warning"
        });
      } else {
        toast("Erro ao fazer login", {
          description: error.message || "Verifique suas credenciais",
          type: "error"
        });
      }
    }
  });

  const handleResendConfirmation = async () => {
    setIsResending(true);
    try {
      // Implement resend logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast("Email enviado", { 
        description: "Verifique sua caixa de entrada", 
        type: "success" 
      });
    } catch (error) {
      toast("Erro ao reenviar email", { 
        description: "Tente novamente mais tarde", 
        type: "error" 
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
