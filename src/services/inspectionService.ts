
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Inspection {
  id: string;
  address: string;
  date: string;
  time: string;
  status: "pending" | "in_progress" | "completed";
  inspector_id: string;
  inspector_name?: string;
  type: string;
  company_id: string;
  created_at: string;
}

export const inspectionService = {
  async createInspection(inspectionData: Omit<Inspection, "id" | "created_at">): Promise<Inspection | null> {
    try {
      const { data, error } = await supabase
        .from("inspections")
        .insert(inspectionData)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as Inspection;
    } catch (error: any) {
      toast.error(`Erro ao criar vistoria: ${error.message}`);
      return null;
    }
  },
  
  async getCompanyInspections(companyId: string): Promise<Inspection[]> {
    try {
      const { data, error } = await supabase
        .from("inspections")
        .select(`
          *,
          profiles:inspector_id (full_name)
        `)
        .eq("company_id", companyId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Transform the results to match our interface
      return (data || []).map(item => ({
        ...item,
        inspector_name: item.profiles ? item.profiles.full_name : 'Não atribuído'
      }));
    } catch (error: any) {
      toast.error(`Erro ao buscar vistorias: ${error.message}`);
      return [];
    }
  },
  
  async getInspectorInspections(inspectorId: string): Promise<Inspection[]> {
    try {
      const { data, error } = await supabase
        .from("inspections")
        .select("*")
        .eq("inspector_id", inspectorId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      return data as Inspection[];
    } catch (error: any) {
      toast.error(`Erro ao buscar vistorias: ${error.message}`);
      return [];
    }
  },
  
  async getInspectionById(id: string): Promise<Inspection | null> {
    try {
      const { data, error } = await supabase
        .from("inspections")
        .select(`
          *,
          profiles:inspector_id (full_name)
        `)
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!data) return null;
      
      return {
        ...data,
        inspector_name: data.profiles ? data.profiles.full_name : 'Não atribuído'
      };
    } catch (error: any) {
      toast.error(`Erro ao buscar vistoria: ${error.message}`);
      return null;
    }
  },
  
  async updateInspection(id: string, updates: Partial<Inspection>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("inspections")
        .update(updates)
        .eq("id", id);
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      toast.error(`Erro ao atualizar vistoria: ${error.message}`);
      return false;
    }
  },
  
  async deleteInspection(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("inspections")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
      
      return true;
    } catch (error: any) {
      toast.error(`Erro ao excluir vistoria: ${error.message}`);
      return false;
    }
  },
  
  async getCompanyStats(companyId: string) {
    try {
      const { data: inspections, error } = await supabase
        .from("inspections")
        .select("status")
        .eq("company_id", companyId);
      
      if (error) throw error;
      
      const total = inspections?.length || 0;
      const completed = inspections?.filter(i => i.status === "completed").length || 0;
      const pending = inspections?.filter(i => i.status === "pending").length || 0;
      const inProgress = inspections?.filter(i => i.status === "in_progress").length || 0;
      
      return {
        total,
        completed,
        pending,
        inProgress
      };
    } catch (error: any) {
      console.error("Error fetching company stats:", error);
      return {
        total: 0,
        completed: 0,
        pending: 0,
        inProgress: 0
      };
    }
  }
};
