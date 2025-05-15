import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, QrCode, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import inspection service and types
import { inspectionService } from "@/services/inspectionService";
import { InspectionRoom, InspectionItem, Inspection } from "@/services/inspectionService/types";

// Import offline service
import { offlineService } from "@/services/offlineService";

// Import custom components
import { HeaderInfo } from "@/components/inspection/HeaderInfo";
import { RoomList } from "@/components/inspection/RoomList";
import { SignatureCanvas } from "@/components/inspection/SignatureCanvas";
import { ReportGenerator } from "@/components/inspection/ReportGenerator";
import { FloatingActions } from "@/components/inspection/FloatingActions";
import { QRCodeScanner } from "@/components/inspection/QRCodeScanner";
import { Skeleton } from "@/components/ui/skeleton";

export const InspectionExecute = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [currentTab, setCurrentTab] = useState("rooms");
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [rooms, setRooms] = useState<InspectionRoom[]>([]);
  const [responsibleName, setResponsibleName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  
  // Signatures
  const [inspectorSignature, setInspectorSignature] = useState<string | null>(null);
  const [responsibleSignature, setResponsibleSignature] = useState<string | null>(null);
  const [isInspectorSignatureOpen, setIsInspectorSignatureOpen] = useState(false);
  const [isResponsibleSignatureOpen, setIsResponsibleSignatureOpen] = useState(false);

  // Initialize offline service
  useEffect(() => {
    offlineService.initOfflineService();
    
    // Set up online/offline status listeners
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
          // Load inspection details
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
          { name: "Sala", inspection_id: inspectionId, order_index: 0, id: "", created_at: new Date().toISOString() },
          { name: "Cozinha", inspection_id: inspectionId, order_index: 1, id: "", created_at: new Date().toISOString() },
          { name: "Quarto", inspection_id: inspectionId, order_index: 2, id: "", created_at: new Date().toISOString() },
          { name: "Banheiro", inspection_id: inspectionId, order_index: 3, id: "", created_at: new Date().toISOString() },
        ];
        
        const createdRooms = await Promise.all(
          defaultRooms.map(room => inspectionService.createRoom(room))
        );
        
        // Create default items for each room
        await Promise.all(
          createdRooms.map(async (room) => {
            if (!room) return null;
            
            const defaultItems = [
              { label: "Paredes", room_id: room.id, state: null, observation: null, transcription: null, id: "", created_at: new Date().toISOString() },
              { label: "Piso", room_id: room.id, state: null, observation: null, transcription: null, id: "", created_at: new Date().toISOString() },
              { label: "Teto", room_id: room.id, state: null, observation: null, transcription: null, id: "", created_at: new Date().toISOString() },
              { label: "Portas", room_id: room.id, state: null, observation: null, transcription: null, id: "", created_at: new Date().toISOString() },
              { label: "Janelas", room_id: room.id, state: null, observation: null, transcription: null, id: "", created_at: new Date().toISOString() },
            ];
            
            await Promise.all(defaultItems.map(item => 
              inspectionService.createItem(item)
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
  
  // Calculate progress
  useEffect(() => {
    if (rooms.length === 0) {
      setProgress(0);
      return;
    }
    
    let totalItems = 0;
    let completedItems = 0;
    
    rooms.forEach(room => {
      if (room.items) {
        totalItems += room.items.length;
        room.items.forEach(item => {
          if (item.state) {
            completedItems++;
          }
        });
      }
    });
    
    const calculatedProgress = totalItems > 0 
      ? Math.round((completedItems / totalItems) * 100)
      : 0;
      
    setProgress(calculatedProgress);
  }, [rooms]);
  
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
      
      // Create a properly typed new room object with required fields
      const newRoom: InspectionRoom = {
        ...newRoomBase,
        id: "",
        created_at: new Date().toISOString()
      };
      
      let roomId: string;
      
      if (offlineService.isOnline()) {
        // Online mode - create room on server
        const createdRoom = await inspectionService.createRoom(newRoom);
        if (!createdRoom) {
          toast.error("Erro ao criar ambiente");
          return;
        }
        roomId = createdRoom.id;
        
        // Create default items for the new room
        const defaultItems = [
          { label: "Paredes", room_id: roomId, state: null, observation: null, transcription: null, id: "", created_at: new Date().toISOString() } as InspectionItem,
          { label: "Piso", room_id: roomId, state: null, observation: null, transcription: null, id: "", created_at: new Date().toISOString() } as InspectionItem,
          { label: "Teto", room_id: roomId, state: null, observation: null, transcription: null, id: "", created_at: new Date().toISOString() } as InspectionItem,
        ];
        
        await Promise.all(defaultItems.map(item => 
          inspectionService.createItem(item)
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
        roomId = await offlineService.saveRoomLocally(newRoom);
        
        // Create default items locally
        const defaultItems = [
          { label: "Paredes", room_id: roomId, state: null, observation: null, transcription: null, id: "", created_at: new Date().toISOString() } as InspectionItem,
          { label: "Piso", room_id: roomId, state: null, observation: null, transcription: null, id: "", created_at: new Date().toISOString() } as InspectionItem,
          { label: "Teto", room_id: roomId, state: null, observation: null, transcription: null, id: "", created_at: new Date().toISOString() } as InspectionItem,
        ];
        
        const createdItems = [];
        for (const item of defaultItems) {
          const itemId = await offlineService.saveItemLocally(item);
          createdItems.push({ ...item, id: itemId });
        }
        
        // Add room to UI
        const newRoomWithItems: InspectionRoom = {
          ...newRoom,
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
        const createdItem = await inspectionService.createItem(newItem);
        if (!createdItem) {
          toast.error("Erro ao adicionar item");
          return;
        }
        
        itemId = createdItem.id;
        
        // Save item locally for offline access
        await offlineService.saveItemLocally(createdItem, true);
      } else {
        // Offline mode - save locally
        itemId = await offlineService.saveItemLocally(newItem);
        toast.info("Item criado localmente. Será sincronizado quando houver conexão.");
      }
      
      // Update UI
      setRooms(prevRooms => 
        prevRooms.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              items: [...(room.items || []), { ...newItem, id: itemId, created_at: new Date().toISOString() }]
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
      setCurrentTab("finish");
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

  // Handle QR code scanning
  const handleQrCodeScanned = (qrData: string) => {
    setQrCodeData(qrData);
    
    // Parse the QR code data - format should be determined by your application
    try {
      // Example: If QR code contains JSON with inspection details
      const qrInfo = JSON.parse(qrData);
      
      if (qrInfo.inspection_id && qrInfo.room) {
        toast.success(`QR Code vinculado ao ambiente: ${qrInfo.room}`);
        
        // You could:
        // 1. Link this QR code to the room
        // 2. Navigate to that specific room
        // 3. Store the QR association in your database
      }
    } catch (error) {
      // If not JSON, just store as plain text
      toast.info(`QR Code escaneado: ${qrData}`);
    }
  };
  
  if (isLoading) {
    return (
      <InspectorLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8" />
            <div>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-60 mt-1" />
            </div>
          </div>
          
          <Skeleton className="h-40 w-full" />
          
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </InspectorLayout>
    );
  }
  
  if (!inspection) {
    return (
      <InspectorLayout>
        <div className="flex flex-col items-center justify-center py-12">
          <h1 className="text-xl font-bold mb-2">Vistoria não encontrada</h1>
          <p className="text-gray-500 mb-4">Não foi possível encontrar os dados desta vistoria.</p>
          <Button onClick={() => navigate("/app/inspector/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>
      </InspectorLayout>
    );
  }
  
  return (
    <InspectorLayout>
      <div className="space-y-6 pb-16">
        {/* Header with back button and connection status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => navigate("/app/inspector/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Vistoria {inspection.id}</h1>
              <p className="text-gray-500 text-sm">
                {inspection.type} - {inspection.address}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setIsQrScannerOpen(true)}
            >
              <QrCode size={16} />
              <span className="hidden sm:inline">Escanear QR</span>
            </Button>
            
            <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-100">
              {isOnline ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span className="hidden sm:inline text-green-500">Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-amber-500" />
                  <span className="hidden sm:inline text-amber-500">Offline</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <HeaderInfo 
          address={inspection.address}
          date={inspection.date}
          time={inspection.time}
          onResponsibleChange={setResponsibleName}
        />
        
        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rooms">Ambientes</TabsTrigger>
            <TabsTrigger value="finish">Finalizar</TabsTrigger>
          </TabsList>
          
          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-4">
            <RoomList
              rooms={rooms}
              onRoomNameChange={handleRoomNameChange}
              onRoomDelete={handleRoomDelete}
              onAddItem={handleAddItem}
              onItemUpdate={handleItemUpdate}
              onItemDelete={handleItemDelete}
            />
          </TabsContent>
          
          {/* Finish Tab */}
          <TabsContent value="finish" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Summary */}
                <div className="space-y-4">
                  <h3 className="font-medium">Resumo da Vistoria</h3>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-medium">{inspection.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Data:</span>
                      <span>{inspection.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tipo:</span>
                      <span>{inspection.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Horário:</span>
                      <span>{inspection.time || "--:--"}</span>
                    </div>
                    <div className="col-span-2 flex justify-between">
                      <span className="text-gray-500">Endereço:</span>
                      <span className="text-right">{inspection.address}</span>
                    </div>
                    {responsibleName && (
                      <div className="col-span-2 flex justify-between">
                        <span className="text-gray-500">Responsável:</span>
                        <span className="text-right">{responsibleName}</span>
                      </div>
                    )}
                    {qrCodeData && (
                      <div className="col-span-2 flex justify-between">
                        <span className="text-gray-500">QR Code:</span>
                        <span className="text-right truncate max-w-[200px]">{qrCodeData}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Progresso do Checklist</h4>
                    <div className="bg-gray-100 h-2 rounded-full">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{rooms.reduce((total, room) => total + (room.items?.filter(item => item.state)?.length || 0), 0)} itens verificados</span>
                      <span>{progress}% concluído</span>
                    </div>
                  </div>
                </div>
                
                {/* Signatures */}
                <div className="space-y-3">
                  <h3 className="font-medium">Assinaturas</h3>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Assinatura do Vistoriador <span className="text-red-500">*</span></span>
                      {inspectorSignature && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 py-0 text-xs"
                          onClick={() => setIsInspectorSignatureOpen(true)}
                        >
                          Alterar
                        </Button>
                      )}
                    </div>
                    
                    {inspectorSignature ? (
                      <div className="border rounded-md h-24 flex items-center justify-center p-2 bg-gray-50">
                        <img src={inspectorSignature} alt="Assinatura do Vistoriador" className="max-h-full" />
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full h-24 border-2 border-dashed flex flex-col gap-1"
                        onClick={() => setIsInspectorSignatureOpen(true)}
                      >
                        <span className="text-gray-400">Clique para assinar</span>
                        <span className="text-xs text-gray-400">(obrigatório)</span>
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-500">Assinatura do Responsável (opcional)</span>
                      {responsibleSignature && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 py-0 text-xs"
                          onClick={() => setIsResponsibleSignatureOpen(true)}
                        >
                          Alterar
                        </Button>
                      )}
                    </div>
                    
                    {responsibleSignature ? (
                      <div className="border rounded-md h-24 flex items-center justify-center p-2 bg-gray-50">
                        <img src={responsibleSignature} alt="Assinatura do Responsável" className="max-h-full" />
                      </div>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full h-24 border-2 border-dashed flex flex-col gap-1"
                        onClick={() => setIsResponsibleSignatureOpen(true)}
                      >
                        <span className="text-gray-400">Clique para assinar</span>
                        <span className="text-xs text-gray-400">(opcional)</span>
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Report Generator */}
                <div className="pt-2">
                  <ReportGenerator
                    inspection={inspection!}
                    rooms={rooms}
                    inspectorSignature={inspectorSignature}
                    responsibleSignature={responsibleSignature}
                    responsibleName={responsibleName}
                  />
                </div>
                
                {/* Complete Button */}
                <Button 
                  onClick={handleCompleteInspection} 
                  disabled={!inspectorSignature || !isOnline}
                  className="w-full"
                >
                  Finalizar Vistoria
                </Button>
                
                {!isOnline && (
                  <p className="text-amber-500 text-xs text-center">
                    Você está offline. Conecte-se à internet para finalizar a vistoria.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating Actions */}
      <FloatingActions
        progress={progress}
        onAddRoom={handleAddRoom}
        onSaveProgress={handleSaveProgress}
        onCompleteInspection={handleCompleteInspection}
      />
      
      {/* Signature Dialogs */}
      {isInspectorSignatureOpen && (
        <SignatureCanvas
          inspectionId={inspection.id}
          signer="vistoriador"
          title="Assinatura do Vistoriador"
          description="Assine no espaço abaixo para finalizar a vistoria."
          onClose={() => setIsInspectorSignatureOpen(false)}
          onSignatureAdded={(signatureData) => setInspectorSignature(signatureData)}
        />
      )}
      
      {isResponsibleSignatureOpen && (
        <SignatureCanvas
          inspectionId={inspection.id}
          signer="responsavel"
          title="Assinatura do Responsável"
          description="Solicite ao responsável que assine no espaço abaixo."
          onClose={() => setIsResponsibleSignatureOpen(false)}
          onSignatureAdded={(signatureData) => setResponsibleSignature(signatureData)}
        />
      )}
      
      {/* QR Code Scanner */}
      {isQrScannerOpen && (
        <QRCodeScanner
          onClose={() => setIsQrScannerOpen(false)}
          onCodeScanned={handleQrCodeScanned}
        />
      )}
    </InspectorLayout>
  );
};

export default InspectionExecute;
