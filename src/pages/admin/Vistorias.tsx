
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { inspectionService } from "@/services/inspectionService";
import { useVistorias } from "@/hooks/useVistorias";
import { InspectionActionButtons } from "@/components/admin/inspections/InspectionActionButtons";
import { SearchHeader } from "@/components/admin/inspections/SearchHeader";
import { InspectionList } from "@/components/admin/inspections/InspectionList";
import { VistoriaDialog } from "@/components/admin/inspections/VistoriaDialog";
import { InspectionFormValues } from "@/components/admin/inspections/NewInspectionForm";
import { useInspectors } from "@/hooks/useInspectors";

const Vistorias = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { company, user } = useAuth();
  const { 
    filteredVistorias, 
    isLoading, 
    searchQuery, 
    setSearchQuery,
    setVistorias,
    setFilteredVistorias
  } = useVistorias();
  
  // Use the useInspectors hook to fetch inspectors for the current company
  const { inspectors: companyInspectors, isLoadingInspectors } = useInspectors(company?.id);
  
  // Format inspectors for the dropdown
  const formattedInspectors = companyInspectors.map(inspector => ({
    id: inspector.id,
    name: inspector.full_name || inspector.email || "Sem nome"
  }));

  const handleSubmit = async (values: InspectionFormValues) => {
    if (!company || !user) {
      toast.error("Você precisa estar vinculado a uma empresa");
      return;
    }
    
    try {
      const inspectionData = {
        address: values.address,
        date: values.date,
        time: values.time,
        type: values.type,
        status: "agendada" as const,
        company_id: company.id,
        inspector_id: values.inspector_id || null
      };
      
      const newInspection = await inspectionService.createInspection(inspectionData);
      
      if (newInspection) {
        // Add the inspector name if we have the inspector data
        if (values.inspector_id) {
          const inspector = companyInspectors.find(i => i.id === values.inspector_id);
          if (inspector) {
            newInspection.inspector_name = inspector.full_name || inspector.email;
          }
        }
        
        setVistorias(prev => [newInspection, ...prev]);
        setFilteredVistorias(prev => [newInspection, ...prev]);
        toast.success("Vistoria criada com sucesso!");
        setDialogOpen(false);
      }
    } catch (error) {
      console.error("Error creating inspection:", error);
      toast.error("Erro ao criar vistoria");
    }
  };

  console.log("Vistorias page: Company ID:", company?.id);
  console.log("Vistorias page: Number of inspectors:", formattedInspectors.length);
  console.log("Vistorias page: Inspectors data:", formattedInspectors);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Vistorias</h1>
            <p className="text-gray-500">Gerencie as vistorias da sua empresa</p>
          </div>
          <InspectionActionButtons 
            variant="calendar" 
            onOpenDialog={() => setDialogOpen(true)} 
          />
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Vistorias</CardTitle>
              <SearchHeader 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            </div>
          </CardHeader>
          <CardContent>
            <InspectionList
              inspections={filteredVistorias}
              isLoading={isLoading}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery("")}
            />
          </CardContent>
        </Card>
      </div>
      
      <VistoriaDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        inspectors={formattedInspectors}
      />
    </AdminLayout>
  );
};

export default Vistorias;
