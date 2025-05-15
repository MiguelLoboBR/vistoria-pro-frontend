
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";

interface VistoriaActionsProps {
  onOpenDialog: () => void;
}

export const VistoriaActions = ({ onOpenDialog }: VistoriaActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button variant="outline" className="flex gap-2 items-center">
        <Calendar className="h-4 w-4" />
        <span className="hidden sm:inline">Ver Calendário</span>
      </Button>
      
      <Button className="flex gap-2 items-center" onClick={onOpenDialog}>
        <Plus className="h-4 w-4" />
        <span>Nova Vistoria</span>
      </Button>
    </div>
  );
};
