
import { InspectionRoom, InspectionItem } from "@/services/inspectionService/types";
import { RoomList } from "./RoomList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RoomsTabContentProps {
  rooms: InspectionRoom[];
  onRoomNameChange: (roomId: string, name: string) => Promise<void>;
  onRoomDelete: (roomId: string) => Promise<void>;
  onAddItem: (roomId: string) => Promise<void>;
  onItemUpdate: (roomId: string, itemId: string, updates: Partial<InspectionItem>) => Promise<void>;
  onItemDelete: (roomId: string, itemId: string) => Promise<void>;
  onAddRoom: () => Promise<void>;
}

export const RoomsTabContent = ({
  rooms,
  onRoomNameChange,
  onRoomDelete,
  onAddItem,
  onItemUpdate,
  onItemDelete,
  onAddRoom,
}: RoomsTabContentProps) => {
  return (
    <div className="space-y-4">
      <RoomList
        rooms={rooms}
        onRoomNameChange={onRoomNameChange}
        onRoomDelete={onRoomDelete}
        onAddItem={onAddItem}
        onItemUpdate={onItemUpdate}
        onItemDelete={onItemDelete}
      />
      
      <Button 
        onClick={onAddRoom} 
        className="w-full"
        variant="outline"
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Ambiente
      </Button>
    </div>
  );
};
