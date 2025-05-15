
import { useState, useEffect } from "react";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Button } from "@/components/ui/button";
import { InspectionSection } from "@/components/inspector/InspectionSection";
import { EmptyInspectionState } from "@/components/inspector/EmptyInspectionState";
import { useInspections } from "@/hooks/useInspections";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, CalendarClock, SlidersHorizontal } from "lucide-react";
import { Inspection } from "@/services/inspectionService";

export const InspectionList = () => {
  const { 
    pendingInspections, 
    inProgressInspections, 
    completedInspections, 
    isLoading 
  } = useInspections();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filteredInspections, setFilteredInspections] = useState<Inspection[]>([]);
  
  useEffect(() => {
    let inspections: Inspection[] = [];
    
    // Filtrar por tab
    switch (activeTab) {
      case "pending":
        inspections = [...pendingInspections];
        break;
      case "inProgress":
        inspections = [...inProgressInspections];
        break;
      case "completed":
        inspections = [...completedInspections];
        break;
      case "all":
      default:
        inspections = [...pendingInspections, ...inProgressInspections, ...completedInspections];
        break;
    }
    
    // Filtrar pela pesquisa
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      inspections = inspections.filter(inspection => 
        inspection.address.toLowerCase().includes(query) ||
        inspection.type.toLowerCase().includes(query) ||
        inspection.id.toLowerCase().includes(query)
      );
    }
    
    setFilteredInspections(inspections);
  }, [activeTab, searchQuery, pendingInspections, inProgressInspections, completedInspections]);
  
  return (
    <InspectorLayout>
      <div className="space-y-6 pb-16">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Minhas Vistorias</h1>
            <p className="text-gray-500">Gerencie suas vistorias agendadas</p>
          </div>
          <Button className="shrink-0">
            <CalendarClock className="mr-2 h-4 w-4" />
            Ver Agenda
          </Button>
        </div>
        
        {/* Barra de pesquisa e filtros */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Buscar por endereço, tipo ou ID..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Tabs para filtragem */}
        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="inProgress">Em Andamento</TabsTrigger>
            <TabsTrigger value="completed">Concluídas</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-vistoria-blue"></div>
              </div>
            ) : filteredInspections.length > 0 ? (
              <div className="space-y-4">
                {activeTab === "inProgress" && inProgressInspections.length > 0 && (
                  <InspectionSection 
                    title="Em andamento" 
                    icon="inProgress"
                    inspections={
                      searchQuery ? 
                        filteredInspections.filter(i => i.status === "em_andamento") :
                        inProgressInspections
                    }
                  />
                )}
                
                {activeTab === "pending" && pendingInspections.length > 0 && (
                  <InspectionSection 
                    title="Pendentes" 
                    icon="pending"
                    inspections={
                      searchQuery ? 
                        filteredInspections.filter(i => i.status === "agendada" || i.status === "atrasada") :
                        pendingInspections
                    }
                  />
                )}
                
                {activeTab === "completed" && completedInspections.length > 0 && (
                  <InspectionSection 
                    title="Concluídas" 
                    icon="completed"
                    inspections={
                      searchQuery ? 
                        filteredInspections.filter(i => i.status === "concluida") :
                        completedInspections
                    }
                  />
                )}
                
                {activeTab === "all" && (
                  <>
                    {searchQuery ? (
                      // Se há pesquisa, mostrar resultados agrupados por status
                      <>
                        {filteredInspections.filter(i => i.status === "em_andamento").length > 0 && (
                          <InspectionSection 
                            title="Em andamento" 
                            icon="inProgress"
                            inspections={filteredInspections.filter(i => i.status === "em_andamento")}
                          />
                        )}
                        
                        {filteredInspections.filter(i => i.status === "agendada" || i.status === "atrasada").length > 0 && (
                          <InspectionSection 
                            title="Pendentes" 
                            icon="pending"
                            inspections={filteredInspections.filter(i => i.status === "agendada" || i.status === "atrasada")}
                          />
                        )}
                        
                        {filteredInspections.filter(i => i.status === "concluida").length > 0 && (
                          <InspectionSection 
                            title="Concluídas" 
                            icon="completed"
                            inspections={filteredInspections.filter(i => i.status === "concluida")}
                          />
                        )}
                      </>
                    ) : (
                      // Senão, mostrar todas as seções
                      <>
                        {inProgressInspections.length > 0 && (
                          <InspectionSection 
                            title="Em andamento" 
                            icon="inProgress"
                            inspections={inProgressInspections}
                          />
                        )}
                        
                        {pendingInspections.length > 0 && (
                          <InspectionSection 
                            title="Pendentes" 
                            icon="pending"
                            inspections={pendingInspections}
                          />
                        )}
                        
                        {completedInspections.length > 0 && (
                          <InspectionSection 
                            title="Concluídas" 
                            icon="completed"
                            inspections={completedInspections}
                            showViewAll
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            ) : (
              searchQuery ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Nenhuma vistoria encontrada para "{searchQuery}"</p>
                  <Button 
                    variant="link" 
                    onClick={() => setSearchQuery("")}
                    className="mt-2"
                  >
                    Limpar busca
                  </Button>
                </div>
              ) : (
                <EmptyInspectionState />
              )
            )}
          </TabsContent>
        </Tabs>
      </div>
    </InspectorLayout>
  );
};

export default InspectionList;
