
import React from "react";
import { StatusBadge } from "./StatusBadge";
import { formatDateTime } from "@/utils/dateUtils";
import { Inspection } from "@/services/inspectionService";
import { Button } from "@/components/ui/button";

interface InspectionListProps {
  inspections: Inspection[];
  isLoading: boolean;
  searchQuery: string;
  onClearSearch: () => void;
}

export const InspectionList = ({ 
  inspections, 
  isLoading, 
  searchQuery, 
  onClearSearch 
}: InspectionListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-vistoria-blue"></div>
      </div>
    );
  }
  
  if (inspections.length === 0) {
    return (
      <div className="text-center py-12">
        {searchQuery ? (
          <p className="text-gray-500">Nenhuma vistoria encontrada para "{searchQuery}"</p>
        ) : (
          <p className="text-gray-500">Nenhuma vistoria cadastrada. Adicione a primeira!</p>
        )}
        {searchQuery && (
          <Button variant="link" onClick={onClearSearch}>
            Limpar busca
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] py-3 px-4 border-b bg-gray-50 font-medium text-sm">
        <div>Detalhes</div>
        <div className="hidden md:block">Data</div>
        <div className="hidden md:block">Vistoriador</div>
        <div className="hidden md:block">Status</div>
      </div>
      <div className="divide-y">
        {inspections.map((vistoria) => (
          <div 
            key={vistoria.id} 
            className="grid grid-cols-1 md:grid-cols-[1fr_150px_150px_100px] py-3 px-4 hover:bg-gray-50 transition-colors"
          >
            <div className="space-y-1">
              <div className="font-medium text-sm">
                {vistoria.id.slice(0, 8)} - {vistoria.type}
              </div>
              <div className="text-sm text-gray-500">{vistoria.address}</div>
              <div className="md:hidden text-xs text-gray-500 flex items-center gap-1 mt-1">
                <span>{formatDateTime(vistoria.date, vistoria.time)}</span>
              </div>
              <div className="md:hidden mt-2">
                <StatusBadge status={vistoria.status} />
              </div>
              <div className="md:hidden text-xs text-gray-500 mt-1">{vistoria.inspector_name || "Não atribuído"}</div>
            </div>
            <div className="hidden md:flex md:items-center text-sm">
              {formatDateTime(vistoria.date, vistoria.time)}
            </div>
            <div className="hidden md:flex md:items-center text-sm">
              {vistoria.inspector_name || "Não atribuído"}
            </div>
            <div className="hidden md:flex md:items-center">
              <StatusBadge status={vistoria.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
