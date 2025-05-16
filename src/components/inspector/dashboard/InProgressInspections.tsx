
import { AlertTriangle } from "lucide-react";
import { InspectionCard } from "@/components/inspector/InspectionCard";
import { Inspection } from "@/services/inspectionService";

interface InProgressInspectionsProps {
  inspections: Inspection[];
}

export const InProgressInspections = ({ inspections }: InProgressInspectionsProps) => {
  if (inspections.length === 0) return null;
  
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold flex items-center">
        <AlertTriangle className="mr-2 h-5 w-5 text-blue-500" />
        Vistorias em andamento
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        {inspections.map(inspection => (
          <InspectionCard 
            key={inspection.id} 
            inspection={inspection}
            variant="inProgress"
          />
        ))}
      </div>
    </div>
  );
};
