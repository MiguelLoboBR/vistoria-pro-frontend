
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  CalendarClock, 
  Calendar,
  Hourglass,
  AlertTriangle,
  CheckCircle 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Inspection } from "@/services/inspectionService";

interface InspectionCardProps {
  inspection: Inspection;
  variant?: "pending" | "inProgress" | "completed";
}

export const InspectionCard = ({ inspection, variant = "pending" }: InspectionCardProps) => {
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "agendada":
        return <Calendar className="h-5 w-5 text-blue-500" />;
      case "atrasada":
        return <Hourglass className="h-5 w-5 text-amber-500" />;
      case "em_andamento":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case "concluida":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
      return dateStr;
    } catch(e) {
      return dateStr;
    }
  };
  
  if (variant === "inProgress") {
    return (
      <Link to={`/app/inspector/inspection/${inspection.id}`}>
        <Card className="border-blue-200 bg-blue-50/50 hover:bg-blue-50">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="font-medium">{inspection.type}</h3>
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
    );
  }
  
  if (variant === "completed") {
    return (
      <Card className="hover:bg-gray-50">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-medium">{inspection.type}</h3>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                <p className="text-sm">{inspection.address}</p>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <CalendarClock className="h-3.5 w-3.5 mr-1" />
                <span>
                  Concluída em {formatDate(inspection.date)}
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
    );
  }
  
  // Default pending variant
  return (
    <Card className={`hover:bg-gray-50 ${inspection.status === "atrasada" ? "border-amber-200" : ""}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{inspection.type}</h3>
              {inspection.status === "atrasada" && (
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                  Atrasada
                </span>
              )}
            </div>
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <p className="text-sm">{inspection.address}</p>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <CalendarClock className="h-3.5 w-3.5 mr-1" />
              <span>
                {formatDate(inspection.date)} às {inspection.time}
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
  );
};
