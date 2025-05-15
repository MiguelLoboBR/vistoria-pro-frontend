
import { Link } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserProfile } from "@/services/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface InspectorTableProps {
  inspectors: UserProfile[];
  isLoading: boolean;
  onDelete: (id: string) => void;
}

export const InspectorTable = ({ inspectors, isLoading, onDelete }: InspectorTableProps) => {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }
  
  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableCaption>Lista de inspetores da sua empresa.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspectors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                  Nenhum inspetor cadastrado
                </TableCell>
              </TableRow>
            ) : (
              inspectors.map((inspector) => (
                <TableRow key={inspector.id}>
                  <TableCell>{inspector.full_name}</TableCell>
                  <TableCell>{inspector.email}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/admin/inspectors/${inspector.id}`}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleDelete(inspector.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este inspetor? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
