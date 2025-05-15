
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { inspectionService } from "@/services/inspectionService";
import { offlineService } from "@/services/offline";
import { Inspection, InspectionRoom } from "@/services/inspectionService/types";

/**
 * Hook for loading inspection data, either from server or local cache
 */
export const useInspectionLoading = (id?: string) => {
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [rooms, setRooms] = useState<InspectionRoom[]>([]);
  const [responsibleName, setResponsibleName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Set up online/offline listeners
  useEffect(() => {
    offlineService.initOfflineService();
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load inspection data
  useEffect(() => {
    const loadInspection = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        if (offlineService.isOnline()) {
          // Online mode - load from server
          const inspectionData = await inspectionService.getInspectionById(id);
          if (!inspectionData) {
            toast.error("Vistoria não encontrada");
            navigate("/app/inspector/dashboard");
            return;
          }
          
          setInspection(inspectionData);
          
          // Save inspection data locally for offline access
          await offlineService.saveInspectionLocally(inspectionData);
          
          // Load rooms and items
          await loadRooms(id);
          
          // Load signatures
          await loadSignatures(id);
          
          // Update inspection status if needed
          if (inspectionData.status === "agendada") {
            await inspectionService.updateInspection(id, { status: "em_andamento" });
          }
        } else {
          // Offline mode - load from IndexedDB
          const localData = await offlineService.getCompleteInspectionLocally(id);
          
          if (!localData.inspection) {
            toast.error("Vistoria não encontrada no cache local");
            navigate("/app/inspector/dashboard");
            return;
          }
          
          setInspection(localData.inspection);
          setRooms(localData.rooms);
          
          // Set signatures if available
          const inspectorSig = localData.signatures.find(sig => sig.signer === 'vistoriador');
          if (inspectorSig?.signature_data) {
            setInspectorSignature(inspectorSig.signature_data);
          }
          
          const responsibleSig = localData.signatures.find(sig => sig.signer === 'responsavel');
          if (responsibleSig?.signature_data) {
            setResponsibleSignature(responsibleSig.signature_data);
          }
          
          toast.info("Modo offline ativo. Alterações serão sincronizadas quando houver conexão.");
        }
      } catch (error) {
        console.error("Error loading inspection:", error);
        toast.error("Erro ao carregar dados da vistoria");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInspection();
  }, [id, navigate]);

  // Load rooms and items
  const loadRooms = async (inspectionId: string) => {
    try {
      const roomsData = await inspectionService.getRoomsByInspectionId(inspectionId);
      
      // If no rooms exist, create default rooms
      if (roomsData.length === 0) {
        const defaultRooms = [
          { name: "Sala", inspection_id: inspectionId, order_index: 0 } as Partial<InspectionRoom>,
          { name: "Cozinha", inspection_id: inspectionId, order_index: 1 } as Partial<InspectionRoom>,
          { name: "Quarto", inspection_id: inspectionId, order_index: 2 } as Partial<InspectionRoom>,
          { name: "Banheiro", inspection_id: inspectionId, order_index: 3 } as Partial<InspectionRoom>,
        ];
        
        const createdRooms = await Promise.all(
          defaultRooms.map(room => inspectionService.createRoom(room as Omit<InspectionRoom, "id" | "created_at">))
        );
        
        // Create default items for each room
        await Promise.all(
          createdRooms.map(async (room) => {
            if (!room) return null;
            
            const defaultItems = [
              { label: "Paredes", room_id: room.id, state: null, observation: null, transcription: null },
              { label: "Piso", room_id: room.id, state: null, observation: null, transcription: null },
              { label: "Teto", room_id: room.id, state: null, observation: null, transcription: null },
              { label: "Portas", room_id: room.id, state: null, observation: null, transcription: null },
              { label: "Janelas", room_id: room.id, state: null, observation: null, transcription: null },
            ];
            
            await Promise.all(defaultItems.map(item => 
              inspectionService.createItem(item as Omit<any, "id" | "created_at">)
            ));
          })
        );
        
        // Reload rooms with items
        const updatedRoomsData = await inspectionService.getRoomsByInspectionId(inspectionId);
        const roomsWithItems = await Promise.all(
          updatedRoomsData.map(room => inspectionService.getRoomWithItems(room.id))
        );
        
        const filteredRooms = roomsWithItems.filter(Boolean) as InspectionRoom[];
        setRooms(filteredRooms);
        
        // Also save rooms locally for offline access
        for (const room of filteredRooms) {
          await offlineService.saveRoomLocally(room, true);
          
          if (room.items) {
            for (const item of room.items) {
              await offlineService.saveItemLocally(item, true);
            }
          }
        }
      } else {
        // Load items for existing rooms
        const roomsWithItems = await Promise.all(
          roomsData.map(room => inspectionService.getRoomWithItems(room.id))
        );
        
        const filteredRooms = roomsWithItems.filter(Boolean) as InspectionRoom[];
        setRooms(filteredRooms);
        
        // Also save rooms locally for offline access
        for (const room of filteredRooms) {
          await offlineService.saveRoomLocally(room, true);
          
          if (room.items) {
            for (const item of room.items) {
              await offlineService.saveItemLocally(item, true);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error loading rooms:", error);
      toast.error("Erro ao carregar ambientes");
    }
  };

  // Signatures state is defined but used in the component later
  const [inspectorSignature, setInspectorSignature] = useState<string | null>(null);
  const [responsibleSignature, setResponsibleSignature] = useState<string | null>(null);
  
  // Load signatures
  const loadSignatures = async (inspectionId: string) => {
    try {
      // Load inspector signature
      const inspectorSig = await inspectionService.getSignature(inspectionId, "vistoriador");
      if (inspectorSig?.signature_data) {
        setInspectorSignature(inspectorSig.signature_data);
        
        // Save signature locally for offline access
        await offlineService.saveSignatureLocally(inspectorSig, true);
      }
      
      // Load responsible signature
      const responsibleSig = await inspectionService.getSignature(inspectionId, "responsavel");
      if (responsibleSig?.signature_data) {
        setResponsibleSignature(responsibleSig.signature_data);
        
        // Save signature locally for offline access
        await offlineService.saveSignatureLocally(responsibleSig, true);
      }
    } catch (error) {
      console.error("Error loading signatures:", error);
    }
  };

  return {
    inspection,
    rooms,
    setRooms,
    responsibleName,
    setResponsibleName,
    isLoading,
    isOnline,
    inspectorSignature,
    setInspectorSignature,
    responsibleSignature,
    setResponsibleSignature,
  };
};
