
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NewInspectionForm, InspectionFormValues } from "./NewInspectionForm";

interface VistoriaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: InspectionFormValues) => Promise<void>;
  inspectors: { id: string, name: string }[];
}

export const VistoriaDialog = ({ open, onOpenChange, onSubmit, inspectors }: VistoriaDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agendar Nova Vistoria</DialogTitle>
          <DialogDescription>
            Preencha os dados para agendar uma nova vistoria.
          </DialogDescription>
        </DialogHeader>
        <NewInspectionForm onSubmit={onSubmit} inspectors={inspectors} />
      </DialogContent>
    </Dialog>
  );
};
