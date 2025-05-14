
import { Button } from "@/components/ui/button";

interface ResendConfirmationProps {
  show: boolean;
  email: string;
  isLoading: boolean;
  onResend: () => Promise<void>;
}

export const ResendConfirmation = ({ show, email, isLoading, onResend }: ResendConfirmationProps) => {
  if (!show) return null;
  
  return (
    <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-md">
      <p className="text-sm text-yellow-800 mb-2">
        Seu email ainda não foi confirmado. Verifique sua caixa de entrada ou reenvie o email de confirmação.
      </p>
      <Button 
        type="button"
        variant="outline"
        size="sm"
        onClick={onResend}
        disabled={isLoading}
      >
        Reenviar email de confirmação
      </Button>
    </div>
  );
};
