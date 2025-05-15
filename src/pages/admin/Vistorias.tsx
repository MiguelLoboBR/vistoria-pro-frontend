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

const Vistorias = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inspectors, setInspectors] = useState<{ id: string, name: string }[]>([]);
  const { company, user } = useAuth();
  const { 
    filteredVistorias, 
    isLoading, 
    searchQuery, 
    setSearchQuery,
    setVistorias,
    setFilteredVistorias
  } = useVistorias();
  
  // Fetch inspectors for the company
  useEffect(() => {
    const fetchInspectors = async () => {
      if (!company) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("company_id", company.id)
          .eq("role", "inspector");
          
        if (error) throw error;
        
        setInspectors(data.map(i => ({ id: i.id, name: i.full_name || "Sem nome" })));
      } catch (error) {
        console.error("Error fetching inspectors:", error);
      }
    };
    
    fetchInspectors();
  }, [company]);

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
          const inspector = inspectors.find(i => i.id === values.inspector_id);
          if (inspector) {
            newInspection.inspector_name = inspector.name;
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
        inspectors={inspectors}
      />
    </AdminLayout>
  );
};

export default Vistorias;
