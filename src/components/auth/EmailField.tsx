
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface EmailFieldProps {
  control: Control<any>;
  disabled?: boolean;
}

export const EmailField = ({ control, disabled = false }: EmailFieldProps) => {
  return (
    <FormField
      control={control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>E-mail</FormLabel>
          <FormControl>
            <Input 
              placeholder="seu@email.com" 
              type="email" 
              {...field} 
              disabled={disabled} 
              autoComplete="email"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
