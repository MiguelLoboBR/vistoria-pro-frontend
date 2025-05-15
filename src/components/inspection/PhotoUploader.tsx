
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera, X, Save, Undo, Redo, Download } from "lucide-react";
import { toast } from "sonner";
import { inspectionService } from "@/services/inspectionService";
import { fabric } from "fabric";

interface PhotoUploaderProps {
  itemId: string;
  onClose: () => void;
}

export function PhotoUploader({ itemId, onClose }: PhotoUploaderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCaptureMode, setIsCaptureMode] = useState(true);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [geolocation, setGeolocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);

  // Initialize camera when component mounts
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Get geolocation
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Não foi possível obter localização");
        }
      );
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Não foi possível acessar a câmera");
      handleClose();
    }
  };

  // Initialize fabric.js canvas for editing
  const initializeFabricCanvas = () => {
    if (canvasRef.current && capturedImage) {
      const canvas = new fabric.Canvas(canvasRef.current);
      fabricCanvasRef.current = canvas;

      // Load captured image
      fabric.Image.fromURL(capturedImage, (img) => {
        canvas.setWidth(img.width as number);
        canvas.setHeight(img.height as number);
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));
      });

      // Add drawing capability
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = 3;
      canvas.freeDrawingBrush.color = "#ff0000";
    }
  };

  // Cleanup function
  const cleanup = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }

    setIsOpen(false);
    onClose();
  };

  const handleClose = () => {
    cleanup();
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg");
        setCapturedImage(imageData);
        setIsCaptureMode(false);

        // Stop camera stream
        if (video.srcObject) {
          const stream = video.srcObject as MediaStream;
          stream.getTracks().forEach((track) => track.stop());
        }

        // Initialize fabric.js canvas after setting image
        setTimeout(initializeFabricCanvas, 100);
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setIsCaptureMode(true);
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }
    initializeCamera();
  };

  const handleSave = async () => {
    if (!capturedImage) return;

    setIsUploading(true);
    try {
      // Convert canvas to Blob
      const dataUrl = fabricCanvasRef.current 
        ? fabricCanvasRef.current.toDataURL({ format: 'jpeg', quality: 0.8 })
        : capturedImage;
        
      // Convert data URL to Blob
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "photo.jpg", { type: "image/jpeg" });

      // Upload to Supabase
      const url = await inspectionService.uploadMedia(file, `inspection-photos/${itemId}`);

      if (url) {
        // Create media record in database
        await inspectionService.createMedia({
          item_id: itemId,
          type: "foto",
          url,
          latitude: geolocation.latitude,
          longitude: geolocation.longitude,
          timestamp: new Date().toISOString()
        });

        toast.success("Foto salva com sucesso!");
        handleClose();
      } else {
        throw new Error("Erro ao enviar arquivo");
      }
    } catch (error) {
      console.error("Error saving photo:", error);
      toast.error("Erro ao salvar foto");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUndo = () => {
    if (fabricCanvasRef.current) {
      if (fabricCanvasRef.current._objects.length > 0) {
        const objects = fabricCanvasRef.current._objects;
        fabricCanvasRef.current.remove(objects[objects.length - 1]);
      }
    }
  };

  const handleRedo = () => {
    // Simplified redo functionality (not fully implemented)
    toast.info("Funcionalidade não disponível");
  };

  // Register event listener for dialog open
  const onOpenChange = (open: boolean) => {
    if (open && isCaptureMode) {
      initializeCamera();
    } else if (!open) {
      handleClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
        <DialogHeader className="px-4 py-2">
          <DialogTitle>
            {isCaptureMode ? "Capturar Foto" : "Editar Foto"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          {isCaptureMode ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-[60vh] bg-black object-cover"
            />
          ) : (
            <div className="w-full overflow-auto bg-gray-800 relative">
              <canvas
                ref={canvasRef}
                className="mx-auto max-h-[60vh]"
              />
            </div>
          )}

          {/* Controls */}
          <div className="p-4 flex justify-between">
            {isCaptureMode ? (
              <>
                <Button variant="ghost" onClick={handleClose}>
                  <X className="mr-1 h-4 w-4" />
                  Cancelar
                </Button>

                <Button onClick={handleCapture}>
                  <Camera className="mr-1 h-4 w-4" />
                  Capturar
                </Button>
              </>
            ) : (
              <>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRetake}
                  >
                    <Camera className="mr-1 h-4 w-4" />
                    Nova Foto
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleUndo}>
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRedo}>
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Save className="mr-1 h-4 w-4" />
                      Salvar
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
