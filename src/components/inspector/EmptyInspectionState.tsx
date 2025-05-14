
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";

export const EmptyInspectionState = () => {
  return (
    <div className="text-center py-12 px-4">
      <div className="bg-gray-50 rounded-full w-16 h-16 mx-auto flex items-center justify-center mb-4">
        <CalendarClock className="h-8 w-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-medium mb-2">Nenhuma vistoria pendente</h2>
      <p className="text-gray-500 mb-6">Você não tem vistorias pendentes no momento.</p>
      <Button asChild>
        <Link to="/app/inspector/history">
          Ver histórico de vistorias
        </Link>
      </Button>
    </div>
  );
};
