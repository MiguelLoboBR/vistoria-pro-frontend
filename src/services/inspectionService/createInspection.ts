
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Inspection } from "./types";

export async function createInspection(
  inspectionData: Omit<Inspection, "id" | "created_at" | "updated_at">
): Promise<Inspection | null> {
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
}
