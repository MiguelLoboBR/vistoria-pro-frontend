import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Inspection, InspectionRoom } from "@/services/inspectionService/types";

export interface ReportGeneratorProps {
  inspection: Inspection;
  rooms: InspectionRoom[];
  inspectorSignature: string | null;
  responsibleSignature: string | null;
  responsibleName: string;
}

export function ReportGenerator({
  inspection,
  rooms,
  inspectorSignature,
  responsibleSignature,
  responsibleName,
}: ReportGeneratorProps) {
  const handleGenerateReport = async () => {
    // Implementation details for report generation
  };

  return (
    <div className="text-center">
      <Button onClick={handleGenerateReport} className="gap-2">
        <FileText className="h-4 w-4" />
        Gerar Relatório PDF
      </Button>
    </div>
  );
}
