
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { inspectionService } from "@/services/inspectionService";
import { offlineService } from "@/services/offline";
import { Inspection, InspectionRoom, InspectionItem } from "@/services/inspectionService/types";

export const useInspectionActions = (
  inspection: Inspection | null,
  rooms: InspectionRoom[],
  setRooms: React.Dispatch<React.SetStateAction<InspectionRoom[]>>,
  inspectorSignature: string | null
) => {
  const navigate = useNavigate();
  
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
  const handleAddRoom = async () => {
    if (!inspection) return;
    
    try {
      const newRoomBase = {
        name: "Novo Ambiente",
        inspection_id: inspection.id,
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
          { label: "Paredes", room_id: roomId, state: null, observation: null, transcription: null } as Partial<InspectionItem>,
          { label: "Piso", room_id: roomId, state: null, observation: null, transcription: null } as Partial<InspectionItem>,
          { label: "Teto", room_id: roomId, state: null, observation: null, transcription: null } as Partial<InspectionItem>,
        ];
        
        await Promise.all(defaultItems.map(item => 
          inspectionService.createItem(item as Omit<InspectionItem, "id" | "created_at">)
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
          { label: "Paredes", room_id: roomId, state: null, observation: null, transcription: null } as Partial<InspectionItem>,
          { label: "Piso", room_id: roomId, state: null, observation: null, transcription: null } as Partial<InspectionItem>,
          { label: "Teto", room_id: roomId, state: null, observation: null, transcription: null } as Partial<InspectionItem>,
        ];
        
        const createdItems = [];
        for (const item of defaultItems) {
          const itemId = await offlineService.saveItemLocally(item as InspectionItem);
          createdItems.push({ ...item, id: itemId, created_at: new Date().toISOString() } as InspectionItem);
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
  
  // Handle save progress
  const handleSaveProgress = async () => {
    if (!inspection) return;
    
    // Trigger sync if online
    if (offlineService.isOnline()) {
      try {
        await offlineService.processSyncQueue();
        toast.success("Vistoria salva com sucesso!");
      } catch (error) {
        console.error("Error syncing data:", error);
        toast.error("Erro ao sincronizar dados");
      }
    } else {
      toast.success("Dados salvos localmente. Serão sincronizados quando houver conexão.");
    }
  };
  
  // Handle complete inspection
  const handleCompleteInspection = async () => {
    if (!inspection) return;
    
    if (!inspectorSignature) {
      toast.error("A assinatura do vistoriador é obrigatória para finalizar a vistoria");
      return;
    }
    
    // Check if online
    if (!offlineService.isOnline()) {
      toast.error("É necessário estar online para finalizar a vistoria");
      return;
    }
    
    try {
      // Sync all pending changes first
      await offlineService.processSyncQueue();
      
      // Update inspection status
      await inspectionService.updateInspection(inspection.id, {
        status: "concluida",
      });
      
      toast.success("Vistoria finalizada com sucesso!");
      navigate("/app/inspector/dashboard");
    } catch (error) {
      console.error("Error completing inspection:", error);
      toast.error("Erro ao finalizar vistoria");
    }
  };

  return {
    handleRoomNameChange,
    handleRoomDelete,
    handleAddRoom,
    handleAddItem,
    handleItemUpdate,
    handleItemDelete,
    handleSaveProgress,
    handleCompleteInspection,
  };
};
