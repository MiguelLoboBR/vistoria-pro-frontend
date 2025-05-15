
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Inspection } from "./types";

export async function updateInspection(id: string, updates: Partial<Inspection>): Promise<boolean> {
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
}
