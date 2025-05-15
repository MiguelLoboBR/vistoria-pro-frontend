
import { supabase } from "@/integrations/supabase/client";
import { InspectionStats } from "./types";

export async function getCompanyStats(companyId: string): Promise<InspectionStats> {
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
