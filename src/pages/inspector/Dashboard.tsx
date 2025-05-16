
import { useNavigate } from "react-router-dom";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { EmptyInspectionState } from "@/components/inspector/EmptyInspectionState";
import { useInspections } from "@/hooks/useInspections";
import { WelcomePanel } from "@/components/inspector/dashboard/WelcomePanel";
import { StatusCards } from "@/components/inspector/dashboard/StatusCards";
import { InProgressInspections } from "@/components/inspector/dashboard/InProgressInspections";
import { PendingInspections } from "@/components/inspector/dashboard/PendingInspections";
import { CompletedInspections } from "@/components/inspector/dashboard/CompletedInspections";

export const InspectorDashboard = () => {
  const { 
    pendingInspections, 
    inProgressInspections, 
    recentCompletedInspections, 
    isLoading
  } = useInspections();
  
  const totalPending = pendingInspections.length;
  const totalInProgress = inProgressInspections.length;
  const totalCompleted = recentCompletedInspections.length;
  const hasInspections = totalPending > 0 || totalInProgress > 0 || totalCompleted > 0;

  return (
    <InspectorLayout>
      <div className="space-y-6 pb-16">
        {/* Welcome section with quick actions */}
        <WelcomePanel />
        
        {/* Status Cards */}
        <StatusCards 
          totalInProgress={totalInProgress} 
          totalPending={totalPending} 
          totalCompleted={totalCompleted} 
        />
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : hasInspections ? (
          <div className="space-y-6">
            {/* In Progress Inspections */}
            <InProgressInspections inspections={inProgressInspections} />
            
            {/* Upcoming Inspections */}
            <PendingInspections inspections={pendingInspections} />
            
            {/* Recent Completed Inspections */}
            <CompletedInspections inspections={recentCompletedInspections} />
          </div>
        ) : (
          <EmptyInspectionState />
        )}
      </div>
    </InspectorLayout>
  );
};

export default InspectorDashboard;
