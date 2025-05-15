
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { inspectionService, Inspection } from "@/services/inspectionService";
import { useAuth } from "@/contexts/AuthContext";

export const useInspections = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchInspections = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await inspectionService.getInspectorInspections(user.id);
        setInspections(data);
      } catch (error) {
        console.error("Erro ao buscar vistorias:", error);
        toast.error("Não foi possível carregar suas vistorias");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInspections();
  }, [user]);
  
  // Agrupar vistorias por status
  const pendingInspections = inspections.filter(i => i.status === "agendada" || i.status === "atrasada");
  const inProgressInspections = inspections.filter(i => i.status === "em_andamento");
  const completedInspections = inspections.filter(i => i.status === "concluida");
  const recentCompletedInspections = completedInspections.slice(0, 3); // Apenas as 3 mais recentes concluídas
  
  return {
    inspections,
    pendingInspections,
    inProgressInspections,
    completedInspections,
    recentCompletedInspections,
    isLoading,
    refetch: () => {
      if (user) {
        setIsLoading(true);
        inspectionService.getInspectorInspections(user.id)
          .then(data => {
            setInspections(data);
            setIsLoading(false);
          })
          .catch(error => {
            console.error("Erro ao atualizar vistorias:", error);
            setIsLoading(false);
          });
      }
    }
  };
};
