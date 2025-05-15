
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function deleteInspection(id: string): Promise<boolean> {
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
}
