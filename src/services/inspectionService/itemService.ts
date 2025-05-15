
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InspectionItem, InspectionMedia } from "./types";

export async function getItemsByRoomId(roomId: string): Promise<InspectionItem[]> {
  try {
    const { data, error } = await supabase
      .from("inspection_items")
      .select("*")
      .eq("room_id", roomId);

    if (error) throw error;

    return data as InspectionItem[];
  } catch (error: any) {
    console.error("Error fetching inspection items:", error.message);
    toast.error(`Erro ao buscar itens: ${error.message}`);
    return [];
  }
}

export async function createItem(item: Omit<InspectionItem, "id" | "created_at">): Promise<InspectionItem | null> {
  try {
    const { data, error } = await supabase
      .from("inspection_items")
      .insert(item)
      .select("*")
      .single();

    if (error) throw error;
    
    return data as InspectionItem;
  } catch (error: any) {
    console.error("Error creating inspection item:", error.message);
    toast.error(`Erro ao criar item: ${error.message}`);
    return null;
  }
}

export async function updateItem(id: string, updates: Partial<InspectionItem>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("inspection_items")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error updating inspection item:", error.message);
    toast.error(`Erro ao atualizar item: ${error.message}`);
    return false;
  }
}

export async function deleteItem(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("inspection_items")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error("Error deleting inspection item:", error.message);
    toast.error(`Erro ao remover item: ${error.message}`);
    return false;
  }
}

export async function getItemWithMedia(itemId: string): Promise<InspectionItem | null> {
  try {
    // Fetch item data
    const { data: itemData, error: itemError } = await supabase
      .from("inspection_items")
      .select("*")
      .eq("id", itemId)
      .single();

    if (itemError) throw itemError;

    // Fetch media for the item
    const { data: mediaData, error: mediaError } = await supabase
      .from("inspection_medias")
      .select("*")
      .eq("item_id", itemId);

    if (mediaError) throw mediaError;

    // Combine data
    const itemWithMedia = {
      ...itemData,
      medias: mediaData || []
    } as InspectionItem;

    return itemWithMedia;
  } catch (error: any) {
    console.error("Error fetching item with media:", error.message);
    toast.error(`Erro ao buscar detalhes do item: ${error.message}`);
    return null;
  }
}
