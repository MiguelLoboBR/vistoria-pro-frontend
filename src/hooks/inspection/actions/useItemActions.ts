
import { useState } from "react";
import { toast } from "sonner";
import { inspectionService } from "@/services/inspectionService";
import { offlineService } from "@/services/offline";
import { InspectionRoom, InspectionItem } from "@/services/inspectionService/types";

export const useItemActions = (
  setRooms: React.Dispatch<React.SetStateAction<InspectionRoom[]>>,
) => {
  // Handle adding new item to room
  const handleAddItem = async (roomId: string) => {
    try {
      const newItem = {
        label: "Novo Item",
        room_id: roomId,
        state: null,
        observation: null,
        transcription: null
      };
      
      let itemId: string;
      
      if (offlineService.isOnline()) {
        // Online mode - create item on server
        const createdItem = await inspectionService.createItem(newItem as Omit<InspectionItem, "id" | "created_at">);
        if (!createdItem) {
          toast.error("Erro ao adicionar item");
          return;
        }
        
        itemId = createdItem.id;
        
        // Save item locally for offline access
        await offlineService.saveItemLocally(createdItem, true);
      } else {
        // Offline mode - save locally
        itemId = await offlineService.saveItemLocally(newItem as InspectionItem);
        toast.info("Item criado localmente. Será sincronizado quando houver conexão.");
      }
      
      // Update UI
      setRooms(prevRooms => 
        prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              items: [...(room.items || []), { ...newItem, id: itemId, created_at: new Date().toISOString() } as InspectionItem]
            };
          }
          return room;
        })
      );
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Erro ao adicionar item");
    }
  };
  
  // Handle updating item
  const handleItemUpdate = async (roomId: string, itemId: string, updates: Partial<InspectionItem>) => {
    try {
      if (offlineService.isOnline()) {
        // Online mode - update item on server
        await inspectionService.updateItem(itemId, updates);
      }
      
      // Update local data
      await offlineService.saveItemLocally({ id: itemId, ...updates } as InspectionItem, offlineService.isOnline());
      
      // Update UI
      setRooms(prevRooms => 
        prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              items: room.items?.map(item => 
                item.id === itemId ? { ...item, ...updates } : item
              )
            };
          }
          return room;
        })
      );
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Erro ao atualizar item");
    }
  };
  
  // Handle item deletion
  const handleItemDelete = async (roomId: string, itemId: string) => {
    try {
      if (offlineService.isOnline()) {
        // Online mode - delete item on server
        await inspectionService.deleteItem(itemId);
      }
      
      // Update UI immediately
      setRooms(prevRooms => 
        prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              items: room.items?.filter(item => item.id !== itemId)
            };
          }
          return room;
        })
      );
      
      // If offline, add to delete queue
      if (!offlineService.isOnline()) {
        // This would be handled in the offlineService
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Erro ao excluir item");
    }
  };

  return {
    handleAddItem,
    handleItemUpdate,
    handleItemDelete,
  };
};
