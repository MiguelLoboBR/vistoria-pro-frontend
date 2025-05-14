
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { ResendConfirmation } from "./ResendConfirmation";
import { toast } from "@/components/ui/use-toast";
import { useLoginForm } from "@/hooks/useLoginForm";

export const LoginForm = ({ role }: { role: "admin_tenant" | "inspector" }) => {
  const navigate = useNavigate();
  const [showResendUI, setShowResendUI] = useState(false);
  const [resendEmail, setResendEmail] = useState("");
  
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
        toast({
          title: "Email não confirmado",
          description: "Verifique seu email para confirmar sua conta",
          variant: "warning"
        });
      } else {
        toast({
          title: "Erro ao fazer login",
          description: error.message || "Verifique suas credenciais",
          variant: "destructive"
        });
      }
    }
  });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <EmailField form={form} />
          <PasswordField form={form} />
          
          <Button 
            type="submit" 
            className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </Form>
      
      {showResendUI && (
        <div className="mt-8 p-4 border rounded-md bg-gray-50">
          <ResendConfirmation email={resendEmail} />
        </div>
      )}
    </div>
  );
};
