
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Inspection, inspectionService } from "@/services/inspectionService";
import { useAuth } from "@/contexts/AuthContext";

export function useVistorias() {
  const [vistorias, setVistorias] = useState<Inspection[]>([]);
  const [filteredVistorias, setFilteredVistorias] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { company } = useAuth();

  useEffect(() => {
    const fetchVistorias = async () => {
      if (!company) {
        toast.error("Você precisa estar vinculado a uma empresa");
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const data = await inspectionService.getCompanyInspections(company.id);
        setVistorias(data);
        setFilteredVistorias(data);
      } catch (error) {
        console.error("Erro ao buscar vistorias:", error);
        toast.error("Erro ao carregar vistorias");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVistorias();
  }, [company]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVistorias(vistorias);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = vistorias.filter((vistoria) => 
      vistoria.address.toLowerCase().includes(query) ||
      vistoria.id.toLowerCase().includes(query) ||
      vistoria.type.toLowerCase().includes(query) ||
      (vistoria.inspector_name && vistoria.inspector_name.toLowerCase().includes(query))
    );
    setFilteredVistorias(filtered);
  }, [searchQuery, vistorias]);

  return {
    vistorias,
    filteredVistorias,
    isLoading,
    searchQuery,
    setSearchQuery,
    setVistorias,
    setFilteredVistorias
  };
}
