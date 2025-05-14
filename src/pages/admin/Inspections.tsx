
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Calendar, Download, FilePlus, Filter, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const MOCK_INSPECTIONS = [
  {
    id: "VIS-1001",
    address: "Av. Paulista, 1000, Apto 123",
    type: "Entrada",
    date: "15/05/2025",
    inspector: "João Silva",
    status: "completed"
  },
  {
    id: "VIS-1002",
    address: "R. Augusta, 500, Casa 2",
    type: "Saída",
    date: "14/05/2025",
    inspector: "Maria Oliveira",
    status: "completed"
  },
  {
    id: "VIS-1003",
    address: "R. Oscar Freire, 200, Sala 45",
    type: "Periódica",
    date: "13/05/2025",
    inspector: "Carlos Santos", 
    status: "pending"
  },
  {
    id: "VIS-1004",
    address: "Av. Brigadeiro, 800, Apto 42",
    type: "Entrada",
    date: "12/05/2025",
    inspector: "Ana Pereira",
    status: "in_progress"
  },
  {
    id: "VIS-1005",
    address: "R. Haddock Lobo, 595, Sala 204",
    type: "Saída",
    date: "11/05/2025",
    inspector: "Pedro Santos",
    status: "canceled"
  },
];

export const AdminInspections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs font-medium";
      case "in_progress":
        return "bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs font-medium";
      case "pending":
        return "bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium";
      case "canceled":
        return "bg-red-100 text-red-800 px-2 py-0.5 rounded text-xs font-medium";
      default:
        return "bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs font-medium";
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed": return "Concluída";
      case "in_progress": return "Em Andamento";
      case "pending": return "Pendente";
      case "canceled": return "Cancelada";
      default: return status;
    }
  };
  
  const filteredInspections = MOCK_INSPECTIONS.filter(inspection => {
    const matchesSearch = inspection.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesStatus = !statusFilter || inspection.status === statusFilter;
    const matchesType = !typeFilter || inspection.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Vistoria agendada com sucesso!");
    setIsAddDialogOpen(false);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vistorias</h1>
            <p className="text-gray-500">Gerenciamento de todas as vistorias realizadas e agendadas.</p>
          </div>
          
          <div className="flex gap-3">
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Nova Vistoria
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agendar Nova Vistoria</DialogTitle>
                  <DialogDescription>
                    Preencha os dados para agendar uma nova vistoria.
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleAddInspection} className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input id="address" placeholder="Endereço completo do imóvel" />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="type">Tipo de Vistoria</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Entrada">Entrada</SelectItem>
                          <SelectItem value="Saída">Saída</SelectItem>
                          <SelectItem value="Periódica">Periódica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Data</Label>
                        <Input id="date" type="date" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Horário</Label>
                        <Input id="time" type="time" />
                      </div>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="inspector">Vistoriador</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o vistoriador" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inspector-1">João Silva</SelectItem>
                          <SelectItem value="inspector-2">Maria Oliveira</SelectItem>
                          <SelectItem value="inspector-3">Carlos Santos</SelectItem>
                          <SelectItem value="inspector-4">Ana Pereira</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit">Agendar Vistoria</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              className="pl-9"
              placeholder="Buscar por endereço, ID ou vistoriador"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap md:flex-nowrap">
            <div className="w-full md:w-auto flex gap-2 items-center">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Filtros:</span>
            </div>
            
            <Select value={statusFilter || ""} onValueChange={(value) => setStatusFilter(value || null)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="canceled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter || ""} onValueChange={(value) => setTypeFilter(value || null)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os Tipos</SelectItem>
                <SelectItem value="Entrada">Entrada</SelectItem>
                <SelectItem value="Saída">Saída</SelectItem>
                <SelectItem value="Periódica">Periódica</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Inspection Table */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left font-medium">ID</th>
                  <th className="py-3 px-4 text-left font-medium">Endereço</th>
                  <th className="py-3 px-4 text-left font-medium">Tipo</th>
                  <th className="py-3 px-4 text-left font-medium">Data</th>
                  <th className="py-3 px-4 text-left font-medium">Vistoriador</th>
                  <th className="py-3 px-4 text-left font-medium">Status</th>
                  <th className="py-3 px-4 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredInspections.map((inspection, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4 font-mono text-xs">{inspection.id}</td>
                    <td className="py-3 px-4">{inspection.address}</td>
                    <td className="py-3 px-4">{inspection.type}</td>
                    <td className="py-3 px-4">{inspection.date}</td>
                    <td className="py-3 px-4">{inspection.inspector}</td>
                    <td className="py-3 px-4">
                      <span className={getStatusBadgeClass(inspection.status)}>
                        {getStatusLabel(inspection.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm">
                        Detalhes
                      </Button>
                    </td>
                  </tr>
                ))}
                
                {filteredInspections.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      Nenhuma vistoria encontrada com os filtros selecionados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminInspections;
