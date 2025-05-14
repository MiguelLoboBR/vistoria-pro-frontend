
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, Clock, Home, MapPin, Camera, Clipboard, Save } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { PhotoCapture } from "@/components/inspection/PhotoCapture";
import { SignatureCapture } from "@/components/inspection/SignatureCapture";
import { AudioRecorder } from "@/components/inspection/AudioRecorder";

interface InspectionData {
  id: string;
  address: string;
  date: string;
  time: string;
  type: string;
  status: string;
}

export const InspectorInspection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [inspection, setInspection] = useState<InspectionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    // In a real implementation, we would fetch data from the API
    setTimeout(() => {
      setInspection({
        id: id || "unknown",
        address: "Av. Paulista, 1000, Apto 123, São Paulo - SP",
        date: "15/05/2025",
        time: "14:30",
        type: "Entrada",
        status: "in_progress"
      });
      setIsLoading(false);
    }, 1000);
  }, [id]);
  
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Vistoria salva com sucesso!");
    }, 1500);
  };
  
  const handleComplete = () => {
    toast.success("Vistoria concluída com sucesso!");
    navigate("/inspector/dashboard");
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Concluída</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">Em Andamento</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pendente</Badge>;
      default:
        return <Badge className="bg-gray-500">{status}</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <InspectorLayout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-vistoria-blue"></div>
        </div>
      </InspectorLayout>
    );
  }
  
  if (!inspection) {
    return (
      <InspectorLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Vistoria não encontrada</h2>
          <p className="text-gray-500 mb-4">Não foi possível encontrar a vistoria solicitada.</p>
          <Button onClick={() => navigate("/inspector/dashboard")}>
            Voltar para Dashboard
          </Button>
        </div>
      </InspectorLayout>
    );
  }
  
  return (
    <InspectorLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/inspector/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Vistoria #{inspection.id}</h1>
                {getStatusBadge(inspection.status)}
              </div>
              <p className="text-gray-500">{inspection.address}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
            <Button onClick={handleComplete}>
              Concluir Vistoria
            </Button>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Home className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Tipo</p>
                  <p className="font-medium">{inspection.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Data</p>
                  <p className="font-medium">{inspection.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Horário</p>
                  <p className="font-medium">{inspection.time}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="rooms">Cômodos</TabsTrigger>
            <TabsTrigger value="photos">Fotos</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações do Imóvel</CardTitle>
                <CardDescription>Dados básicos do imóvel a ser vistoriado</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Endereço Completo</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 mt-1 text-gray-500" />
                      <p>{inspection.address}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Tipo de Imóvel</p>
                    <p>Apartamento</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Área</p>
                    <p>75 m²</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Quartos</p>
                    <p>2</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Banheiros</p>
                    <p>1</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Captura de Fotos</CardTitle>
                  <CardDescription>Tire fotos do imóvel</CardDescription>
                </CardHeader>
                <CardContent>
                  <PhotoCapture />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Assinatura</CardTitle>
                  <CardDescription>Coleta de assinaturas</CardDescription>
                </CardHeader>
                <CardContent>
                  <SignatureCapture />
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Observações em Áudio</CardTitle>
                <CardDescription>Grave observações sobre o imóvel</CardDescription>
              </CardHeader>
              <CardContent>
                <AudioRecorder />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rooms" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sala</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estado de Conservação</p>
                    <div className="flex gap-2">
                      {["Ótimo", "Bom", "Regular", "Ruim"].map(status => (
                        <Badge
                          key={status}
                          variant={status === "Bom" ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fotos</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Observações</p>
                    <textarea 
                      className="w-full h-20 p-2 border rounded-md" 
                      placeholder="Digite suas observações aqui..."
                    ></textarea>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Cozinha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estado de Conservação</p>
                    <div className="flex gap-2">
                      {["Ótimo", "Bom", "Regular", "Ruim"].map(status => (
                        <Badge
                          key={status}
                          variant={status === "Ótimo" ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fotos</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Observações</p>
                    <textarea 
                      className="w-full h-20 p-2 border rounded-md" 
                      placeholder="Digite suas observações aqui..."
                    ></textarea>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quarto Principal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estado de Conservação</p>
                    <div className="flex gap-2">
                      {["Ótimo", "Bom", "Regular", "Ruim"].map(status => (
                        <Badge
                          key={status}
                          variant={status === "Regular" ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fotos</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Observações</p>
                    <textarea 
                      className="w-full h-20 p-2 border rounded-md" 
                      placeholder="Digite suas observações aqui..."
                    ></textarea>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Banheiro</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estado de Conservação</p>
                    <div className="flex gap-2">
                      {["Ótimo", "Bom", "Regular", "Ruim"].map(status => (
                        <Badge
                          key={status}
                          variant={status === "Bom" ? "default" : "outline"}
                          className="cursor-pointer"
                        >
                          {status}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Fotos</p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Observações</p>
                    <textarea 
                      className="w-full h-20 p-2 border rounded-md" 
                      placeholder="Digite suas observações aqui..."
                    ></textarea>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Galeria de Fotos</CardTitle>
                <CardDescription>Todas as fotos capturadas durante a vistoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-100 rounded-md flex items-center justify-center">
                      <Clipboard className="h-8 w-8 text-gray-400" />
                    </div>
                  ))}
                  
                  <Button variant="outline" className="aspect-square flex flex-col items-center justify-center gap-2">
                    <Camera className="h-8 w-8" />
                    <span>Adicionar</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </InspectorLayout>
  );
};

export default InspectorInspection;
