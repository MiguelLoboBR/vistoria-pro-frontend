
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Search, ListFilter, CheckCircle, Clock, AlertTriangle, Hourglass } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Inspection, inspectionService } from "@/services/inspectionService";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  address: z.string().min(5, "Endereço deve ter no mínimo 5 caracteres"),
  date: z.string().min(1, "Data é obrigatória"),
  time: z.string().min(1, "Horário é obrigatório"),
  type: z.string().min(1, "Tipo de vistoria é obrigatório"),
  inspector_id: z.string().optional()
});

const Vistorias = () => {
  const [vistorias, setVistorias] = useState<Inspection[]>([]);
  const [filteredVistorias, setFilteredVistorias] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inspectors, setInspectors] = useState<{ id: string, name: string }[]>([]);
  const { company, user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: "",
      date: "",
      time: "",
      type: "",
      inspector_id: undefined
    },
  });
  
  // Fetch inspectors for the company
  useEffect(() => {
    const fetchInspectors = async () => {
      if (!company) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("company_id", company.id)
          .eq("role", "inspector");
          
        if (error) throw error;
        
        setInspectors(data.map(i => ({ id: i.id, name: i.full_name || "Sem nome" })));
      } catch (error) {
        console.error("Error fetching inspectors:", error);
      }
    };
    
    fetchInspectors();
  }, [company]);

  useEffect(() => {
    const fetchVistorias = async () => {
      if (!company) {
        toast.error("Você precisa estar vinculado a uma empresa");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await inspectionService.getCompanyInspections(company.id);
        setVistorias(data);
        setFilteredVistorias(data);
      } catch (error) {
        console.error("Erro ao buscar vistorias:", error);
        toast.error("Erro ao carregar vistorias");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVistorias();
  }, [company]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVistorias(vistorias);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = vistorias.filter((vistoria) => 
      vistoria.address.toLowerCase().includes(query) ||
      vistoria.id.toLowerCase().includes(query) ||
      vistoria.type.toLowerCase().includes(query) ||
      (vistoria.inspector_name && vistoria.inspector_name.toLowerCase().includes(query))
    );
    setFilteredVistorias(filtered);
  }, [searchQuery, vistorias]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "agendada":
        return (
          <div className="flex items-center gap-1.5 text-blue-500 font-medium">
            <Calendar className="h-4 w-4" />
            <span>Agendada</span>
          </div>
        );
      case "atrasada":
        return (
          <div className="flex items-center gap-1.5 text-amber-500 font-medium">
            <Hourglass className="h-4 w-4" />
            <span>Atrasada</span>
          </div>
        );
      case "em_andamento":
        return (
          <div className="flex items-center gap-1.5 text-blue-500 font-medium">
            <AlertTriangle className="h-4 w-4" />
            <span>Em andamento</span>
          </div>
        );
      case "concluida":
        return (
          <div className="flex items-center gap-1.5 text-green-500 font-medium">
            <CheckCircle className="h-4 w-4" />
            <span>Concluída</span>
          </div>
        );
      default:
        return null;
    }
  };

  const formatDateTime = (dateString: string, timeString?: string | null) => {
    if (!dateString) return "Data não informada";
    
    try {
      // If dateString already has time information
      if (dateString.includes("T")) {
        const date = new Date(dateString);
        return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit'
        })}`;
      } 
      // If we have separate date and time strings
      else if (timeString) {
        return `${dateString} às ${timeString}`;
      } 
      // If we only have date string
      else {
        return dateString;
      }
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!company || !user) {
      toast.error("Você precisa estar vinculado a uma empresa");
      return;
    }
    
    try {
      const inspectionData = {
        address: values.address,
        date: values.date,
        time: values.time,
        type: values.type,
        status: "agendada" as const,
        company_id: company.id,
        inspector_id: values.inspector_id || null
      };
      
      const newInspection = await inspectionService.createInspection(inspectionData);
      
      if (newInspection) {
        // Add the inspector name if we have the inspector data
        if (values.inspector_id) {
          const inspector = inspectors.find(i => i.id === values.inspector_id);
          if (inspector) {
            newInspection.inspector_name = inspector.name;
          }
        }
        
        setVistorias(prev => [newInspection, ...prev]);
        setFilteredVistorias(prev => [newInspection, ...prev]);
        toast.success("Vistoria criada com sucesso!");
        setDialogOpen(false);
        form.reset();
      }
    } catch (error) {
      console.error("Error creating inspection:", error);
      toast.error("Erro ao criar vistoria");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Vistorias</h1>
            <p className="text-gray-500">Gerencie as vistorias da sua empresa</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex gap-2 items-center">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Ver Calendário</span>
            </Button>
            
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex gap-2 items-center">
                  <Plus className="h-4 w-4" />
                  <span>Nova Vistoria</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agendar Nova Vistoria</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para agendar uma nova vistoria.
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Vistorias</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Buscar por endereço..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon">
                  <ListFilter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-vistoria-blue"></div>
              </div>
            ) : filteredVistorias.length > 0 ? (
              <div className="rounded-md border">
                <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] py-3 px-4 border-b bg-gray-50 font-medium text-sm">
                  <div>Detalhes</div>
                  <div className="hidden md:block">Data</div>
                  <div className="hidden md:block">Vistoriador</div>
                  <div className="hidden md:block">Status</div>
                </div>
                <div className="divide-y">
                  {filteredVistorias.map((vistoria) => (
                    <div 
                      key={vistoria.id} 
                      className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] py-3 px-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="font-medium text-sm">
                          {vistoria.id.slice(0, 8)} - {vistoria.type}
                        </div>
                        <div className="text-sm text-gray-500">{vistoria.address}</div>
                        <div className="md:hidden text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDateTime(vistoria.date, vistoria.time)}</span>
                        </div>
                        <div className="md:hidden mt-2">{getStatusBadge(vistoria.status)}</div>
                        <div className="md:hidden text-xs text-gray-500 mt-1">{vistoria.inspector_name || "Não atribuído"}</div>
                      </div>
                      <div className="hidden md:flex md:items-center text-sm">
                        {formatDateTime(vistoria.date, vistoria.time)}
                      </div>
                      <div className="hidden md:flex md:items-center text-sm">
                        {vistoria.inspector_name || "Não atribuído"}
                      </div>
                      <div className="hidden md:flex md:items-center">
                        {getStatusBadge(vistoria.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                {searchQuery ? (
                  <p className="text-gray-500">Nenhuma vistoria encontrada para "{searchQuery}"</p>
                ) : (
                  <p className="text-gray-500">Nenhuma vistoria cadastrada. Adicione a primeira!</p>
                )}
                {searchQuery && (
                  <Button variant="link" onClick={() => setSearchQuery("")}>
                    Limpar busca
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Vistorias;
