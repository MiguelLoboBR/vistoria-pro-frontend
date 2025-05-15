import { Inspection, InspectionRoom } from "@/services/inspectionService/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ReportGenerator } from "./ReportGenerator";

interface FinishTabContentProps {
  inspection: Inspection;
  rooms: InspectionRoom[];
  progress: number;
  responsibleName: string;
  qrCodeData: string | null;
  inspectorSignature: string | null;
  responsibleSignature: string | null;
  isOnline: boolean;
  onCompleteInspection: () => void;
  onInspectorSignatureClick: () => void;
  onResponsibleSignatureClick: () => void;
}

export const FinishTabContent = ({
  inspection,
  rooms,
  progress,
  responsibleName,
  qrCodeData,
  inspectorSignature,
  responsibleSignature,
  isOnline,
  onCompleteInspection,
  onInspectorSignatureClick,
  onResponsibleSignatureClick
}: FinishTabContentProps) => {
  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="space-y-4">
        <h3 className="font-medium">Resumo da Vistoria</h3>
        
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">ID:</span>
            <span className="font-medium">{inspection.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Data:</span>
            <span>{inspection.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tipo:</span>
            <span>{inspection.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Horário:</span>
            <span>{inspection.time || "--:--"}</span>
          </div>
          <div className="col-span-2 flex justify-between">
            <span className="text-gray-500">Endereço:</span>
            <span className="text-right">{inspection.address}</span>
          </div>
          {responsibleName && (
            <div className="col-span-2 flex justify-between">
              <span className="text-gray-500">Responsável:</span>
              <span className="text-right">{responsibleName}</span>
            </div>
          )}
          {qrCodeData && (
            <div className="col-span-2 flex justify-between">
              <span className="text-gray-500">QR Code:</span>
              <span className="text-right truncate max-w-[200px]">{qrCodeData}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Progresso do Checklist</h4>
          <div className="bg-gray-100 h-2 rounded-full">
            <div 
              className="bg-green-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>
              {rooms.reduce((total, room) => total + (room.items?.filter(item => item.state)?.length || 0), 0)} itens verificados
            </span>
            <span>{progress}% concluído</span>
          </div>
        </div>
      </div>
      
      {/* Signatures */}
      <div className="space-y-3">
        <h3 className="font-medium">Assinaturas</h3>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-500">Assinatura do Vistoriador <span className="text-red-500">*</span></span>
            {inspectorSignature && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 py-0 text-xs"
                onClick={onInspectorSignatureClick}
              >
                Alterar
              </Button>
            )}
          </div>
          
          {inspectorSignature ? (
            <div className="border rounded-md h-24 flex items-center justify-center p-2 bg-gray-50">
              <img src={inspectorSignature} alt="Assinatura do Vistoriador" className="max-h-full" />
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full h-24 border-2 border-dashed flex flex-col gap-1"
              onClick={onInspectorSignatureClick}
            >
              <span className="text-gray-400">Clique para assinar</span>
              <span className="text-xs text-gray-400">(obrigatório)</span>
            </Button>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-500">Assinatura do Responsável (opcional)</span>
            {responsibleSignature && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 px-2 py-0 text-xs"
                onClick={onResponsibleSignatureClick}
              >
                Alterar
              </Button>
            )}
          </div>
          
          {responsibleSignature ? (
            <div className="border rounded-md h-24 flex items-center justify-center p-2 bg-gray-50">
              <img src={responsibleSignature} alt="Assinatura do Responsável" className="max-h-full" />
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full h-24 border-2 border-dashed flex flex-col gap-1"
              onClick={onResponsibleSignatureClick}
            >
              <span className="text-gray-400">Clique para assinar</span>
              <span className="text-xs text-gray-400">(opcional)</span>
            </Button>
          )}
        </div>
      </div>
      
      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Gerar Relatório</CardTitle>
          <CardDescription>Gere um relatório PDF da vistoria</CardDescription>
        </CardHeader>
        <CardContent>
          {inspectorSignature && responsibleSignature ? (
            <ReportGenerator 
              inspection={inspection} 
              rooms={rooms} 
              inspectorSignature={inspectorSignature} 
              responsibleSignature={responsibleSignature}
              responsibleName={responsibleName}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              As duas assinaturas são necessárias para gerar o relatório.
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Complete Button */}
      <Button 
        onClick={onCompleteInspection} 
        disabled={!inspectorSignature || !isOnline}
        className="w-full"
      >
        Finalizar Vistoria
      </Button>
      
      {!isOnline && (
        <p className="text-amber-500 text-xs text-center">
          Você está offline. Conecte-se à internet para finalizar a vistoria.
        </p>
      )}
    </div>
  );
};
