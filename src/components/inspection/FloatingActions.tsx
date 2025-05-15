
import { Button } from "@/components/ui/button";
import {
  Plus,
  Save,
  ClipboardCheck,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface FloatingActionsProps {
  progress: number;
  onAddRoom: () => void;
  onSaveProgress: () => void;
  onCompleteInspection: () => void;
}

export function FloatingActions({
  progress,
  onAddRoom,
  onSaveProgress,
  onCompleteInspection,
}: FloatingActionsProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle button */}
      <Button
        size="sm"
        variant="outline"
        className="rounded-full h-10 w-10 absolute bottom-0 right-0 bg-white shadow-lg border border-primary mb-14"
        onClick={toggleCollapse}
      >
        {isCollapsed ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {/* Actions panel */}
      {!isCollapsed && (
        <div className="bg-white rounded-lg shadow-lg p-4 mb-16 space-y-3">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Buttons */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onAddRoom();
              toast.success("Novo ambiente adicionado");
            }}
          >
            <Plus className="mr-1 h-4 w-4" />
            Adicionar Ambiente
          </Button>

          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              onSaveProgress();
              toast.success("Progresso salvo com sucesso");
            }}
          >
            <Save className="mr-1 h-4 w-4" />
            Salvar Progresso
          </Button>

          <Button
            className="w-full"
            onClick={() => {
              if (progress < 100) {
                if (confirm("Vistoria incompleta. Deseja concluí-la mesmo assim?")) {
                  onCompleteInspection();
                }
              } else {
                onCompleteInspection();
              }
            }}
          >
            <ClipboardCheck className="mr-1 h-4 w-4" />
            Finalizar Vistoria
          </Button>
        </div>
      )}
    </div>
  );
}
