import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/services/types";

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

const Inspectors = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [open, setOpen] = useState(false);
  const [editInspector, setEditInspector] = useState<UserProfile | null>(null);
  
  const form = useForm<z.infer<typeof inspectorFormSchema>>({
    resolver: zodResolver(inspectorFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });
  
  const { isLoading, error, data: inspectors } = useQuery({
    queryKey: ['inspectors'],
    queryFn: async () => {
      if (!user?.company_id) {
        return [];
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', user.company_id)
        .eq('role', 'inspector');
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as UserProfile[];
    }
  });
  
  const createInspectorMutation = useMutation({
    mutationFn: async (values: z.infer<typeof inspectorFormSchema>) => {
      if (!user?.company_id) {
        throw new Error("Company ID not found");
      }
      
      const { data, error } = await supabase.functions.invoke('add_inspector_to_company', {
        body: {
          company_id: user.company_id,
          email: values.email,
          password: values.password,
          full_name: values.fullName
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspectors'] });
      toast({
        title: "Inspetor criado com sucesso!",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar inspetor",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = async (values: z.infer<typeof inspectorFormSchema>) => {
    createInspectorMutation.mutate(values);
  };
  
  const deleteInspector = async (inspectorId: string) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir este inspetor?");
    if (!confirmDelete) return;
    
    const { error } = await supabase.from('profiles').delete().eq('id', inspectorId);
    if (error) {
      toast({
        title: "Erro ao excluir inspetor",
        description: error.message,
        variant: "destructive",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ['inspectors'] });
      toast({
        title: "Inspetor excluído com sucesso!",
      });
    }
  };
  
  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;
  
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Inspetores</h1>
        
        {/* Only admins can add inspectors */}
        {(user?.role === 'admin_tenant' || user?.role === 'admin_master') && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Inspetor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Adicionar Inspetor</DialogTitle>
                <DialogDescription>
                  Crie um novo inspetor para sua empresa.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Button type="submit" disabled={createInspectorMutation.isPending}>
                      {createInspectorMutation.isPending ? "Criando..." : "Criar"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de inspetores da sua empresa.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspectors?.map((inspector) => (
              <TableRow key={inspector.id}>
                <TableCell>{inspector.full_name}</TableCell>
                <TableCell>{inspector.email}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link to={`/admin/inspectors/${inspector.id}`}>
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteInspector(inspector.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Inspectors;
