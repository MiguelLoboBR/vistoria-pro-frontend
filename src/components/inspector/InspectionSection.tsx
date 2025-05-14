
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight
} from "lucide-react";
import { InspectionCard } from "./InspectionCard";
import { Inspection } from "@/services/inspectionService";

interface InspectionSectionProps {
  title: string;
  icon: "pending" | "inProgress" | "completed";
  inspections: Inspection[];
  showViewAll?: boolean;
}

export const InspectionSection = ({ 
  title, 
  icon, 
  inspections, 
  showViewAll = false 
}: InspectionSectionProps) => {
  
  if (inspections.length === 0) {
    return null;
  }
  
  const renderIcon = () => {
    switch (icon) {
      case "pending":
        return <Calendar className="mr-2 h-5 w-5 text-blue-500" />;
      case "inProgress":
        return <AlertTriangle className="mr-2 h-5 w-5 text-blue-500" />;
      case "completed":
        return <CheckCircle className="mr-2 h-5 w-5 text-green-500" />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-xl flex items-center">
          {renderIcon()}
          {title}
        </h2>
        {showViewAll && (
          <Button variant="link" size="sm" asChild>
            <Link to="/app/inspector/history">
              Ver todas
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
      
      {inspections.map((inspection) => (
        <InspectionCard 
          key={inspection.id} 
          inspection={inspection} 
          variant={icon}
        />
      ))}
    </div>
  );
};
