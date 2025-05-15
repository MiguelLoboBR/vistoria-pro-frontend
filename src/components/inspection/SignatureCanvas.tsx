
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Save, Undo } from "lucide-react";
import { toast } from "sonner";
import { inspectionService } from "@/services/inspectionService";

interface SignatureCanvasProps {
  inspectionId: string;
  signer: "vistoriador" | "responsavel";
  title: string;
  description: string;
  onClose: () => void;
  onSignatureAdded: (signatureData: string) => void;
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
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [paths, setPaths] = useState<{ x: number; y: number }[][]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      const context = canvas.getContext("2d");
      if (context) {
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.lineJoin = "round";
        context.lineCap = "round";
        context.lineWidth = 2;
        context.strokeStyle = "black";
      }
    }
    
    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const oldWidth = canvas.width;
        const oldHeight = canvas.height;
        
        // Save the current drawing
        const context = canvas.getContext("2d");
        const imageData = context?.getImageData(0, 0, oldWidth, oldHeight);
        
        // Resize canvas
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        
        // Restore the drawing
        if (context && imageData) {
          context.putImageData(imageData, 0, 0);
        }
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getMousePos = (
    canvas: HTMLCanvasElement,
    evt: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const rect = canvas.getBoundingClientRect();
    
    if ("touches" in evt) {
      return {
        x: evt.touches[0].clientX - rect.left,
        y: evt.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
      };
    }
  };

  const handlePointerDown = (
    evt: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!canvasRef.current) return;
    
    setIsDrawing(true);
    const pos = getMousePos(canvasRef.current, evt);
    setPoints([pos]);
  };

  const handlePointerMove = (
    evt: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const pos = getMousePos(canvas, evt);
    setPoints((prev) => [...prev, pos]);
    
    const context = canvas.getContext("2d");
    if (context && points.length > 0) {
      context.beginPath();
      context.moveTo(points[points.length - 1].x, points[points.length - 1].y);
      context.lineTo(pos.x, pos.y);
      context.stroke();
    }
  };

  const handlePointerUp = () => {
    if (points.length > 0) {
      setPaths((prev) => [...prev, points]);
    }
    setPoints([]);
    setIsDrawing(false);
  };

  const handleClear = () => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      setPaths([]);
      setPoints([]);
    }
  };

  const handleUndo = () => {
    if (!canvasRef.current || paths.length === 0) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (context) {
      // Remove the last path
      setPaths((prev) => prev.slice(0, -1));
      
      // Clear canvas
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Redraw remaining paths
      const newPaths = paths.slice(0, -1);
      newPaths.forEach((path) => {
        if (path.length < 2) return;
        
        context.beginPath();
        context.moveTo(path[0].x, path[0].y);
        
        for (let i = 1; i < path.length; i++) {
          context.lineTo(path[i].x, path[i].y);
        }
        
        context.stroke();
      });
    }
  };

  const handleSave = async () => {
    if (!canvasRef.current) return;
    
    // Check if signature is empty
    if (paths.length === 0) {
      toast.error("Por favor, assine antes de salvar");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const canvas = canvasRef.current;
      const signatureData = canvas.toDataURL("image/png");
      
      // Save to database
      await inspectionService.createSignature({
        inspection_id: inspectionId,
        signer,
        signature_data: signatureData
      });
      
      // Update parent component
      onSignatureAdded(signatureData);
      
      toast.success("Assinatura salva com sucesso!");
      handleClose();
    } catch (error) {
      console.error("Error saving signature:", error);
      toast.error("Erro ao salvar assinatura");
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="px-4 py-2">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="relative">
          <div
            ref={containerRef}
            className="w-full bg-white border-t border-b h-[300px] relative"
          >
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 cursor-crosshair"
              onMouseDown={handlePointerDown}
              onMouseMove={handlePointerMove}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchMove={handlePointerMove}
              onTouchEnd={handlePointerUp}
            ></canvas>
          </div>

          {/* Controls */}
          <div className="p-4 flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleClear}>
                <X className="h-4 w-4 mr-1" />
                Limpar
              </Button>
              <Button variant="outline" size="sm" onClick={handleUndo}>
                <Undo className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                "Salvando..."
              ) : (
                <>
                  <Save className="mr-1 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
