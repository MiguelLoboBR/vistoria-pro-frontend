
import { useState, useEffect } from "react";
import { inspectionService, InspectionStats } from "@/services/inspectionService";
import { useAuth } from "@/contexts/AuthContext";

export interface VistoriaStats extends InspectionStats {}

export const useVistoriaStats = () => {
  const [stats, setStats] = useState<VistoriaStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { company } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!company) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const statsData = await inspectionService.getCompanyStats(company.id);
        setStats(statsData);
      } catch (error) {
        console.error("Error fetching vistoria stats:", error);
        setStats({
          total: 0,
          agendada: 0,
          atrasada: 0,
          emAndamento: 0,
          concluida: 0
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [company]);

  return {
    stats,
    isLoading,
    refreshStats: () => {
      if (company) {
        inspectionService.getCompanyStats(company.id).then(setStats);
      }
    }
  };
};
