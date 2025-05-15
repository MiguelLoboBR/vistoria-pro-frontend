
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface NewInspectionDialogProps {
  onSubmit: (e: React.FormEvent) => void;
}

export const NewInspectionDialog = ({ onSubmit }: NewInspectionDialogProps) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Agendar Nova Vistoria</DialogTitle>
        <DialogDescription>
          Preencha os dados para agendar uma nova vistoria.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" placeholder="Endereço completo do imóvel" />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Tipo de Vistoria</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Entrada">Entrada</SelectItem>
                <SelectItem value="Saída">Saída</SelectItem>
                <SelectItem value="Periódica">Periódica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Data</Label>
              <Input id="date" type="date" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Horário</Label>
              <Input id="time" type="time" />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="inspector">Vistoriador</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o vistoriador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inspector-1">João Silva</SelectItem>
                <SelectItem value="inspector-2">Maria Oliveira</SelectItem>
                <SelectItem value="inspector-3">Carlos Santos</SelectItem>
                <SelectItem value="inspector-4">Ana Pereira</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="submit">Agendar Vistoria</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
