
import { useNavigate } from "react-router-dom";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Button } from "@/components/ui/button";
import { CalendarClock, Map, History } from "lucide-react";
import { InspectionSection } from "@/components/inspector/InspectionSection";
import { EmptyInspectionState } from "@/components/inspector/EmptyInspectionState";
import { useInspections } from "@/hooks/useInspections";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const InspectorDashboard = () => {
  const navigate = useNavigate();
  const { 
    pendingInspections, 
    inProgressInspections, 
    recentCompletedInspections, 
    isLoading 
  } = useInspections();
  
  const totalInspections = pendingInspections.length + inProgressInspections.length + recentCompletedInspections.length;
  
  return (
    <InspectorLayout>
      <div className="space-y-6 pb-16">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Painel do Inspetor</h1>
            <p className="text-gray-500">Visualize e gerencie suas vistorias</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => navigate("/inspector/history")}
            >
              <History className="mr-2 h-4 w-4" />
              Histórico
            </Button>
            <Button 
              onClick={() => navigate("/inspector/schedule")}
            >
              <CalendarClock className="mr-2 h-4 w-4" />
              Agenda
            </Button>
          </div>
        </div>
        
        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Aguardando</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInspections.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Em andamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressInspections.length}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Concluídas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentCompletedInspections.length}</div>
            </CardContent>
          </Card>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-vistoria-blue"></div>
          </div>
        ) : totalInspections > 0 ? (
          <>
            {inProgressInspections.length > 0 && (
              <InspectionSection 
                title="Vistorias em andamento" 
                icon="inProgress"
                inspections={inProgressInspections}
              />
            )}
            
            {pendingInspections.length > 0 && (
              <InspectionSection 
                title="Vistorias pendentes" 
                icon="pending"
                inspections={pendingInspections}
              />
            )}
            
            {recentCompletedInspections.length > 0 && (
              <InspectionSection 
                title="Vistorias concluídas recentemente" 
                icon="completed"
                inspections={recentCompletedInspections}
                showViewAll
              />
            )}
          </>
        ) : (
          <EmptyInspectionState />
        )}
        
        {/* Mapa das vistorias (placeholder) */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Map className="mr-2 h-5 w-5" />
              Mapa de vistorias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 h-64 rounded-md flex items-center justify-center">
              <p className="text-gray-500">Mapa de vistorias será exibido aqui</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </InspectorLayout>
  );
};

export default InspectorDashboard;
