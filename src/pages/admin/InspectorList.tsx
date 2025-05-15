import { useState, useEffect } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus, Search, Trash2, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/services/authService";
import { Inspector } from "@/services/types";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export const InspectorList = () => {
  const [inspectors, setInspectors] = useState<Inspector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { company } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
    },
  });
  
  // Fetch real inspectors from database
  useEffect(() => {
    const fetchInspectors = async () => {
      if (!company) {
        toast.error("Você precisa estar vinculado a uma empresa");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("company_id", company.id)
          .eq("role", "inspector");

        if (error) {
          throw error;
        }

        // Transform the data to match our Inspector interface
        const inspectorsData = data.map((profile): Inspector => ({
          id: profile.id,
          email: profile.email,
          full_name: profile.full_name || "",
          avatar_url: profile.avatar_url || "",
          company_id: profile.company_id || "",
          role: "inspector",
          inspections_count: 0 // We'll leave this at 0 until we create the inspections table
        }));

        setInspectors(inspectorsData);
      } catch (error: any) {
        console.error("Error fetching inspectors:", error.message);
        toast.error("Erro ao buscar vistoriadores");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInspectors();
  }, [company]);
  
  // Filter inspectors based on search query
  const filteredInspectors = inspectors.filter((inspector) => {
    const query = searchQuery.toLowerCase();
    return (
      (inspector.full_name?.toLowerCase() || "").includes(query) ||
      inspector.email.toLowerCase().includes(query)
    );
  });
  
  // Handle adding a new inspector
  const handleAddInspector = async (values: z.infer<typeof formSchema>) => {
    if (!company) {
      toast.error("Você precisa estar vinculado a uma empresa");
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Register the inspector using the authService
      const inspector = await authService.registerInspector(
        values.email, 
        values.password, 
        values.name,
        company.id
      );
      
      if (!inspector) {
        throw new Error("Erro ao criar usuário do vistoriador");
      }

      // Add to local state
      const newInspector: Inspector = {
        id: inspector.id,
        email: values.email,
        full_name: values.name,
        role: "inspector",
        company_id: company.id,
        inspections_count: 0
      };
      
      setInspectors(prev => [...prev, newInspector]);
      
      // Close dialog and reset form
      setOpenAddDialog(false);
      form.reset();
      
      toast.success("Vistoriador adicionado com sucesso!");
    } catch (error: any) {
      console.error("Error adding inspector:", error);
      toast.error(`Erro ao adicionar vistoriador: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vistoriadores</h1>
            <p className="text-gray-500">Gerencie sua equipe de vistoriadores.</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                className="pl-9 w-full md:w-[250px]"
                placeholder="Buscar vistoriador..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Vistoriador</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para cadastrar um novo vistoriador na plataforma.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddInspector)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome do vistoriador" {...field} />
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
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="email@exemplo.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefone</FormLabel>
                          <FormControl>
                            <Input placeholder="(11) 99999-9999" {...field} />
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
                            <Input type="password" placeholder="Senha para acesso" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setOpenAddDialog(false)} type="button">
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={submitting}>
                        {submitting ? "Adicionando..." : "Adicionar Vistoriador"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-vistoria-blue"></div>
          </div>
        ) : (
          <>
            {/* Inspectors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInspectors.map((inspector) => (
                <Card key={inspector.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={inspector.avatar_url || ""} />
                          <AvatarFallback className="bg-vistoria-blue text-white">
                            {inspector.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "IN"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-base">{inspector.full_name || "Sem nome"}</CardTitle>
                          <CardDescription>{inspector.email}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="default">
                        Ativo
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="text-sm">
                      <div className="flex justify-between py-1 border-b">
                        <span className="text-gray-500">Vistorias:</span>
                        <span>{inspector.inspections_count || 0}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-500">ID:</span>
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {inspector.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Pencil className="mr-1 h-3.5 w-3.5" />
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Add Inspector Card */}
              <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
                <DialogTrigger asChild>
                  <Card className="border-dashed flex flex-col items-center justify-center cursor-pointer hover:border-vistoria-blue/60 hover:bg-gray-50/50 transition-colors">
                    <CardContent className="flex flex-col items-center justify-center h-full py-10">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                      <h3 className="font-medium">Adicionar Vistoriador</h3>
                      <p className="text-sm text-gray-500">Clique para cadastrar um novo vistoriador</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
              </Dialog>
            </div>
            
            {filteredInspectors.length === 0 && !isLoading && (
              <div className="text-center py-12">
                {searchQuery ? (
                  <p className="text-gray-500">Nenhum vistoriador encontrado para "{searchQuery}"</p>
                ) : (
                  <p className="text-gray-500">Nenhum vistoriador cadastrado. Adicione o primeiro!</p>
                )}
                {searchQuery && (
                  <Button variant="link" onClick={() => setSearchQuery("")}>
                    Limpar busca
                  </Button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default InspectorList;
