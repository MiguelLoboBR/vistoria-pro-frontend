
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

// Define a schema for the inspector form
const inspectorFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Nome completo deve ter no mínimo 2 caracteres.",
  }),
  email: z.string().email({
    message: "Email inválido.",
  }),
  password: z.string().min(6, {
    message: "Senha deve ter no mínimo 6 caracteres.",
  }),
});

export type InspectorFormValues = z.infer<typeof inspectorFormSchema>;

interface InspectorFormProps {
  onSubmit: (values: InspectorFormValues) => void;
  isLoading?: boolean;
  defaultValues?: Partial<InspectorFormValues>;
}

export const InspectorForm = ({ onSubmit, isLoading = false, defaultValues }: InspectorFormProps) => {
  const form = useForm<InspectorFormValues>({
    resolver: zodResolver(inspectorFormSchema),
    defaultValues: {
      fullName: defaultValues?.fullName || "",
      email: defaultValues?.email || "",
      password: defaultValues?.password || "",
    },
  });
  
  const handleSubmit = (values: InspectorFormValues) => {
    onSubmit(values);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input placeholder="Senha" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Criando..." : "Criar"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
