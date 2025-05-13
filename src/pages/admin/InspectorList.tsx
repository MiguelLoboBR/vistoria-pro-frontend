
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, Plus, Search, Trash2, UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface Inspector {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive";
  inspections: number;
}

export const InspectorList = () => {
  const [inspectors, setInspectors] = useState<Inspector[]>([
    { id: "1", name: "João Silva", email: "joao@vistoriapro.com", phone: "(11) 99876-5432", status: "active", inspections: 35 },
    { id: "2", name: "Maria Oliveira", email: "maria@vistoriapro.com", phone: "(11) 98765-4321", status: "active", inspections: 42 },
    { id: "3", name: "Carlos Santos", email: "carlos@vistoriapro.com", phone: "(11) 97654-3210", status: "active", inspections: 28 },
    { id: "4", name: "Ana Pereira", email: "ana@vistoriapro.com", phone: "(11) 96543-2109", status: "inactive", inspections: 19 },
    { id: "5", name: "Pedro Souza", email: "pedro@vistoriapro.com", phone: "(11) 95432-1098", status: "active", inspections: 31 },
  ]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newInspector, setNewInspector] = useState({
    name: "",
    email: "",
    phone: "",
  });
  
  // Filter inspectors based on search query
  const filteredInspectors = inspectors.filter((inspector) => {
    const query = searchQuery.toLowerCase();
    return (
      inspector.name.toLowerCase().includes(query) ||
      inspector.email.toLowerCase().includes(query) ||
      inspector.phone.includes(query)
    );
  });
  
  // Handle adding a new inspector
  const handleAddInspector = () => {
    // Validation would go here in a real app
    const newId = (inspectors.length + 1).toString();
    setInspectors([
      ...inspectors,
      {
        id: newId,
        ...newInspector,
        status: "active",
        inspections: 0,
      },
    ]);
    
    setNewInspector({
      name: "",
      email: "",
      phone: "",
    });
    
    setOpenAddDialog(false);
    toast.success("Vistoriador adicionado com sucesso!");
  };
  
  // Handle toggling inspector status
  const toggleInspectorStatus = (id: string) => {
    setInspectors(
      inspectors.map((inspector) =>
        inspector.id === id
          ? {
              ...inspector,
              status: inspector.status === "active" ? "inactive" : "active",
            }
          : inspector
      )
    );
    
    const inspector = inspectors.find((i) => i.id === id);
    if (inspector) {
      toast.success(
        `Vistoriador ${inspector.name} ${inspector.status === "active" ? "desativado" : "ativado"} com sucesso!`
      );
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
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input 
                      id="name" 
                      placeholder="Nome do vistoriador"
                      value={newInspector.name}
                      onChange={(e) => setNewInspector({ ...newInspector, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="email@exemplo.com"
                      value={newInspector.email}
                      onChange={(e) => setNewInspector({ ...newInspector, email: e.target.value })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input 
                      id="phone" 
                      placeholder="(11) 99999-9999"
                      value={newInspector.phone}
                      onChange={(e) => setNewInspector({ ...newInspector, phone: e.target.value })}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleAddInspector}>
                    Adicionar Vistoriador
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Inspectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInspectors.map((inspector) => (
            <Card key={inspector.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-vistoria-blue text-white">
                        {inspector.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{inspector.name}</CardTitle>
                      <CardDescription>{inspector.email}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={inspector.status === "active" ? "default" : "outline"}>
                    {inspector.status === "active" ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="text-sm">
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-500">Telefone:</span>
                    <span>{inspector.phone}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b">
                    <span className="text-gray-500">Vistorias:</span>
                    <span>{inspector.inspections}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500">ID:</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                      VISP-{inspector.id.padStart(4, "0")}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  Editar
                </Button>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toggleInspectorStatus(inspector.id)}
                  >
                    {inspector.status === "active" ? "Desativar" : "Ativar"}
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
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
        
        {filteredInspectors.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <p className="text-gray-500">Nenhum vistoriador encontrado para "{searchQuery}"</p>
            <Button variant="link" onClick={() => setSearchQuery("")}>
              Limpar busca
            </Button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default InspectorList;
