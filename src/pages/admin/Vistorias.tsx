
import React from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Search, Filter, ListFilter, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface VistoriaItem {
  id: string;
  address: string;
  date: string;
  time: string;
  status: "pending" | "in_progress" | "completed";
  inspector: string;
  type: string;
}

const mockVistorias: VistoriaItem[] = [
  {
    id: "VIS-1001",
    address: "Rua Augusta, 1200, Apto 45 - Consolação",
    date: "15/05/2025",
    time: "14:30",
    status: "pending",
    inspector: "Carlos Silva",
    type: "Entrada"
  },
  {
    id: "VIS-1002",
    address: "Av. Paulista, 1000, Sala 301 - Bela Vista",
    date: "16/05/2025",
    time: "10:15",
    status: "in_progress",
    inspector: "Ana Oliveira",
    type: "Saída"
  },
  {
    id: "VIS-1003",
    address: "Rua Oscar Freire, 500, Casa 3 - Jardins",
    date: "14/05/2025",
    time: "09:00",
    status: "completed",
    inspector: "Roberto Martins",
    type: "Periódica"
  },
  {
    id: "VIS-1004",
    address: "Alameda Santos, 800, Apto 122 - Jardim Paulista",
    date: "17/05/2025",
    time: "16:30",
    status: "pending",
    inspector: "Mariana Costa",
    type: "Entrada"
  },
  {
    id: "VIS-1005",
    address: "Rua Haddock Lobo, 350, Casa 2 - Cerqueira César",
    date: "13/05/2025",
    time: "11:45",
    status: "completed",
    inspector: "Carlos Silva",
    type: "Saída"
  }
];

const Vistorias = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <div className="flex items-center gap-1.5 text-amber-500 font-medium">
            <Clock className="h-4 w-4" />
            <span>Pendente</span>
          </div>
        );
      case "in_progress":
        return (
          <div className="flex items-center gap-1.5 text-blue-500 font-medium">
            <AlertTriangle className="h-4 w-4" />
            <span>Em andamento</span>
          </div>
        );
      case "completed":
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
            <Button className="flex gap-2 items-center">
              <Plus className="h-4 w-4" />
              <span>Nova Vistoria</span>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Vistorias Recentes</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Buscar por endereço..." 
                    className="pl-9"
                  />
                </div>
                <Button variant="outline" size="icon">
                  <ListFilter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] py-3 px-4 border-b bg-gray-50 font-medium text-sm">
                <div>Detalhes</div>
                <div className="hidden md:block">Data</div>
                <div className="hidden md:block">Vistoriador</div>
                <div className="hidden md:block">Status</div>
              </div>
              <div className="divide-y">
                {mockVistorias.map((vistoria) => (
                  <div 
                    key={vistoria.id} 
                    className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] py-3 px-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-sm">
                        {vistoria.id} - {vistoria.type}
                      </div>
                      <div className="text-sm text-gray-500">{vistoria.address}</div>
                      <div className="md:hidden text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{vistoria.date} às {vistoria.time}</span>
                      </div>
                      <div className="md:hidden mt-2">{getStatusBadge(vistoria.status)}</div>
                      <div className="md:hidden text-xs text-gray-500 mt-1">{vistoria.inspector}</div>
                    </div>
                    <div className="hidden md:flex md:items-center text-sm">
                      {vistoria.date} às {vistoria.time}
                    </div>
                    <div className="hidden md:flex md:items-center text-sm">
                      {vistoria.inspector}
                    </div>
                    <div className="hidden md:flex md:items-center">
                      {getStatusBadge(vistoria.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Vistorias;
