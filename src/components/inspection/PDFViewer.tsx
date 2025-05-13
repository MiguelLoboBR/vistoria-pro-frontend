
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";

interface PDFViewerProps {
  pdfUrl: string;
  reportTitle: string;
}

export const PDFViewer = ({ pdfUrl, reportTitle }: PDFViewerProps) => {
  // In a real application, this would be a URL to the generated PDF
  // For this mockup, we're just using a stub URL
  
  const handleDownload = () => {
    // In a real application, this would download the PDF directly
    // For now, we'll just open it in a new tab
    window.open(pdfUrl, '_blank');
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          {reportTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 h-64 flex items-center justify-center">
          <iframe
            src={pdfUrl}
            className="w-full h-full"
            title="Relatório de Vistoria"
          />
        </div>
        
        <Button 
          onClick={handleDownload}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          Baixar Relatório
        </Button>
      </CardContent>
    </Card>
  );
};

export default PDFViewer;
