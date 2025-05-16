
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight, MapPin } from "lucide-react";
import { Inspection } from "@/services/inspectionService";
import { useNavigate } from "react-router-dom";

interface PendingInspectionsProps {
  inspections: Inspection[];
}

export const PendingInspections = ({ inspections }: PendingInspectionsProps) => {
  const navigate = useNavigate();
  
  if (inspections.length === 0) return null;
  
  // Function to format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <Card>
      <CardHeader className="bg-gray-50 py-4 px-6">
        <CardTitle className="text-lg font-semibold">Próximas vistorias</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {inspections.slice(0, 4).map((inspection) => (
            <div key={inspection.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center mb-1">
                    <Badge variant={inspection.status === 'atrasada' ? 'destructive' : 'outline'} className="mr-2">
                      {inspection.status === 'atrasada' ? 'Atrasada' : 'Agendada'}
                    </Badge>
                    <span className="text-sm font-medium">{inspection.type}</span>
                  </div>
                  <p className="font-medium truncate">{inspection.address}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <div className="flex items-center mr-4">
                      <Clock className="h-4 w-4 mr-1" />
                      {formatDate(inspection.date)}
                    </div>
                    {inspection.time && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {inspection.time}
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => navigate(`/inspector/execute/${inspection.id}`)}
                >
                  Iniciar
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {inspections.length > 4 && (
        <CardFooter className="bg-gray-50 border-t p-3">
          <Button 
            variant="link" 
            className="ml-auto"
            onClick={() => navigate("/inspector/inspections?filter=pending")}
          >
            Ver todas ({inspections.length})
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};
