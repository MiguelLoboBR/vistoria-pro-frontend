
import { useState } from "react";
import AdminLayout from "@/components/layouts/AdminLayout";
import { toast } from "sonner";
import { InspectionFilters } from "@/components/admin/inspections/InspectionFilters";
import { InspectionActions } from "@/components/admin/inspections/InspectionActions";
import { NewInspectionDialog } from "@/components/admin/inspections/NewInspectionDialog";
import { InspectionTable } from "@/components/admin/inspections/InspectionTable";
import { getStatusBadgeClass, getStatusLabel, MOCK_INSPECTIONS } from "@/components/admin/inspections/utils";

export const AdminInspections = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const filteredInspections = MOCK_INSPECTIONS.filter(inspection => {
    const matchesSearch = inspection.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inspection.inspector.toLowerCase().includes(searchTerm.toLowerCase());
                         
    const matchesStatus = !statusFilter || inspection.status === statusFilter;
    const matchesType = !typeFilter || inspection.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });
  
  const handleAddInspection = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Vistoria agendada com sucesso!");
    setIsAddDialogOpen(false);
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Vistorias</h1>
            <p className="text-gray-500">Gerenciamento de todas as vistorias realizadas e agendadas.</p>
          </div>
          
          <InspectionActions 
            isAddDialogOpen={isAddDialogOpen}
            setIsAddDialogOpen={setIsAddDialogOpen}
          />
        </div>
        
        <InspectionFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          typeFilter={typeFilter}
          setSearchTerm={setSearchTerm}
          setStatusFilter={setStatusFilter}
          setTypeFilter={setTypeFilter}
        />
        
        <InspectionTable 
          inspections={filteredInspections}
          getStatusBadgeClass={getStatusBadgeClass}
          getStatusLabel={getStatusLabel}
        />
        
        <NewInspectionDialog onSubmit={handleAddInspection} />
      </div>
    </AdminLayout>
  );
};

export default AdminInspections;
