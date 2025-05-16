
import { useNavigate } from "react-router-dom";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Button } from "@/components/ui/button";
import { 
  CalendarDays, 
  ClipboardList, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  MapPin,
  ArrowRight
} from "lucide-react";
import { InspectionCard } from "@/components/inspector/InspectionCard";
import { EmptyInspectionState } from "@/components/inspector/EmptyInspectionState";
import { useInspections } from "@/hooks/useInspections";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export const InspectorDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    pendingInspections, 
    inProgressInspections, 
    recentCompletedInspections, 
    isLoading,
    refetch 
  } = useInspections();
  
  const totalPending = pendingInspections.length;
  const totalInProgress = inProgressInspections.length;
  const totalCompleted = recentCompletedInspections.length;
  const hasInspections = totalPending > 0 || totalInProgress > 0 || totalCompleted > 0;

  // Function to format date from YYYY-MM-DD to DD/MM/YYYY
  const formatDate = (dateStr: string) => {
    try {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    } catch (e) {
      return dateStr;
    }
  };
  
  return (
    <InspectorLayout>
      <div className="space-y-6 pb-16">
        {/* Welcome section with quick actions */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="md:flex">
            <div className="p-6 flex-1">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-blue-100">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-blue-500 text-white text-lg">
                    {user?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || "IN"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">Olá, {user?.full_name?.split(" ")[0]}</h1>
                  <p className="text-gray-500">Bem-vindo ao seu painel de inspetor</p>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 p-6 md:w-80 border-t md:border-t-0 md:border-l border-gray-100">
              <h3 className="font-medium mb-2">Acesso rápido</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => navigate("/inspector/schedule")}
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Agenda
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start"
                  onClick={() => navigate("/inspector/inspections")}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Vistorias
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card 
            className={`border-l-4 ${totalInProgress > 0 ? 'border-l-blue-500' : 'border-l-gray-300'}`}
            onClick={totalInProgress > 0 ? () => navigate("/inspector/inspections?filter=inProgress") : undefined}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <AlertTriangle className="mr-2 h-4 w-4 text-blue-500" />
                Em andamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInProgress}</div>
              <p className="text-xs text-gray-500">Vistorias em progresso</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`border-l-4 ${totalPending > 0 ? 'border-l-amber-500' : 'border-l-gray-300'}`}
            onClick={totalPending > 0 ? () => navigate("/inspector/inspections?filter=pending") : undefined}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <Clock className="mr-2 h-4 w-4 text-amber-500" />
                Aguardando
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPending}</div>
              <p className="text-xs text-gray-500">Vistorias pendentes</p>
            </CardContent>
          </Card>
          
          <Card 
            className={`border-l-4 ${totalCompleted > 0 ? 'border-l-green-500' : 'border-l-gray-300'}`}
            onClick={totalCompleted > 0 ? () => navigate("/inspector/history") : undefined}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center text-sm font-medium">
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                Concluídas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompleted}</div>
              <p className="text-xs text-gray-500">Vistorias finalizadas recentes</p>
            </CardContent>
          </Card>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : hasInspections ? (
          <div className="space-y-6">
            {/* In Progress Inspections */}
            {totalInProgress > 0 && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-blue-500" />
                  Vistorias em andamento
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                  {inProgressInspections.map(inspection => (
                    <InspectionCard 
                      key={inspection.id} 
                      inspection={inspection}
                      variant="inProgress"
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Upcoming Inspections */}
            {totalPending > 0 && (
              <Card>
                <CardHeader className="bg-gray-50 py-4 px-6">
                  <CardTitle className="text-lg font-semibold">Próximas vistorias</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {pendingInspections.slice(0, 4).map((inspection) => (
                      <div key={inspection.id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center mb-1">
                              <Badge variant={inspection.status === 'atrasada' ? 'destructive' : 'outline'} className="mr-2">
                                {inspection.status === 'atrasada' ? 'Atrasada' : 'Agendada'}
                              </Badge>
                              <span className="text-sm font-medium">{inspection.type}</span>
                            </div>
                            <p className="font-medium truncate">{inspection.address}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <div className="flex items-center mr-4">
                                <Clock className="h-4 w-4 mr-1" />
                                {formatDate(inspection.date)}
                              </div>
                              {inspection.time && (
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {inspection.time}
                                </div>
                              )}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            onClick={() => navigate(`/inspector/execute/${inspection.id}`)}
                          >
                            Iniciar
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                {totalPending > 4 && (
                  <CardFooter className="bg-gray-50 border-t p-3">
                    <Button 
                      variant="link" 
                      className="ml-auto"
                      onClick={() => navigate("/inspector/inspections?filter=pending")}
                    >
                      Ver todas ({totalPending})
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )}
            
            {/* Recent Completed Inspections */}
            {totalCompleted > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                    Vistorias concluídas recentemente
                  </h2>
                  <Button 
                    variant="link" 
                    size="sm"
                    onClick={() => navigate("/inspector/history")}
                  >
                    Ver histórico
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
                  {recentCompletedInspections.map(inspection => (
                    <InspectionCard 
                      key={inspection.id} 
                      inspection={inspection}
                      variant="completed"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyInspectionState />
        )}
      </div>
    </InspectorLayout>
  );
};

export default InspectorDashboard;
