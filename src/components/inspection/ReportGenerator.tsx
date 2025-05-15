
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Inspection, InspectionRoom } from "@/services/inspectionService/types";

interface ReportGeneratorProps {
  inspection: Inspection;
  rooms: InspectionRoom[];
  inspectorSignature: string | null;
  responsibleSignature: string | null;
}

export function ReportGenerator({
  inspection,
  rooms,
  inspectorSignature,
  responsibleSignature,
}: ReportGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    if (!inspectorSignature) {
      toast.error("A assinatura do vistoriador é obrigatória para gerar o relatório");
      return;
    }

    setIsGenerating(true);

    try {
      // Here we would normally call an API to generate the PDF
      // For now, we'll simulate a delay and then show a dummy PDF
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real application, this would be the URL of the generated PDF
      // For now, we'll use a placeholder PDF viewer
      setPdfUrl("https://flowbite-svelte.com/images/pdf-files/sample.pdf");
      setIsPdfOpen(true);
      toast.success("Relatório gerado com sucesso!");
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error("Erro ao gerar relatório");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (pdfUrl) {
      // Open the PDF in a new tab for download
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <>
      <Button
        onClick={handleGenerateReport}
        disabled={isGenerating || !inspectorSignature}
        className="w-full"
      >
        {isGenerating ? (
          "Gerando relatório..."
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Gerar Relatório PDF
          </>
        )}
      </Button>

      {/* PDF Viewer Dialog */}
      <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
        <DialogContent className="sm:max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>Relatório de Vistoria - {inspection.id}</span>
              <Button size="sm" onClick={handleDownload}>
                <Download className="mr-1 h-4 w-4" />
                Baixar
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="h-full overflow-hidden">
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                className="w-full h-full"
                title="Relatório de Vistoria"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
