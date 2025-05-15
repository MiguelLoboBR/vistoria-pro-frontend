
import { Skeleton } from "@/components/ui/skeleton";
import InspectorLayout from "@/components/layouts/InspectorLayout";

export const InspectionLoadingState = () => {
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
};
