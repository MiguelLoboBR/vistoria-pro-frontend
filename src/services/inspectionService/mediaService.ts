
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InspectionMedia } from "./types";

export async function getMediasByItemId(itemId: string): Promise<InspectionMedia[]> {
  try {
    const { data, error } = await supabase
      .from("inspection_medias")
      .select("*")
      .eq("item_id", itemId);

    if (error) throw error;

    return data as InspectionMedia[];
  } catch (error: any) {
    console.error("Error fetching media files:", error.message);
    toast.error(`Erro ao buscar arquivos de mídia: ${error.message}`);
    return [];
  }
}

export async function createMedia(media: Omit<InspectionMedia, "id" | "created_at">): Promise<InspectionMedia | null> {
  try {
    const { data, error } = await supabase
      .from("inspection_medias")
      .insert(media)
      .select("*")
      .single();

    if (error) throw error;
    
    return data as InspectionMedia;
  } catch (error: any) {
    console.error("Error creating media file:", error.message);
    toast.error(`Erro ao criar arquivo de mídia: ${error.message}`);
    return null;
  }
}

export async function uploadMedia(file: File, path: string): Promise<string | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { error } = await supabase.storage
      .from('inspection-medias')
      .upload(filePath, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from('inspection-medias')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  } catch (error: any) {
    console.error("Error uploading media file:", error.message);
    toast.error(`Erro ao fazer upload do arquivo: ${error.message}`);
    return null;
  }
}

export async function deleteMedia(id: string): Promise<boolean> {
  try {
    // First get the media to find the file path
    const { data: media, error: fetchError } = await supabase
      .from("inspection_medias")
      .select("url")
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    // Extract storage path from URL if it exists
    if (media?.url) {
      try {
        const url = new URL(media.url);
        const pathParts = url.pathname.split('/');
        const storageFilePath = pathParts[pathParts.length - 2] + '/' + pathParts[pathParts.length - 1];
        
        // Delete from storage
        await supabase.storage
          .from('inspection-medias')
          .remove([storageFilePath]);
      } catch (storageError) {
        console.error("Error removing file from storage:", storageError);
        // Continue with database deletion even if storage deletion fails
      }
    }

    // Delete database record
    const { error } = await supabase
      .from("inspection_medias")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error deleting media:", error.message);
    toast.error(`Erro ao remover arquivo de mídia: ${error.message}`);
    return false;
  }
}
