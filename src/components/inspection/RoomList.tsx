
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { RoomItemChecklist } from "./RoomItemChecklist";
import { InspectionRoom, InspectionItem } from "@/services/inspectionService/types";
import { toast } from "sonner";

interface RoomListProps {
  rooms: InspectionRoom[];
  onRoomNameChange: (roomId: string, name: string) => void;
  onRoomDelete: (roomId: string) => void;
  onAddItem: (roomId: string) => void;
  onItemUpdate: (roomId: string, itemId: string, updates: Partial<InspectionItem>) => void;
  onItemDelete: (roomId: string, itemId: string) => void;
}

export function RoomList({
  rooms,
  onRoomNameChange,
  onRoomDelete,
  onAddItem,
  onItemUpdate,
  onItemDelete,
}: RoomListProps) {
  const [expandedRooms, setExpandedRooms] = useState<string[]>([]);

  const toggleRoomExpansion = (roomId: string) => {
    setExpandedRooms((current) =>
      current.includes(roomId)
        ? current.filter((id) => id !== roomId)
        : [...current, roomId]
    );
  };

  const handleRoomNameChange = (roomId: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onRoomNameChange(roomId, e.target.value);
  };

  const handleDeleteRoom = (roomId: string) => () => {
    if (confirm("Tem certeza que deseja excluir este ambiente?")) {
      onRoomDelete(roomId);
      toast.success("Ambiente removido com sucesso");
    }
  };

  const handleAddItem = (roomId: string) => () => {
    onAddItem(roomId);
    toast.success("Item adicionado com sucesso");
  };

  return (
    <div className="space-y-3">
      {rooms.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          Nenhum ambiente adicionado. Use o botão "Adicionar Ambiente" abaixo.
        </div>
      ) : (
        <Accordion
          type="multiple"
          value={expandedRooms}
          className="space-y-3"
        >
          {rooms.map((room) => (
            <AccordionItem
              key={room.id}
              value={room.id}
              className="border rounded-lg overflow-hidden"
            >
              <AccordionTrigger
                onClick={(e) => {
                  e.preventDefault();
                  toggleRoomExpansion(room.id);
                }}
                className="px-4 py-2 hover:no-underline"
              >
                <div className="flex items-center gap-2 w-full">
                  <Input
                    value={room.name}
                    onChange={handleRoomNameChange(room.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-8 text-sm max-w-[200px]"
                  />
                  <span className="text-xs text-gray-500 ml-auto mr-4">
                    ({room.items?.filter((item) => item.state).length || 0}/
                    {room.items?.length || 0} verificados)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4 space-y-4">
                {room.items?.map((item) => (
                  <RoomItemChecklist
                    key={item.id}
                    item={item}
                    onUpdate={(updates) => onItemUpdate(room.id, item.id, updates)}
                    onDelete={() => onItemDelete(room.id, item.id)}
                  />
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={handleAddItem(room.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>

                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={handleDeleteRoom(room.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remover Ambiente
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}
