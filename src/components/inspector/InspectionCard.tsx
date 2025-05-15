
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { CalendarDays, Clock, MapPin, ChevronRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Inspection } from "@/services/inspectionService";

interface InspectionCardProps {
  inspection: Inspection;
  variant: "pending" | "inProgress" | "completed";
}

export const InspectionCard = ({ inspection, variant }: InspectionCardProps) => {
  const navigate = useNavigate();
  
  const handleNavigate = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Se estiver em andamento ou pendente, vai para a página de execução
    if (variant === 'inProgress' || variant === 'pending') {
      navigate(`/inspector/execute/${inspection.id}`);
    } else {
      // Se já estiver concluída, vai para a página de detalhes
      navigate(`/inspector/inspection/${inspection.id}`);
    }
  };
  
  const getBorderColor = () => {
    switch (variant) {
      case 'inProgress': return 'border-blue-400';
      case 'pending': return 'border-yellow-400';
      case 'completed': return 'border-green-400';
      default: return 'border-gray-200';
    }
  };
  
  const getStatusBadge = () => {
    switch (inspection.status) {
      case 'em_andamento': 
        return <span className="text-xs py-1 px-2 rounded-full bg-blue-100 text-blue-800">Em andamento</span>;
      case 'agendada': 
        return <span className="text-xs py-1 px-2 rounded-full bg-yellow-100 text-yellow-800">Agendada</span>;
      case 'atrasada': 
        return <span className="text-xs py-1 px-2 rounded-full bg-red-100 text-red-800 flex items-center">
          <AlertTriangle className="mr-1 h-3 w-3" />
          Atrasada
        </span>;
      case 'concluida': 
        return <span className="text-xs py-1 px-2 rounded-full bg-green-100 text-green-800">Concluída</span>;
      default: 
        return null;
    }
  };
  
  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <Link to={`/inspector/inspection/${inspection.id}`} onClick={handleNavigate}>
      <Card className={cn("transition-all hover:shadow-md cursor-pointer", getBorderColor())}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">
                {inspection.type} - {inspection.id.substring(0, 8)}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                <MapPin className="inline-block mr-1 h-3 w-3" />
                {inspection.address}
              </p>
            </div>
            <div className="flex items-center">
              {getStatusBadge()}
            </div>
          </div>
          
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-xs text-gray-500">
              <CalendarDays className="mr-2 h-3 w-3" />
              {formatDate(inspection.date)}
            </div>
            {inspection.time && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="mr-2 h-3 w-3" />
                {inspection.time}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-3 pt-0 flex justify-end border-t border-gray-100 mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-vistoria-blue"
          >
            {variant === 'inProgress' ? 'Continuar' : 
              variant === 'pending' ? 'Iniciar' : 'Ver detalhes'}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};
