
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Control } from "react-hook-form";
import { usePasswordVisibility } from "@/hooks/usePasswordVisibility";

export interface PasswordFieldProps {
  control: Control<any>;
  disabled?: boolean;
}

export const PasswordField = ({ control, disabled = false }: PasswordFieldProps) => {
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();
  
  return (
    <FormField
      control={control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Senha</FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                placeholder="Sua senha" 
                type={showPassword ? "text" : "password"} 
                {...field} 
                disabled={disabled}
                autoComplete="current-password"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3"
                onClick={togglePasswordVisibility}
                disabled={disabled}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
