
import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  CheckCircle,
  Camera,
  AlertCircle,
  XCircle,
  Plus,
  ArrowLeft,
  Mic,
  Save,
  ClipboardCheck,
  MapPin,
  User,
  Home,
  CalendarClock,
  Trash2,
  FileText,
  Image
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import PhotoCapture from "@/components/inspection/PhotoCapture";
import AudioRecorder from "@/components/inspection/AudioRecorder";
import SignatureCapture from "@/components/inspection/SignatureCapture";
import PDFViewer from "@/components/inspection/PDFViewer";

// Interface for photo type
interface Photo {
  id: string;
  url: string;
}

// Interface for item type
interface InspectionItem {
  id: string;
  name: string;
  status: string;
  observation: string;
  photos: Photo[];
}

// Interface for room type
interface Room {
  id: string;
  name: string;
  items: InspectionItem[];
}

export const InspectionForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State for photo capturing
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  
  // State for signatures
  const [isInspectorSignatureModalOpen, setIsInspectorSignatureModalOpen] = useState(false);
  const [isResponsibleSignatureModalOpen, setIsResponsibleSignatureModalOpen] = useState(false);
  const [inspectorSignature, setInspectorSignature] = useState<string | null>(null);
  const [responsibleSignature, setResponsibleSignature] = useState<string | null>(null);
  
  // State for PDF preview
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  
  // Sample inspection data
  const inspectionData = {
    id: id || "VIS-1234",
    address: "Av. Paulista, 1000, Apto 123",
    date: "15/05/2025",
    time: "14:30",
    propertyType: "Apartamento",
    responsible: "Maria Souza",
    status: "in_progress",
  };
  
  const [currentTab, setCurrentTab] = useState("info");
  const [rooms, setRooms] = useState<Room[]>([
    {
      id: "sala",
      name: "Sala",
      items: [
        { id: "parede", name: "Paredes", status: "", observation: "", photos: [] },
        { id: "piso", name: "Piso", status: "", observation: "", photos: [] },
        { id: "teto", name: "Teto", status: "", observation: "", photos: [] },
        { id: "porta", name: "Porta", status: "", observation: "", photos: [] },
        { id: "janela", name: "Janelas", status: "", observation: "", photos: [] },
        { id: "tomadas", name: "Tomadas e Interruptores", status: "", observation: "", photos: [] },
      ]
    },
    {
      id: "cozinha",
      name: "Cozinha",
      items: [
        { id: "parede", name: "Paredes", status: "", observation: "", photos: [] },
        { id: "piso", name: "Piso", status: "", observation: "", photos: [] },
        { id: "teto", name: "Teto", status: "", observation: "", photos: [] },
        { id: "porta", name: "Porta", status: "", observation: "", photos: [] },
        { id: "armarios", name: "Armários", status: "", observation: "", photos: [] },
        { id: "pia", name: "Pia e Torneira", status: "", observation: "", photos: [] },
        { id: "eletro", name: "Eletrodomésticos", status: "", observation: "", photos: [] },
      ]
    },
    {
      id: "quarto1",
      name: "Quarto 1",
      items: [
        { id: "parede", name: "Paredes", status: "", observation: "", photos: [] },
        { id: "piso", name: "Piso", status: "", observation: "", photos: [] },
        { id: "teto", name: "Teto", status: "", observation: "", photos: [] },
        { id: "porta", name: "Porta", status: "", observation: "", photos: [] },
        { id: "janela", name: "Janelas", status: "", observation: "", photos: [] },
        { id: "armarios", name: "Armários", status: "", observation: "", photos: [] },
      ]
    },
    {
      id: "banheiro",
      name: "Banheiro",
      items: [
        { id: "parede", name: "Paredes", status: "", observation: "", photos: [] },
        { id: "piso", name: "Piso", status: "", observation: "", photos: [] },
        { id: "teto", name: "Teto", status: "", observation: "", photos: [] },
        { id: "porta", name: "Porta", status: "", observation: "", photos: [] },
        { id: "pia", name: "Pia e Torneira", status: "", observation: "", photos: [] },
        { id: "vaso", name: "Vaso Sanitário", status: "", observation: "", photos: [] },
        { id: "chuveiro", name: "Chuveiro", status: "", observation: "", photos: [] },
      ]
    }
  ]);
  
  // Calculate progress
  const calculateProgress = () => {
    let totalItems = 0;
    let completedItems = 0;
    
    rooms.forEach(room => {
      totalItems += room.items.length;
      room.items.forEach(item => {
        if (item.status !== "") {
          completedItems++;
        }
      });
    });
    
    return {
      totalItems,
      completedItems,
      percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
    };
  };
  
  const progress = calculateProgress();
  
  // Update item status
  const updateItemStatus = (roomId: string, itemId: string, status: string) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            items: room.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, status };
              }
              return item;
            }),
          };
        }
        return room;
      })
    );
  };
  
  // Update item observation
  const updateItemObservation = (roomId: string, itemId: string, observation: string) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            items: room.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, observation };
              }
              return item;
            }),
          };
        }
        return room;
      })
    );
  };
  
  // Handle speech recognition from AudioRecorder component
  const handleSpeechRecognition = (roomId: string, itemId: string, text: string) => {
    updateItemObservation(roomId, itemId, text);
  };
  
  // Handle photo capture
  const handlePhotoCaptureStart = (roomId: string, itemId: string) => {
    setCurrentRoomId(roomId);
    setCurrentItemId(itemId);
    setIsPhotoModalOpen(true);
  };
  
  // Add photo to item
  const handlePhotoCapture = (photoData: string) => {
    if (currentRoomId && currentItemId) {
      const newPhoto = {
        id: `photo_${Date.now()}`,
        url: photoData
      };
      
      setRooms(
        rooms.map((room) => {
          if (room.id === currentRoomId) {
            return {
              ...room,
              items: room.items.map((item) => {
                if (item.id === currentItemId) {
                  return { 
                    ...item, 
                    photos: [...item.photos, newPhoto] 
                  };
                }
                return item;
              }),
            };
          }
          return room;
        })
      );
      
      setIsPhotoModalOpen(false);
      toast.success("Foto adicionada com sucesso!");
    }
  };
  
  // Remove photo from item
  const handleRemovePhoto = (roomId: string, itemId: string, photoId: string) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            items: room.items.map((item) => {
              if (item.id === itemId) {
                return { 
                  ...item, 
                  photos: item.photos.filter(photo => photo.id !== photoId) 
                };
              }
              return item;
            }),
          };
        }
        return room;
      })
    );
    
    toast.success("Foto removida com sucesso!");
  };
  
  // Add new room
  const handleAddRoom = () => {
    const newRoomId = `room-${Date.now()}`;
    const newRoom = {
      id: newRoomId,
      name: "Novo Ambiente",
      items: [
        { id: "parede", name: "Paredes", status: "", observation: "", photos: [] },
        { id: "piso", name: "Piso", status: "", observation: "", photos: [] },
        { id: "teto", name: "Teto", status: "", observation: "", photos: [] },
      ]
    };
    
    setRooms([...rooms, newRoom]);
    toast.success("Novo ambiente adicionado!");
  };
  
  // Add new item to room
  const handleAddItem = (roomId: string) => {
    const newItemId = `item-${Date.now()}`;
    
    setRooms(
      rooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            items: [...room.items, {
              id: newItemId,
              name: "Novo Item",
              status: "",
              observation: "",
              photos: []
            }]
          };
        }
        return room;
      })
    );
    
    toast.success("Novo item adicionado!");
  };
  
  // Update room name
  const handleRoomNameChange = (roomId: string, newName: string) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            name: newName
          };
        }
        return room;
      })
    );
  };
  
  // Update item name
  const handleItemNameChange = (roomId: string, itemId: string, newName: string) => {
    setRooms(
      rooms.map((room) => {
        if (room.id === roomId) {
          return {
            ...room,
            items: room.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, name: newName };
              }
              return item;
            }),
          };
        }
        return room;
      })
    );
  };
  
  // Save inspection progress
  const handleSaveProgress = () => {
    // In a real application, this would save the data to a server
    toast.success("Progresso da vistoria salvo com sucesso!");
  };
  
  // Generate the PDF report
  const handleGenerateReport = () => {
    // Check if inspector signature is present
    if (!inspectorSignature) {
      toast.error("A assinatura do vistoriador é obrigatória para gerar o relatório.");
      setCurrentTab("finish");
      return;
    }
    
    // In a real application, this would generate a PDF on the server
    toast.success("Relatório gerado com sucesso!");
    setIsPdfModalOpen(true);
  };
  
  // Complete inspection
  const handleComplete = () => {
    // Check if inspector signature is present
    if (!inspectorSignature) {
      toast.error("A assinatura do vistoriador é obrigatória para finalizar.");
      return;
    }
    
    toast.success("Vistoria finalizada com sucesso! O laudo será gerado automaticamente.");
    handleGenerateReport();
  };

  return (
    <InspectorLayout>
      <div className="space-y-6 pb-16">
        {/* Header with back button */}
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
            <h1 className="text-xl font-bold">Vistoria {inspectionData.id}</h1>
            <p className="text-gray-500 text-sm">
              {inspectionData.propertyType} - {inspectionData.address}
            </p>
          </div>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="finish">Finalizar</TabsTrigger>
          </TabsList>
          
          {/* Info Tab */}
          <TabsContent value="info" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes da Vistoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Endereço</span>
                  </div>
                  <Input value={inspectionData.address} readOnly />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-500">
                    <User className="h-4 w-4" />
                    <span className="text-sm">Responsável no local</span>
                  </div>
                  <Input 
                    placeholder="Nome do responsável presente" 
                    defaultValue={inspectionData.responsible} 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Home className="h-4 w-4" />
                      <span className="text-sm">Tipo de Imóvel</span>
                    </div>
                    <Select defaultValue={inspectionData.propertyType.toLowerCase()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartamento">Apartamento</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <CalendarClock className="h-4 w-4" />
                      <span className="text-sm">Data e Hora</span>
                    </div>
                    <Input 
                      value={`${inspectionData.date} às ${inspectionData.time}`} 
                      readOnly 
                      disabled
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Observações Gerais</Label>
                  <Textarea 
                    placeholder="Informações gerais sobre o imóvel ou a vistoria..." 
                    rows={4}
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setCurrentTab("checklist")}>
                    Continuar para Checklist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Checklist Tab */}
          <TabsContent value="checklist" className="space-y-4">
            {rooms.map((room) => (
              <Accordion type="single" collapsible className="bg-white rounded-md border" key={room.id}>
                <AccordionItem value={`room-${room.id}`}>
                  <AccordionTrigger className="px-4">
                    <div className="flex items-center gap-2 w-full">
                      <Input 
                        value={room.name}
                        onChange={(e) => handleRoomNameChange(room.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-7 text-sm w-auto min-w-[120px] max-w-[200px]"
                      />
                      <span className="text-xs text-gray-500">
                        ({room.items.filter(item => item.status !== "").length}/{room.items.length} verificados)
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 space-y-4">
                    {room.items.map((item) => (
                      <Card key={`${room.id}-${item.id}`} className="overflow-hidden">
                        <CardHeader className="py-3 px-4 bg-gray-50 border-b">
                          <div className="flex items-center justify-between">
                            <Input 
                              value={item.name}
                              onChange={(e) => handleItemNameChange(room.id, item.id, e.target.value)}
                              className="h-7 text-sm w-auto min-w-[120px] max-w-[200px] font-medium"
                            />
                            <div className="flex gap-2">
                              <Button 
                                variant={item.status === "ok" ? "default" : "outline"} 
                                size="sm" 
                                className={`h-7 px-2 ${item.status === "ok" ? "bg-green-600" : ""}`}
                                onClick={() => updateItemStatus(room.id, item.id, "ok")}
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="ml-1">OK</span>
                              </Button>
                              
                              <Button 
                                variant={item.status === "warning" ? "default" : "outline"} 
                                size="sm" 
                                className={`h-7 px-2 ${item.status === "warning" ? "bg-amber-600" : ""}`}
                                onClick={() => updateItemStatus(room.id, item.id, "warning")}
                              >
                                <AlertCircle className="h-4 w-4" />
                                <span className="ml-1">Obs</span>
                              </Button>
                              
                              <Button 
                                variant={item.status === "damaged" ? "default" : "outline"} 
                                size="sm" 
                                className={`h-7 px-2 ${item.status === "damaged" ? "bg-red-600" : ""}`}
                                onClick={() => updateItemStatus(room.id, item.id, "damaged")}
                              >
                                <XCircle className="h-4 w-4" />
                                <span className="ml-1">Dano</span>
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-3 py-3">
                          <div className="space-y-2">
                            <Label className="text-xs text-gray-500">Observações</Label>
                            <div className="flex gap-2">
                              <Textarea 
                                placeholder="Descreva o estado deste item..." 
                                className="text-sm"
                                rows={2}
                                value={item.observation}
                                onChange={(e) => updateItemObservation(room.id, item.id, e.target.value)}
                              />
                              <div>
                                <AudioRecorder
                                  onTranscriptionComplete={(text) => handleSpeechRecognition(room.id, item.id, text)}
                                />
                              </div>
                            </div>
                          </div>
                          
                          {/* Photos */}
                          <div>
                            <div className="flex items-center justify-between">
                              <Label className="text-xs text-gray-500">Fotos</Label>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 text-xs"
                                onClick={() => handlePhotoCaptureStart(room.id, item.id)}
                              >
                                <Camera className="h-3.5 w-3.5 mr-1" />
                                Adicionar
                              </Button>
                            </div>
                            
                            {/* Photo gallery */}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {item.photos.length === 0 ? (
                                <div className="w-full h-20 border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center">
                                  <p className="text-xs text-gray-400">Nenhuma foto adicionada</p>
                                </div>
                              ) : (
                                item.photos.map((photo) => (
                                  <div key={photo.id} className="relative h-20 w-20 rounded-md overflow-hidden group">
                                    <img 
                                      src={photo.url} 
                                      alt="" 
                                      className="h-full w-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-white"
                                        onClick={() => handleRemovePhoto(room.id, item.id, photo.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {/* Add Item button */}
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleAddItem(room.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Item
                    </Button>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
            
            {/* Add Room Button */}
            <Button 
              variant="outline" 
              className="w-full border-dashed" 
              onClick={handleAddRoom}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Ambiente
            </Button>
            
            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentTab("info")}>
                Voltar
              </Button>
              <Button onClick={() => setCurrentTab("finish")}>
                Próximo
              </Button>
            </div>
          </TabsContent>
          
          {/* Finish Tab */}
          <TabsContent value="finish" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Finalizar Vistoria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Summary */}
                <div className="space-y-4">
                  <h3 className="font-medium">Resumo da Vistoria</h3>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">ID:</span>
                      <span className="font-medium">{inspectionData.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Data:</span>
                      <span>{inspectionData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tipo:</span>
                      <span>{inspectionData.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Horário:</span>
                      <span>{inspectionData.time}</span>
                    </div>
                    <div className="col-span-2 flex justify-between">
                      <span className="text-gray-500">Endereço:</span>
                      <span className="text-right">{inspectionData.address}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Progresso do Checklist</h4>
                    <div className="bg-gray-100 h-2 rounded-full">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${progress.percentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{progress.completedItems} itens verificados</span>
                      <span>{progress.percentage}% concluído</span>
                    </div>
                  </div>
                </div>
                
                {/* Signature */}
                <div className="space-y-3">
                  <h3 className="font-medium">Assinaturas</h3>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-sm text-gray-500">Assinatura do Vistoriador <span className="text-red-500">*</span></Label>
                      {inspectorSignature && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 py-0 text-xs"
                          onClick={() => setIsInspectorSignatureModalOpen(true)}
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
                        onClick={() => setIsInspectorSignatureModalOpen(true)}
                      >
                        <span className="text-gray-400">Clique para assinar</span>
                        <span className="text-xs text-gray-400">(obrigatório)</span>
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-sm text-gray-500">Assinatura do Responsável (opcional)</Label>
                      {responsibleSignature && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 px-2 py-0 text-xs"
                          onClick={() => setIsResponsibleSignatureModalOpen(true)}
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
                        onClick={() => setIsResponsibleSignatureModalOpen(true)}
                      >
                        <span className="text-gray-400">Clique para assinar</span>
                        <span className="text-xs text-gray-400">(opcional)</span>
                      </Button>
                    )}
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={handleComplete} 
                    className="w-full"
                    disabled={!inspectorSignature}
                  >
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Finalizar e Gerar Laudo
                  </Button>
                  
                  <Button variant="outline" onClick={handleSaveProgress} className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Salvar e Continuar Depois
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setCurrentTab("checklist")}>
                Voltar ao Checklist
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Photo Capture Modal */}
      <Dialog open={isPhotoModalOpen} onOpenChange={setIsPhotoModalOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <DialogTitle className="px-4 pt-4 pb-0">Capturar Foto</DialogTitle>
          <PhotoCapture 
            onPhotoCapture={handlePhotoCapture} 
            onCancel={() => setIsPhotoModalOpen(false)} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Inspector Signature Modal */}
      <Dialog open={isInspectorSignatureModalOpen} onOpenChange={setIsInspectorSignatureModalOpen}>
        <DialogContent className="sm:max-w-md">
          <SignatureCapture 
            title="Assinatura do Vistoriador" 
            onSignCapture={(data) => {
              setInspectorSignature(data);
              setIsInspectorSignatureModalOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
      
      {/* Responsible Signature Modal */}
      <Dialog open={isResponsibleSignatureModalOpen} onOpenChange={setIsResponsibleSignatureModalOpen}>
        <DialogContent className="sm:max-w-md">
          <SignatureCapture 
            title="Assinatura do Responsável" 
            onSignCapture={(data) => {
              setResponsibleSignature(data);
              setIsResponsibleSignatureModalOpen(false);
            }} 
          />
        </DialogContent>
      </Dialog>
      
      {/* PDF Viewer Modal */}
      <Dialog open={isPdfModalOpen} onOpenChange={setIsPdfModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <PDFViewer 
            pdfUrl="https://loremflickr.com/cache/resized/65535_52560648347_44da74c220_z_640_480_nofilter.jpg" 
            reportTitle={`Laudo de Vistoria - ${inspectionData.id}`} 
          />
        </DialogContent>
      </Dialog>
    </InspectorLayout>
  );
};

export default InspectionForm;
