
import { Button } from "@/components/ui/button";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { ArrowLeft } from "lucide-react";

interface InspectionNotFoundProps {
  onBackClick: () => void;
}

export const InspectionNotFound = ({ onBackClick }: InspectionNotFoundProps) => {
  return (
    <InspectorLayout>
      <div className="flex flex-col items-center justify-center py-12">
        <h1 className="text-xl font-bold mb-2">Vistoria não encontrada</h1>
        <p className="text-gray-500 mb-4">Não foi possível encontrar os dados desta vistoria.</p>
        <Button onClick={onBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Dashboard
        </Button>
      </div>
    </InspectorLayout>
  );
};
