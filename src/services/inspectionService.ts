
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Inspection {
  id: string;
  address: string;
  date: string;
  time: string | null;
  status: "agendada" | "atrasada" | "em_andamento" | "concluida";
  inspector_id: string | null;
  inspector_name?: string;
  type: string;
  company_id: string;
  created_at: string;
  updated_at?: string;
}

export const inspectionService = {
  async createInspection(inspectionData: Omit<Inspection, "id" | "created_at" | "updated_at">): Promise<Inspection | null> {
    try {
      const { data, error } = await supabase
        .from("inspections")
        .insert(inspectionData)
        .select("*")
        .single();

      if (error) throw error;
      return data as Inspection;
    } catch (error: any) {
      console.error("Error creating inspection:", error.message);
      toast.error(`Erro ao criar vistoria: ${error.message}`);
      return null;
    }
  },
  
  async getCompanyInspections(companyId: string): Promise<Inspection[]> {
    try {
      // Get all inspections for a company with inspector details
      const { data, error } = await supabase
        .from("inspections")
        .select(`
          *,
          profiles:inspector_id (
            full_name
          )
        `)
        .eq("company_id", companyId);

      if (error) throw error;

      // Transform data to match our Inspection interface
      const inspections: Inspection[] = data.map(item => {
        const inspection = {
          id: item.id,
          address: item.address,
          date: item.date,
          time: item.time,
          status: item.status,
          inspector_id: item.inspector_id,
          inspector_name: item.profiles?.full_name || null,
          type: item.type,
          company_id: item.company_id,
          created_at: item.created_at
        };
        return inspection;
      });

      return inspections;
    } catch (error: any) {
      console.error("Error fetching company inspections:", error.message);
      toast.error(`Erro ao buscar vistorias: ${error.message}`);
      return [];
    }
  },
  
  async getInspectorInspections(inspectorId: string): Promise<Inspection[]> {
    try {
      const { data, error } = await supabase
        .from("inspections")
        .select("*")
        .eq("inspector_id", inspectorId);

      if (error) throw error;

      return data as Inspection[];
    } catch (error: any) {
      console.error("Error fetching inspector inspections:", error.message);
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
          profiles:inspector_id (
            full_name
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      
      const inspection: Inspection = {
        id: data.id,
        address: data.address,
        date: data.date,
        time: data.time,
        status: data.status,
        inspector_id: data.inspector_id,
        inspector_name: data.profiles?.full_name || null,
        type: data.type,
        company_id: data.company_id,
        created_at: data.created_at
      };

      return inspection;
    } catch (error: any) {
      console.error("Error fetching inspection:", error.message);
      toast.error(`Erro ao buscar detalhes da vistoria: ${error.message}`);
      return null;
    }
  },
  
  async updateInspection(id: string, updates: Partial<Inspection>): Promise<boolean> {
    try {
      // Remove any fields that shouldn't be updated directly
      const { inspector_name, ...updateData } = updates;
      
      const { error } = await supabase
        .from("inspections")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
      
      return true;
    } catch (error: any) {
      console.error("Error updating inspection:", error.message);
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
      console.error("Error deleting inspection:", error.message);
      toast.error(`Erro ao excluir vistoria: ${error.message}`);
      return false;
    }
  },
  
  async getCompanyStats(companyId: string) {
    try {
      const { data, error } = await supabase
        .from("inspections")
        .select("status")
        .eq("company_id", companyId);

      if (error) throw error;

      const total = data.length;
      const agendada = data.filter(i => i.status === 'agendada').length;
      const atrasada = data.filter(i => i.status === 'atrasada').length;
      const emAndamento = data.filter(i => i.status === 'em_andamento').length;
      const concluida = data.filter(i => i.status === 'concluida').length;

      return {
        total,
        agendada,
        atrasada,
        emAndamento,
        concluida
      };
    } catch (error: any) {
      console.error("Error fetching company stats:", error.message);
      return {
        total: 0,
        agendada: 0,
        atrasada: 0,
        emAndamento: 0,
        concluida: 0
      };
    }
  }
};
