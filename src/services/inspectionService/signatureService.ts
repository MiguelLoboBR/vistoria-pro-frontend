
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InspectionSignature } from "./types";

export async function getSignaturesByInspectionId(inspectionId: string): Promise<InspectionSignature[]> {
  try {
    const { data, error } = await supabase
      .from("inspection_signatures")
      .select("*")
      .eq("inspection_id", inspectionId);

    if (error) throw error;

    return data as InspectionSignature[];
  } catch (error: any) {
    console.error("Error fetching signatures:", error.message);
    toast.error(`Erro ao buscar assinaturas: ${error.message}`);
    return [];
  }
}

export async function createSignature(signature: Omit<InspectionSignature, "id" | "created_at">): Promise<InspectionSignature | null> {
  try {
    // Check if signature already exists for this person and inspection
    const { data: existingSignature } = await supabase
      .from("inspection_signatures")
      .select("*")
      .eq("inspection_id", signature.inspection_id)
      .eq("signer", signature.signer)
      .single();
    
    let result;
    
    if (existingSignature) {
      // Update existing signature
      const { data, error } = await supabase
        .from("inspection_signatures")
        .update({ signature_data: signature.signature_data })
        .eq("id", existingSignature.id)
        .select("*")
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      // Create new signature
      const { data, error } = await supabase
        .from("inspection_signatures")
        .insert(signature)
        .select("*")
        .single();
        
      if (error) throw error;
      result = data;
    }
    
    toast.success("Assinatura salva com sucesso");
    return result as InspectionSignature;
  } catch (error: any) {
    console.error("Error saving signature:", error.message);
    toast.error(`Erro ao salvar assinatura: ${error.message}`);
    return null;
  }
}

export async function getSignature(inspectionId: string, signer: "vistoriador" | "responsavel"): Promise<InspectionSignature | null> {
  try {
    const { data, error } = await supabase
      .from("inspection_signatures")
      .select("*")
      .eq("inspection_id", inspectionId)
      .eq("signer", signer)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is the "not found" error, which we want to handle by returning null
      throw error;
    }

    return data as InspectionSignature || null;
  } catch (error: any) {
    console.error("Error fetching signature:", error.message);
    toast.error(`Erro ao buscar assinatura: ${error.message}`);
    return null;
  }
}
