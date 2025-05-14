
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { InspectionSection } from "@/components/inspector/InspectionSection";
import { EmptyInspectionState } from "@/components/inspector/EmptyInspectionState";
import { useInspections } from "@/hooks/useInspections";

export const InspectorDashboard = () => {
  const { pendingInspections, inProgressInspections, completedInspections, isLoading } = useInspections();
  
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
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-vistoria-blue"></div>
          </div>
        ) : (
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
                title="Concluídas recentemente" 
                icon="completed"
                inspections={completedInspections}
                showViewAll
              />
            )}
        
            {pendingInspections.length === 0 && inProgressInspections.length === 0 && (
              <EmptyInspectionState />
            )}
          </>
        )}
      </div>
    </InspectorLayout>
  );
};

export default InspectorDashboard;
