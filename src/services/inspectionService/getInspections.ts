
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Inspection } from "./types";

export async function getCompanyInspections(companyId: string): Promise<Inspection[]> {
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

    // Transform data to match our Inspection interface with proper type casting
    const inspections: Inspection[] = data.map(item => {
      const inspection: Inspection = {
        id: item.id,
        address: item.address,
        date: item.date,
        time: item.time,
        status: item.status as "agendada" | "atrasada" | "em_andamento" | "concluida",
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
}

export async function getInspectorInspections(inspectorId: string): Promise<Inspection[]> {
  try {
    const { data, error } = await supabase
      .from("inspections")
      .select("*")
      .eq("inspector_id", inspectorId);

    if (error) throw error;

    return data.map(item => ({
      ...item,
      status: item.status as "agendada" | "atrasada" | "em_andamento" | "concluida"
    })) as Inspection[];
  } catch (error: any) {
    console.error("Error fetching inspector inspections:", error.message);
    toast.error(`Erro ao buscar vistorias: ${error.message}`);
    return [];
  }
}

export async function getInspectionById(id: string): Promise<Inspection | null> {
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
      status: data.status as "agendada" | "atrasada" | "em_andamento" | "concluida",
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
}
