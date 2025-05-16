
import { useNavigate } from "react-router-dom";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Button } from "@/components/ui/button";
import { 
  CalendarClock, 
  Map, 
  History, 
  ArrowRight, 
  Clock, 
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { InspectionSection } from "@/components/inspector/InspectionSection";
import { EmptyInspectionState } from "@/components/inspector/EmptyInspectionState";
import { useInspections } from "@/hooks/useInspections";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

export const InspectorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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
        {/* Welcome section with avatar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-blue-100">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="bg-blue-500 text-white text-xl">
                  {user?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "IN"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">Olá, {user?.full_name?.split(" ")[0]}</h1>
                <p className="text-gray-500">Bem-vindo ao seu painel de inspetor</p>
              </div>
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
        </div>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-l-4 border-l-yellow-400">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-gray-500">
                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                Aguardando
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingInspections.length}</div>
              <p className="text-xs text-gray-500">Vistorias pendentes</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-l-4 border-l-blue-400">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-gray-500">
                <AlertTriangle className="mr-2 h-4 w-4 text-blue-500" />
                Em andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressInspections.length}</div>
              <p className="text-xs text-gray-500">Vistorias em progresso</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-l-4 border-l-green-400">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium text-gray-500">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Concluídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentCompletedInspections.length}</div>
              <p className="text-xs text-gray-500">Vistorias finalizadas recentes</p>
            </CardContent>
          </Card>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
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
              <Card className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-lg font-medium">Próximas vistorias</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {pendingInspections.slice(0, 3).map((inspection) => (
                      <div key={inspection.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{inspection.address}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Clock className="h-4 w-4 mr-1" />
                              {inspection.date}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => navigate(`/inspector/inspection/${inspection.id}`)}
                          >
                            Ver detalhes
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                {pendingInspections.length > 3 && (
                  <CardFooter className="bg-gray-50 border-t p-3">
                    <Button 
                      variant="link" 
                      className="ml-auto"
                      onClick={() => navigate("/inspector/inspections")}
                    >
                      Ver todas ({pendingInspections.length})
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
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
        
        {/* Mapa das vistorias */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Map className="mr-2 h-5 w-5" />
              Mapa de vistorias hoje
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
