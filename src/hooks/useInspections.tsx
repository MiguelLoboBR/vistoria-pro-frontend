
import { useState, useEffect } from "react";
import { inspectionService, Inspection } from "@/services/inspectionService";
import { useAuth } from "@/contexts/AuthContext";

export const useInspections = () => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchInspections = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const data = await inspectionService.getInspectorInspections(user.id);
        setInspections(data);
      } catch (error) {
        console.error("Error fetching inspections:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInspections();
  }, [user]);
  
  // Group inspections by status
  const pendingInspections = inspections.filter(i => i.status === "agendada" || i.status === "atrasada");
  const inProgressInspections = inspections.filter(i => i.status === "em_andamento");
  const completedInspections = inspections.filter(i => i.status === "concluida").slice(0, 3); // Only show 3 most recent completed
  
  return {
    inspections,
    pendingInspections,
    inProgressInspections,
    completedInspections,
    isLoading
  };
};
