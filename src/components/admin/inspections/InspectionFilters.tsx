
import { Search, Filter, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface InspectionFiltersProps {
  searchTerm: string;
  statusFilter: string | null;
  typeFilter: string | null;
  setSearchTerm: (value: string) => void;
  setStatusFilter: (value: string | null) => void;
  setTypeFilter: (value: string | null) => void;
}

export const InspectionFilters = ({
  searchTerm,
  statusFilter,
  typeFilter,
  setSearchTerm,
  setStatusFilter,
  setTypeFilter
}: InspectionFiltersProps) => {
  return (
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
  );
};
