
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { InspectorForm, InspectorFormValues } from "@/components/admin/inspectors/InspectorForm";
import { InspectorTable } from "@/components/admin/inspectors/InspectorTable";
import { useInspectors } from "@/hooks/useInspectors";
import AdminLayout from "@/components/layouts/AdminLayout";

const Inspectors = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  
  const {
    inspectors,
    isLoadingInspectors,
    createInspector,
    isCreatingInspector,
    deleteInspector
  } = useInspectors(user?.company_id);
  
  const handleCreateInspector = (values: InspectorFormValues) => {
    createInspector({
      email: values.email,
      fullName: values.fullName,
      password: values.password
    }, {
      onSuccess: () => {
        setOpen(false);
      }
    });
  };
  
  console.log("Inspectors page: User company_id:", user?.company_id);
  console.log("Inspectors page: Number of inspectors:", inspectors?.length || 0);
  
  return (
    <AdminLayout>
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Inspetores</h1>
          
          {/* Only admins can add inspectors */}
          {(user?.role === 'admin_tenant' || user?.role === 'admin_master') && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Inspetor
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Adicionar Inspetor</DialogTitle>
                  <DialogDescription>
                    Crie um novo inspetor para sua empresa.
                  </DialogDescription>
                </DialogHeader>
                <InspectorForm 
                  onSubmit={handleCreateInspector} 
                  isLoading={isCreatingInspector}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        <InspectorTable 
          inspectors={inspectors} 
          isLoading={isLoadingInspectors} 
          onDelete={deleteInspector} 
        />
      </div>
    </AdminLayout>
  );
};

export default Inspectors;
