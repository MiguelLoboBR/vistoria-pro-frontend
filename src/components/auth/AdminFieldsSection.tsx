
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { RegisterFormValues } from "./RegisterForm";

interface AdminFieldsSectionProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const AdminFieldsSection = ({ form }: AdminFieldsSectionProps) => {
  return (
    <div className="space-y-5 pt-4">
      <h2 className="font-bold text-lg border-b pb-2">Dados do Administrador</h2>
      
      <FormField
        control={form.control}
        name="adminName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input placeholder="Nome completo" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="adminCpf"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CPF</FormLabel>
            <FormControl>
              <Input placeholder="000.000.000-00" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="adminPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input placeholder="(00) 00000-0000" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="adminEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>E-mail do Administrador</FormLabel>
            <FormControl>
              <Input placeholder="admin@exemplo.com" type="email" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
