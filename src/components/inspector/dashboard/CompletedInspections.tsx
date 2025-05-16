
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { InspectionCard } from "@/components/inspector/InspectionCard";
import { Inspection } from "@/services/inspectionService";
import { useNavigate } from "react-router-dom";

interface CompletedInspectionsProps {
  inspections: Inspection[];
}

export const CompletedInspections = ({ inspections }: CompletedInspectionsProps) => {
  const navigate = useNavigate();
  
  if (inspections.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
          Vistorias concluídas recentemente
        </h2>
        <Button 
          variant="link" 
          size="sm"
          onClick={() => navigate("/inspector/history")}
        >
          Ver histórico
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {inspections.map(inspection => (
          <InspectionCard 
            key={inspection.id} 
            inspection={inspection}
            variant="completed"
          />
        ))}
      </div>
    </div>
  );
};
