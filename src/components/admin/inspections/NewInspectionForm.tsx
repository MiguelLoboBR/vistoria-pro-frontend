
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  address: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  type: z.string().min(1, "Tipo de vistoria é obrigatório"),
  inspector_id: z.string().optional()
});

export type InspectionFormValues = z.infer<typeof formSchema>;

interface NewInspectionFormProps {
  onSubmit: (values: InspectionFormValues) => Promise<void>;
  inspectors: { id: string, name: string }[];
}

export const NewInspectionForm = ({ onSubmit, inspectors }: NewInspectionFormProps) => {
  const form = useForm<InspectionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      date: "",
      time: "",
      type: "",
      inspector_id: undefined
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Vistoria</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Residencial, Comercial, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço</FormLabel>
              <FormControl>
                <Input placeholder="Endereço completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="inspector_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vistoriador</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um vistoriador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {inspectors.map(inspector => (
                    <SelectItem key={inspector.id} value={inspector.id}>
                      {inspector.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <DialogFooter>
          <Button type="submit">Agendar Vistoria</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
