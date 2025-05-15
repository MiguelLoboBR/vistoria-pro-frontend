
import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Mic,
  Trash2,
  Camera,
  Video,
  Image,
} from "lucide-react";
import { InspectionItem } from "@/services/inspectionService/types";
import { toast } from "sonner";
import { PhotoUploader } from "./PhotoUploader";
import { VideoUploader } from "./VideoUploader";

interface RoomItemChecklistProps {
  item: InspectionItem;
  onUpdate: (updates: Partial<InspectionItem>) => void;
  onDelete: () => void;
}

export function RoomItemChecklist({
  item,
  onUpdate,
  onDelete,
}: RoomItemChecklistProps) {
  const [isPhotoUploaderOpen, setIsPhotoUploaderOpen] = useState(false);
  const [isVideoUploaderOpen, setIsVideoUploaderOpen] = useState(false);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ label: e.target.value });
  };

  const handleStateChange = (state: string) => {
    const stateValue = state as "ok" | "danificado" | "observacao" | null;
    onUpdate({ state: stateValue });
  };

  const handleObservationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onUpdate({ observation: e.target.value });
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja remover este item?")) {
      onDelete();
      toast.success("Item removido com sucesso");
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      toast.error("Reconhecimento de voz não suportado pelo navegador");
      return;
    }

    // @ts-ignore - Speech recognition is not in the TypeScript types
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;

    toast.info("Fale agora...");

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onUpdate({ 
        observation: item.observation 
          ? `${item.observation} ${transcript}` 
          : transcript,
        transcription: transcript
      });
      toast.success("Texto reconhecido com sucesso!");
    };

    recognition.onerror = () => {
      toast.error("Erro ao reconhecer voz");
    };

    recognition.start();
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="py-3 px-4 bg-gray-50 border-b flex flex-row items-center justify-between">
        <Input
          value={item.label || ""}
          onChange={handleLabelChange}
          className="h-7 text-sm max-w-[200px] font-medium"
          placeholder="Nome do item"
        />
        
        <div className="flex gap-1">
          <Select
            value={item.state || ""}
            onValueChange={handleStateChange}
          >
            <SelectTrigger className="h-7 w-24 text-xs">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ok" className="text-green-600 flex items-center">
                <CheckCircle className="h-3 w-3 mr-1" />
                OK
              </SelectItem>
              <SelectItem value="observacao" className="text-amber-600 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                Observação
              </SelectItem>
              <SelectItem value="danificado" className="text-red-600 flex items-center">
                <XCircle className="h-3 w-3 mr-1" />
                Danificado
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 p-4">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-xs text-gray-500">Observação</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 px-2 py-0 text-xs"
              onClick={handleVoiceInput}
            >
              <Mic className="h-3 w-3 mr-1" />
              Gravar
            </Button>
          </div>
          
          <Textarea
            value={item.observation || ""}
            onChange={handleObservationChange}
            placeholder={
              item.state === "danificado"
                ? "Descreva o dano encontrado..."
                : item.state === "observacao"
                ? "Adicione detalhes sobre o item..."
                : "Observações (opcional)"
            }
            className="text-sm"
            rows={2}
          />
        </div>

        <div className="flex justify-between mt-2">
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => setIsPhotoUploaderOpen(true)}
            >
              <Camera className="h-3 w-3 mr-1" />
              Foto
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => setIsVideoUploaderOpen(true)}
            >
              <Video className="h-3 w-3 mr-1" />
              Vídeo
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs h-7 text-red-500 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Remover
          </Button>
        </div>

        {/* Display attached media count if any */}
        {item.medias && item.medias.length > 0 && (
          <div className="mt-2 pt-2 border-t flex justify-between items-center text-xs text-gray-500">
            <span>
              {item.medias.length} arquivo{item.medias.length !== 1 ? "s" : ""} anexado{item.medias.length !== 1 ? "s" : ""}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 py-0 text-xs"
              onClick={() => {}}
            >
              <Image className="h-3 w-3 mr-1" />
              Visualizar
            </Button>
          </div>
        )}

        {isPhotoUploaderOpen && (
          <PhotoUploader
            itemId={item.id}
            onClose={() => setIsPhotoUploaderOpen(false)}
          />
        )}

        {isVideoUploaderOpen && (
          <VideoUploader
            itemId={item.id}
            onClose={() => setIsVideoUploaderOpen(false)}
          />
        )}
      </CardContent>
    </Card>
  );
}
