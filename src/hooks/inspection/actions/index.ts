
import { useItemActions } from './useItemActions';
import { useRoomActions } from './useRoomActions';
import { useInspectionFinalization } from './useInspectionFinalization';
import { Inspection, InspectionRoom } from "@/services/inspectionService/types";

/**
 * Main hook that combines all inspection action functionality
 */
export const useInspectionActions = (
  inspection: Inspection | null,
  rooms: InspectionRoom[],
  setRooms: React.Dispatch<React.SetStateAction<InspectionRoom[]>>,
  inspectorSignature: string | null
) => {
  // Use more specialized hooks
  const roomActions = useRoomActions(setRooms);
  const itemActions = useItemActions(setRooms);
  const finalizationActions = useInspectionFinalization(inspection, inspectorSignature);
  
  // Handle room operations
  const handleRoomNameChange = roomActions.handleRoomNameChange;
  const handleRoomDelete = roomActions.handleRoomDelete;
  
  // Wrap handleAddRoom to include inspection.id
  const handleAddRoom = async () => {
    if (inspection) {
      await roomActions.handleAddRoom(inspection.id, rooms);
    }
  };
  
  // Return the combined actions
  return {
    // Room actions
    handleRoomNameChange,
    handleRoomDelete,
    handleAddRoom,
    
    // Item actions
    handleAddItem: itemActions.handleAddItem,
    handleItemUpdate: itemActions.handleItemUpdate,
    handleItemDelete: itemActions.handleItemDelete,
    
    // Finalization actions
    handleSaveProgress: finalizationActions.handleSaveProgress,
    handleCompleteInspection: finalizationActions.handleCompleteInspection,
  };
};

// Export sub-hooks for direct use if needed
export { useRoomActions, useItemActions, useInspectionFinalization };
