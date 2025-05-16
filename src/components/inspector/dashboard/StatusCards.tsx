
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatusCardsProps {
  totalInProgress: number;
  totalPending: number;
  totalCompleted: number;
}

export const StatusCards = ({ totalInProgress, totalPending, totalCompleted }: StatusCardsProps) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card 
        className={`border-l-4 ${totalInProgress > 0 ? 'border-l-blue-500' : 'border-l-gray-300'}`}
        onClick={totalInProgress > 0 ? () => navigate("/inspector/inspections?filter=inProgress") : undefined}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium">
            <AlertTriangle className="mr-2 h-4 w-4 text-blue-500" />
            Em andamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInProgress}</div>
          <p className="text-xs text-gray-500">Vistorias em progresso</p>
        </CardContent>
      </Card>
      
      <Card 
        className={`border-l-4 ${totalPending > 0 ? 'border-l-amber-500' : 'border-l-gray-300'}`}
        onClick={totalPending > 0 ? () => navigate("/inspector/inspections?filter=pending") : undefined}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium">
            <Clock className="mr-2 h-4 w-4 text-amber-500" />
            Aguardando
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPending}</div>
          <p className="text-xs text-gray-500">Vistorias pendentes</p>
        </CardContent>
      </Card>
      
      <Card 
        className={`border-l-4 ${totalCompleted > 0 ? 'border-l-green-500' : 'border-l-gray-300'}`}
        onClick={totalCompleted > 0 ? () => navigate("/inspector/history") : undefined}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm font-medium">
            <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
            Concluídas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCompleted}</div>
          <p className="text-xs text-gray-500">Vistorias finalizadas recentes</p>
        </CardContent>
      </Card>
    </div>
  );
};
