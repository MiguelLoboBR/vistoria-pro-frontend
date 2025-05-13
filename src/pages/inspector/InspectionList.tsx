
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, MapPin, CalendarClock, CheckCircle, AlertTriangle, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Inspection {
  id: string;
  address: string;
  date: string;
  time: string;
  propertyType: string;
  status: "pending" | "in_progress" | "completed";
}

export const InspectionList = () => {
  const [inspections] = useState<Inspection[]>([
    {
      id: "VIS-1234",
      address: "Av. Paulista, 1000, Apto 123",
      date: "15/05/2025",
      time: "14:30",
      propertyType: "Apartamento",
      status: "pending"
    },
    {
      id: "VIS-1235",
      address: "R. Augusta, 500, Casa 2",
      date: "16/05/2025",
      time: "10:00",
      propertyType: "Casa",
      status: "pending"
    },
    {
      id: "VIS-1233",
      address: "R. Oscar Freire, 200, Sala 45",
      date: "14/05/2025",
      time: "16:45",
      propertyType: "Comercial",
      status: "in_progress"
    },
    {
      id: "VIS-1232",
      address: "Av. Santo Amaro, 455, Casa 3",
      date: "13/05/2025",
      time: "09:15",
      propertyType: "Casa",
      status: "completed"
    },
    {
      id: "VIS-1231",
      address: "Alameda Santos, 700, Apto 52",
      date: "12/05/2025",
      time: "11:30",
      propertyType: "Apartamento",
      status: "completed"
    },
  ]);
  
  // Group inspections by status
  const pendingInspections = inspections.filter(i => i.status === "pending");
  const inProgressInspections = inspections.filter(i => i.status === "in_progress");
  const completedInspections = inspections.filter(i => i.status === "completed").slice(0, 3); // Only show 3 most recent completed
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      case "in_progress":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Pendente";
      case "in_progress":
        return "Em andamento";
      case "completed":
        return "Concluída";
      default:
        return "";
    }
  };

  return (
    <InspectorLayout>
      <div className="space-y-6 pb-16">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Vistorias</h1>
            <p className="text-gray-500">Gerencie suas vistorias agendadas</p>
          </div>
          <Button className="shrink-0">
            <CalendarClock className="mr-2 h-4 w-4" />
            Ver Agenda
          </Button>
        </div>
        
        {/* In Progress */}
        {inProgressInspections.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-xl flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-blue-500" />
              Em andamento
            </h2>
            {inProgressInspections.map((inspection) => (
              <Link 
                key={inspection.id} 
                to={`/app/inspector/inspection/${inspection.id}`}
              >
                <Card className="border-blue-200 bg-blue-50/50 hover:bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-medium">{inspection.propertyType}</h3>
                        <div className="flex items-start space-x-2">
                          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                          <p className="text-sm">{inspection.address}</p>
                        </div>
                      </div>
                      <Button variant="outline" className="ml-2 shrink-0">
                        Continuar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
        
        {/* Pending */}
        {pendingInspections.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-xl flex items-center">
              <Clock className="mr-2 h-5 w-5 text-amber-500" />
              Pendentes
            </h2>
            {pendingInspections.map((inspection) => (
              <Card key={inspection.id} className="hover:bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-medium">{inspection.propertyType}</h3>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <p className="text-sm">{inspection.address}</p>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarClock className="h-3.5 w-3.5 mr-1" />
                        <span>
                          {inspection.date} às {inspection.time}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="ml-2 shrink-0"
                      asChild
                    >
                      <Link to={`/app/inspector/inspection/${inspection.id}`}>
                        Iniciar
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Recently Completed */}
        {completedInspections.length > 0 && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-xl flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Concluídas recentemente
              </h2>
              <Button variant="link" size="sm" asChild>
                <Link to="/app/inspector/history">
                  Ver todas
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            {completedInspections.map((inspection) => (
              <Card key={inspection.id} className="hover:bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-medium">{inspection.propertyType}</h3>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                        <p className="text-sm">{inspection.address}</p>
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <CalendarClock className="h-3.5 w-3.5 mr-1" />
                        <span>
                          Concluída em {inspection.date}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="ml-2 px-2"
                      asChild
                    >
                      <Link to={`/app/inspector/inspection/${inspection.id}/report`}>
                        Ver laudo
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {pendingInspections.length === 0 && inProgressInspections.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
              <CalendarClock className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">Nenhuma vistoria pendente</h2>
            <p className="text-gray-500 mb-6">Você não tem vistorias pendentes no momento.</p>
            <Button asChild>
              <Link to="/app/inspector/history">
                Ver histórico de vistorias
              </Link>
            </Button>
          </div>
        )}
      </div>
    </InspectorLayout>
  );
};

export default InspectionList;
