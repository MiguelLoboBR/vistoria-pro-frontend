
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Inspection, InspectionRoom } from '@/services/inspectionService/types';

export interface ReportGeneratorProps {
  inspection: Inspection;
  rooms: InspectionRoom[];
  inspectorSignature: string;
  responsibleSignature: string;
  responsibleName: string;
}

export const ReportGenerator = ({ 
  inspection, 
  rooms, 
  inspectorSignature, 
  responsibleSignature,
  responsibleName 
}: ReportGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Implement report generation logic
      console.log("Generating report with data:", { 
        inspection, 
        rooms, 
        inspectorSignature, 
        responsibleSignature,
        responsibleName 
      });
      
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log("Report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Button 
      onClick={handleGenerateReport} 
      className="w-full" 
      disabled={isGenerating}
    >
      {isGenerating ? "Gerando..." : "Gerar Relatório"}
    </Button>
  );
};
