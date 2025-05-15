
import { useState } from "react";
import { toast } from "sonner";
import { inspectionService } from "@/services/inspectionService";
import { offlineService } from "@/services/offline";
import { InspectionRoom } from "@/services/inspectionService/types";

export const useRoomActions = (
  setRooms: React.Dispatch<React.SetStateAction<InspectionRoom[]>>,
) => {
  // Handle room name change
  const handleRoomNameChange = async (roomId: string, name: string) => {
    try {
      if (offlineService.isOnline()) {
        await inspectionService.updateRoom(roomId, { name });
      }
      
      // Update local data
      await offlineService.saveRoomLocally({ id: roomId, name } as InspectionRoom, offlineService.isOnline());
      
      // Update UI
      setRooms(prevRooms => 
        prevRooms.map(room => 
          room.id === roomId ? { ...room, name } : room
        )
      );
    } catch (error) {
      console.error("Error updating room name:", error);
      toast.error("Erro ao atualizar nome do ambiente");
    }
  };
  
  // Handle room deletion
  const handleRoomDelete = async (roomId: string) => {
    try {
      if (offlineService.isOnline()) {
        await inspectionService.deleteRoom(roomId);
      }
      
      // Update UI immediately
      setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
      
      // If offline, add to delete queue
      if (!offlineService.isOnline()) {
        // This would be handled in the offlineService
      }
    } catch (error) {
      console.error("Error deleting room:", error);
      toast.error("Erro ao excluir ambiente");
    }
  };
  
  // Handle adding new room
  const handleAddRoom = async (inspectionId: string, rooms: InspectionRoom[]) => {
    if (!inspectionId) return;
    
    try {
      const newRoomBase = {
        name: "Novo Ambiente",
        inspection_id: inspectionId,
        order_index: rooms.length
      };
      
      let roomId: string;
      
      if (offlineService.isOnline()) {
        // Online mode - create room on server
        const createdRoom = await inspectionService.createRoom(newRoomBase as Omit<InspectionRoom, "id" | "created_at">);
        if (!createdRoom) {
          toast.error("Erro ao criar ambiente");
          return;
        }
        roomId = createdRoom.id;
        
        // Create default items for the new room
        const defaultItems = [
          { label: "Paredes", room_id: roomId, state: null, observation: null, transcription: null },
          { label: "Piso", room_id: roomId, state: null, observation: null, transcription: null },
          { label: "Teto", room_id: roomId, state: null, observation: null, transcription: null },
        ];
        
        await Promise.all(defaultItems.map(item => 
          inspectionService.createItem(item as any)
        ));
        
        // Get the room with items
        const roomWithItems = await inspectionService.getRoomWithItems(roomId);
        if (roomWithItems) {
          // Save room locally for offline access
          await offlineService.saveRoomLocally(roomWithItems, true);
          
          // Save items locally
          if (roomWithItems.items) {
            for (const item of roomWithItems.items) {
              await offlineService.saveItemLocally(item, true);
            }
          }
          
          setRooms(prevRooms => [...prevRooms, roomWithItems]);
        }
      } else {
        // Offline mode - save locally
        roomId = await offlineService.saveRoomLocally(newRoomBase as InspectionRoom);
        
        // Create default items locally
        const defaultItems = [
          { label: "Paredes", room_id: roomId, state: null, observation: null, transcription: null },
          { label: "Piso", room_id: roomId, state: null, observation: null, transcription: null },
          { label: "Teto", room_id: roomId, state: null, observation: null, transcription: null },
        ];
        
        const createdItems = [];
        for (const item of defaultItems) {
          const itemId = await offlineService.saveItemLocally(item as any);
          createdItems.push({ ...item, id: itemId, created_at: new Date().toISOString() });
        }
        
        // Add room to UI
        const newRoomWithItems: InspectionRoom = {
          ...newRoomBase,
          id: roomId,
          items: createdItems,
          created_at: new Date().toISOString()
        };
        
        setRooms(prevRooms => [...prevRooms, newRoomWithItems]);
        
        toast.info("Ambiente criado localmente. Será sincronizado quando houver conexão.");
      }
    } catch (error) {
      console.error("Error adding room:", error);
      toast.error("Erro ao adicionar ambiente");
    }
  };

  return {
    handleRoomNameChange,
    handleRoomDelete,
    handleAddRoom,
  };
};
