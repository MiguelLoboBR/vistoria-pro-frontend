
import React from "react";
import { Calendar, Hourglass, AlertTriangle, CheckCircle } from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case "agendada":
      return (
        <div className="flex items-center gap-1.5 text-blue-500 font-medium">
          <Calendar className="h-4 w-4" />
          <span>Agendada</span>
        </div>
      );
    case "atrasada":
      return (
        <div className="flex items-center gap-1.5 text-amber-500 font-medium">
          <Hourglass className="h-4 w-4" />
          <span>Atrasada</span>
        </div>
      );
    case "em_andamento":
      return (
        <div className="flex items-center gap-1.5 text-blue-500 font-medium">
          <AlertTriangle className="h-4 w-4" />
          <span>Em andamento</span>
        </div>
      );
    case "concluida":
      return (
        <div className="flex items-center gap-1.5 text-green-500 font-medium">
          <CheckCircle className="h-4 w-4" />
          <span>Concluída</span>
        </div>
      );
    default:
      return null;
  }
};
