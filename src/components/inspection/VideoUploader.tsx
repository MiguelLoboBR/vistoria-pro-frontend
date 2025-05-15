
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Video, X, Save, Square } from "lucide-react";
import { toast } from "sonner";
import { inspectionService } from "@/services/inspectionService";

interface VideoUploaderProps {
  itemId: string;
  onClose: () => void;
}

export function VideoUploader({ itemId, onClose }: VideoUploaderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [geolocation, setGeolocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Initialize camera when component mounts
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: true,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "video/webm;codecs=vp9",
      });

      // Handle data available event
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      // Handle recording stopped
      mediaRecorderRef.current.onstop = () => {
        const videoBlob = new Blob(chunksRef.current, {
          type: "video/webm",
        });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideo(videoUrl);
        chunksRef.current = [];

        // Stop camera stream
        if (videoRef.current?.srcObject) {
          const camStream = videoRef.current.srcObject as MediaStream;
          camStream.getTracks().forEach((track) => track.stop());
        }
      };

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

  // Cleanup function
  const cleanup = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }

    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }

    setIsOpen(false);
    onClose();
  };

  const handleClose = () => {
    cleanup();
  };

  const handleToggleRecording = () => {
    if (!mediaRecorderRef.current) return;

    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      chunksRef.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Auto-stop after 30 seconds
      setTimeout(() => {
        if (isRecording && mediaRecorderRef.current?.state === "recording") {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
        }
      }, 30000);
    }
  };

  const handleRetake = () => {
    if (recordedVideo) {
      URL.revokeObjectURL(recordedVideo);
    }
    setRecordedVideo(null);
    initializeCamera();
  };

  const handleSave = async () => {
    if (!recordedVideo) return;

    setIsUploading(true);
    try {
      // Convert video URL to Blob
      const response = await fetch(recordedVideo);
      const videoBlob = await response.blob();
      const file = new File([videoBlob], "video.webm", { type: "video/webm" });

      // Upload to Supabase
      const url = await inspectionService.uploadMedia(file, `inspection-videos/${itemId}`);

      if (url) {
        // Create media record in database
        await inspectionService.createMedia({
          item_id: itemId,
          type: "video",
          url,
          latitude: geolocation.latitude,
          longitude: geolocation.longitude,
          timestamp: new Date().toISOString()
        });

        toast.success("Vídeo salvo com sucesso!");
        handleClose();
      } else {
        throw new Error("Erro ao enviar arquivo");
      }
    } catch (error) {
      console.error("Error saving video:", error);
      toast.error("Erro ao salvar vídeo");
    } finally {
      setIsUploading(false);
    }
  };

  // Register event listener for dialog open
  const onOpenChange = (open: boolean) => {
    if (open && !recordedVideo) {
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
            {recordedVideo ? "Revisar Vídeo" : "Gravar Vídeo"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            controls={!!recordedVideo}
            src={recordedVideo || undefined}
            className="w-full h-[60vh] bg-black"
          />

          {isRecording && (
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
              <div className="h-2 w-2 bg-white rounded-full"></div>
              <span className="text-sm">Gravando...</span>
            </div>
          )}

          {/* Controls */}
          <div className="p-4 flex justify-between">
            {recordedVideo ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleRetake}
                >
                  <Video className="mr-1 h-4 w-4" />
                  Novo Vídeo
                </Button>

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
            ) : (
              <>
                <Button variant="ghost" onClick={handleClose}>
                  <X className="mr-1 h-4 w-4" />
                  Cancelar
                </Button>

                <Button
                  onClick={handleToggleRecording}
                  variant={isRecording ? "destructive" : "default"}
                >
                  {isRecording ? (
                    <>
                      <Square className="mr-1 h-4 w-4" />
                      Parar
                    </>
                  ) : (
                    <>
                      <Video className="mr-1 h-4 w-4" />
                      Gravar
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
