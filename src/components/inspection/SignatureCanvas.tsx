
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, Save, X, Trash2 } from "lucide-react";
import { inspectionService } from "@/services/inspectionService";
import { toast } from "sonner";

interface SignatureCanvasProps {
  inspectionId: string;
  signer: "vistoriador" | "responsavel";
  title: string;
  description?: string;
  onClose: () => void;
  onSignatureAdded?: (signatureData: string) => void;
}

export function SignatureCanvas({
  inspectionId,
  signer,
  title,
  description,
  onClose,
  onSignatureAdded,
}: SignatureCanvasProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [existingSignature, setExistingSignature] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    // Check if there's already a signature
    const checkExistingSignature = async () => {
      try {
        const signature = await inspectionService.getSignature(inspectionId, signer);
        if (signature && signature.signature_data) {
          setExistingSignature(signature.signature_data);
        }
      } catch (error) {
        console.error("Error fetching signature:", error);
      }
    };

    checkExistingSignature();
  }, [inspectionId, signer]);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;

      const context = canvas.getContext("2d");
      if (context) {
        context.scale(2, 2);
        context.lineCap = "round";
        context.lineJoin = "round";
        context.strokeStyle = "black";
        context.lineWidth = 2.5;
        contextRef.current = context;
      }
    }
  }, []);

  const startDrawing = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    const { offsetX, offsetY } = getCoordinates(nativeEvent);
    if (contextRef.current) {
      contextRef.current.beginPath();
      contextRef.current.moveTo(offsetX, offsetY);
      setIsSigning(true);
    }
  };

  const draw = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    if (!isSigning) return;

    const { offsetX, offsetY } = getCoordinates(nativeEvent);
    if (contextRef.current) {
      contextRef.current.lineTo(offsetX, offsetY);
      contextRef.current.stroke();
    }
  };

  const stopDrawing = () => {
    if (contextRef.current) {
      contextRef.current.closePath();
      setIsSigning(false);
    }
  };

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    if (canvasRef.current) {
      if ('touches' in event) {
        // Touch event
        const rect = canvasRef.current.getBoundingClientRect();
        const touch = event.touches[0];
        return {
          offsetX: touch.clientX - rect.left,
          offsetY: touch.clientY - rect.top,
        };
      } else {
        // Mouse event
        return {
          offsetX: event.nativeEvent.offsetX,
          offsetY: event.nativeEvent.offsetY,
        };
      }
    }
    return { offsetX: 0, offsetY: 0 };
  };

  const clearCanvas = () => {
    if (canvasRef.current && contextRef.current) {
      contextRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const saveSignature = async () => {
    if (canvasRef.current) {
      if (isCanvasEmpty()) {
        toast.error("Por favor, adicione uma assinatura antes de salvar.");
        return;
      }

      setIsSaving(true);

      try {
        const signatureData = canvasRef.current.toDataURL("image/png");
        
        // Save to database via Supabase
        await inspectionService.createSignature({
          inspection_id: inspectionId,
          signer,
          signature_data: signatureData,
        });

        // Notify parent component
        if (onSignatureAdded) {
          onSignatureAdded(signatureData);
        }

        toast.success("Assinatura salva com sucesso!");
        handleClose();
      } catch (error) {
        console.error("Error saving signature:", error);
        toast.error("Erro ao salvar assinatura");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const isCanvasEmpty = () => {
    if (canvasRef.current && contextRef.current) {
      const pixelData = contextRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      ).data;
      
      // Check if all pixel values are 0 (transparent)
      for (let i = 0; i < pixelData.length; i += 4) {
        if (pixelData[i + 3] !== 0) return false;
      }
    }
    return true;
  };

  const handleDeleteSignature = async () => {
    if (confirm("Tem certeza que deseja excluir esta assinatura?")) {
      try {
        await inspectionService.deleteSignature(inspectionId, signer);
        setExistingSignature(null);
        toast.success("Assinatura excluída com sucesso");
      } catch (error) {
        console.error("Error deleting signature:", error);
        toast.error("Erro ao excluir assinatura");
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {existingSignature ? (
          <div className="space-y-4">
            <div className="border rounded-md h-48 flex items-center justify-center bg-gray-50">
              <img 
                src={existingSignature} 
                alt="Assinatura" 
                className="max-h-full max-w-full" 
              />
            </div>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleDeleteSignature}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
              <Button onClick={handleClose}>
                <Check className="h-4 w-4 mr-2" />
                OK
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="border-2 border-gray-200 border-dashed rounded-md bg-gray-50 relative">
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-48 touch-none"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
                <p className="text-sm text-gray-500">Assine aqui</p>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="space-x-2">
                <Button variant="outline" onClick={clearCanvas}>
                  <X className="h-4 w-4 mr-2" />
                  Limpar
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
              <Button onClick={saveSignature} disabled={isSaving}>
                {isSaving ? (
                  "Salvando..."
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
