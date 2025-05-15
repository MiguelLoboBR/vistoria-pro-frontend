
import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, FilePlus, Plus, Download } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

interface InspectionActionButtonsProps {
  variant?: "default" | "calendar";
  isDialogOpen?: boolean;
  setIsDialogOpen?: (value: boolean) => void;
  onOpenDialog?: () => void;
  showExport?: boolean;
}

export const InspectionActionButtons = ({
  variant = "default",
  isDialogOpen,
  setIsDialogOpen,
  onOpenDialog,
  showExport = false
}: InspectionActionButtonsProps) => {
  // Calendar variant (used in Vistorias.tsx)
  if (variant === "calendar") {
    return (
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" className="flex gap-2 items-center w-full sm:w-auto mb-2 sm:mb-0">
          <Calendar className="h-4 w-4" />
          <span className="sm:inline">Ver Calendário</span>
        </Button>
        
        <Button 
          className="flex gap-2 items-center w-full sm:w-auto" 
          size="sm"
          onClick={onOpenDialog}
        >
          <Plus className="h-4 w-4" />
          <span>Nova Vistoria</span>
        </Button>
      </div>
    );
  }
  
  // Default variant (used in Inspections.tsx)
  return (
    <div className="flex flex-wrap gap-3">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto mb-2 sm:mb-0">
            <FilePlus className="mr-2 h-4 w-4" />
            Nova Vistoria
          </Button>
        </DialogTrigger>
      </Dialog>
      
      {showExport && (
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      )}
    </div>
  );
};

