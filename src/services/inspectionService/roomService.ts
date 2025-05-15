
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { InspectionRoom, InspectionItem } from "./types";

export async function getRoomsByInspectionId(inspectionId: string): Promise<InspectionRoom[]> {
  try {
    const { data, error } = await supabase
      .from("inspection_rooms")
      .select("*")
      .eq("inspection_id", inspectionId)
      .order("order_index");

    if (error) throw error;

    return data as InspectionRoom[];
  } catch (error: any) {
    console.error("Error fetching inspection rooms:", error.message);
    toast.error(`Erro ao buscar cômodos: ${error.message}`);
    return [];
  }
}

export async function createRoom(room: Omit<InspectionRoom, "id" | "created_at">): Promise<InspectionRoom | null> {
  try {
    const { data, error } = await supabase
      .from("inspection_rooms")
      .insert(room)
      .select("*")
      .single();

    if (error) throw error;
    
    toast.success("Cômodo adicionado com sucesso");
    return data as InspectionRoom;
  } catch (error: any) {
    console.error("Error creating inspection room:", error.message);
    toast.error(`Erro ao criar cômodo: ${error.message}`);
    return null;
  }
}

export async function updateRoom(id: string, updates: Partial<InspectionRoom>): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("inspection_rooms")
      .update(updates)
      .eq("id", id);

    if (error) throw error;
    
    toast.success("Cômodo atualizado com sucesso");
    return true;
  } catch (error: any) {
    console.error("Error updating inspection room:", error.message);
    toast.error(`Erro ao atualizar cômodo: ${error.message}`);
    return false;
  }
}

export async function deleteRoom(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("inspection_rooms")
      .delete()
      .eq("id", id);

    if (error) throw error;
    
    toast.success("Cômodo removido com sucesso");
    return true;
  } catch (error: any) {
    console.error("Error deleting inspection room:", error.message);
    toast.error(`Erro ao remover cômodo: ${error.message}`);
    return false;
  }
}

export async function getRoomWithItems(roomId: string): Promise<InspectionRoom | null> {
  try {
    // Fetch room data
    const { data: roomData, error: roomError } = await supabase
      .from("inspection_rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (roomError) throw roomError;

    // Fetch items in the room
    const { data: itemsData, error: itemsError } = await supabase
      .from("inspection_items")
      .select("*")
      .eq("room_id", roomId);

    if (itemsError) throw itemsError;

    // Combine data
    const roomWithItems = {
      ...roomData,
      items: itemsData || []
    } as InspectionRoom;

    return roomWithItems;
  } catch (error: any) {
    console.error("Error fetching room with items:", error.message);
    toast.error(`Erro ao buscar detalhes do cômodo: ${error.message}`);
    return null;
  }
}
