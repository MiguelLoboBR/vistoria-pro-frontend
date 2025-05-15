
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { inspectionService } from "@/services/inspectionService";
import { offlineService } from "@/services/offline";
import { Inspection } from "@/services/inspectionService/types";

export const useInspectionFinalization = (
  inspection: Inspection | null,
  inspectorSignature: string | null
) => {
  const navigate = useNavigate();

  // Handle save progress
  const handleSaveProgress = async () => {
    if (!inspection) return;
    
    // Trigger sync if online
    if (offlineService.isOnline()) {
      try {
        await offlineService.processSyncQueue();
        toast.success("Vistoria salva com sucesso!");
      } catch (error) {
        console.error("Error syncing data:", error);
        toast.error("Erro ao sincronizar dados");
      }
    } else {
      toast.success("Dados salvos localmente. Serão sincronizados quando houver conexão.");
    }
  };
  
  // Handle complete inspection
  const handleCompleteInspection = async () => {
    if (!inspection) return;
    
    if (!inspectorSignature) {
      toast.error("A assinatura do vistoriador é obrigatória para finalizar a vistoria");
      return;
    }
    
    // Check if online
    if (!offlineService.isOnline()) {
      toast.error("É necessário estar online para finalizar a vistoria");
      return;
    }
    
    try {
      // Sync all pending changes first
      await offlineService.processSyncQueue();
      
      // Update inspection status
      await inspectionService.updateInspection(inspection.id, {
        status: "concluida",
      });
      
      toast.success("Vistoria finalizada com sucesso!");
      navigate("/app/inspector/dashboard");
    } catch (error) {
      console.error("Error completing inspection:", error);
      toast.error("Erro ao finalizar vistoria");
    }
  };

  return {
    handleSaveProgress,
    handleCompleteInspection,
  };
};
