
import { Button } from "@/components/ui/button";

interface Inspection {
  id: string;
  address: string;
  type: string;
  date: string;
  inspector: string;
  status: string;
}

interface InspectionTableProps {
  inspections: Inspection[];
  getStatusBadgeClass: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

export const InspectionTable = ({
  inspections,
  getStatusBadgeClass,
  getStatusLabel
}: InspectionTableProps) => {
  return (
    <div className="rounded-md border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="py-3 px-4 text-left font-medium">ID</th>
              <th className="py-3 px-4 text-left font-medium">Endereço</th>
              <th className="py-3 px-4 text-left font-medium">Tipo</th>
              <th className="py-3 px-4 text-left font-medium">Data</th>
              <th className="py-3 px-4 text-left font-medium">Vistoriador</th>
              <th className="py-3 px-4 text-left font-medium">Status</th>
              <th className="py-3 px-4 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {inspections.length > 0 ? (
              inspections.map((inspection, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3 px-4 font-mono text-xs">{inspection.id}</td>
                  <td className="py-3 px-4">{inspection.address}</td>
                  <td className="py-3 px-4">{inspection.type}</td>
                  <td className="py-3 px-4">{inspection.date}</td>
                  <td className="py-3 px-4">{inspection.inspector}</td>
                  <td className="py-3 px-4">
                    <span className={getStatusBadgeClass(inspection.status)}>
                      {getStatusLabel(inspection.status)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Button variant="ghost" size="sm">
                      Detalhes
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 text-center text-gray-500">
                  Nenhuma vistoria encontrada com os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
