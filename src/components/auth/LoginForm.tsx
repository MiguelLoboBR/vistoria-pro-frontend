
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { UserRole } from "@/services/authService";
import { EmailField } from "./EmailField";
import { PasswordField } from "./PasswordField";
import { ResendConfirmation } from "./ResendConfirmation";
import { useLoginForm } from "@/hooks/useLoginForm";

interface LoginFormProps {
  userType: UserRole;
}

export const LoginForm = ({ userType }: LoginFormProps) => {
  const { 
    form, 
    isLoading, 
    showResendConfirmation, 
    emailForConfirmation,
    handleResendConfirmation,
    onSubmit 
  } = useLoginForm(userType);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <EmailField control={form.control} disabled={isLoading} />
        <PasswordField control={form.control} disabled={isLoading} />
        
        <Button 
          type="submit" 
          className="w-full bg-vistoria-blue hover:bg-vistoria-darkBlue"
          disabled={isLoading}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>
        
        <ResendConfirmation 
          show={showResendConfirmation}
          email={emailForConfirmation}
          isLoading={isLoading}
          onResend={handleResendConfirmation}
        />
        
        <div className="text-center">
          <Button variant="link" className="text-sm text-vistoria-blue" disabled={isLoading}>
            Esqueci minha senha
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LoginForm;
