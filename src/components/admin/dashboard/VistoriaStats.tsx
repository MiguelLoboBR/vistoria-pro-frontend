
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Clock, AlertTriangle, Hourglass } from "lucide-react";
import { StatCard } from "./StatCard";
import { useVistoriaStats } from "@/hooks/useVistoriaStats";

export const VistoriaStats = () => {
  const { stats, isLoading } = useVistoriaStats();

  if (isLoading) {
    return <StatsLoading />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Vistorias Totais"
        value={stats?.total || 0}
        icon={<Clock className="h-4 w-4 text-gray-500" />}
        description="Total de vistorias cadastradas"
      />
      
      <StatCard 
        title="Agendadas"
        value={stats?.agendada || 0}
        icon={<Hourglass className="h-4 w-4 text-blue-500" />}
        description="Vistorias a serem realizadas"
        color="blue"
      />
      
      <StatCard 
        title="Em Andamento"
        value={stats?.emAndamento || 0}
        icon={<AlertTriangle className="h-4 w-4 text-yellow-500" />}
        description="Vistorias em execução"
        color="yellow"
      />
      
      <StatCard 
        title="Concluídas"
        value={stats?.concluida || 0}
        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        description="Vistorias finalizadas"
        color="green"
      />
    </div>
  );
};

const StatsLoading = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="space-y-2">
        <Skeleton className="h-[125px] w-full rounded-lg" />
      </div>
    ))}
  </div>
);
