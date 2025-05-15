
import { FilePlus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogTrigger 
} from "@/components/ui/dialog";

interface InspectionActionsProps {
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (value: boolean) => void;
}

export const InspectionActions = ({ isAddDialogOpen, setIsAddDialogOpen }: InspectionActionsProps) => {
  return (
    <div className="flex gap-3">
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <FilePlus className="mr-2 h-4 w-4" />
            Nova Vistoria
          </Button>
        </DialogTrigger>
      </Dialog>
      
      <Button variant="outline">
        <Download className="mr-2 h-4 w-4" />
        Exportar
      </Button>
    </div>
  );
};
