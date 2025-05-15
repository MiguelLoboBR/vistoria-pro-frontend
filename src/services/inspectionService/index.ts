
import { createInspection } from './createInspection';
import { 
  getCompanyInspections, 
  getInspectorInspections,
  getInspectionById 
} from './getInspections';
import { updateInspection } from './updateInspection';
import { deleteInspection } from './deleteInspection';
import { getCompanyStats } from './getStats';

// Import room services
import {
  getRoomsByInspectionId,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomWithItems
} from './roomService';

// Import item services
import {
  getItemsByRoomId,
  createItem,
  updateItem,
  deleteItem,
  getItemWithMedia
} from './itemService';

// Import media services
import {
  getMediasByItemId,
  createMedia,
  uploadMedia,
  deleteMedia
} from './mediaService';

// Import signature services
import {
  getSignaturesByInspectionId,
  createSignature,
  getSignature
} from './signatureService';

// Export types
export type { Inspection } from './types';
export type { InspectionStats } from './types';
export type { InspectionRoom } from './types';
export type { InspectionItem } from './types';
export type { InspectionMedia } from './types';
export type { InspectionSignature } from './types';

// Main inspection service export
export const inspectionService = {
  // Core inspection methods
  createInspection,
  getCompanyInspections,
  getInspectorInspections,
  getInspectionById,
  updateInspection,
  deleteInspection,
  getCompanyStats,
  
  // Room methods
  getRoomsByInspectionId,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomWithItems,
  
  // Item methods
  getItemsByRoomId,
  createItem,
  updateItem,
  deleteItem,
  getItemWithMedia,
  
  // Media methods
  getMediasByItemId,
  createMedia,
  uploadMedia,
  deleteMedia,
  
  // Signature methods
  getSignaturesByInspectionId,
  createSignature,
  getSignature
};
