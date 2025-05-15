
import { Inspection, InspectionRoom, InspectionItem, InspectionMedia, InspectionSignature } from '../inspectionService/types';
import { getDB, STORES, initDatabase, addToStore, getFromStore, getAllFromStore } from './db';
import { addToSyncQueue } from './syncQueue';

// Get an inspection from the local database
const getInspectionLocally = async (id: string): Promise<Inspection | null> => {
  return await getFromStore<Inspection>(STORES.inspections, id);
};

// Save an inspection to the local database
const saveInspectionLocally = async (inspection: Inspection, isSynced = false): Promise<string> => {
  const inspectionToSave = { 
    ...inspection,
    _isSynced: isSynced 
  };
  
  const id = await addToStore(STORES.inspections, inspectionToSave);
  
  // Add to sync queue if not synced
  if (!isSynced) {
    await addToSyncQueue('inspections', 'update', inspection);
  }
  
  return id;
};

// Get rooms for an inspection from the local database
const getRoomsLocallyByInspectionId = async (inspectionId: string): Promise<InspectionRoom[]> => {
  const allRooms = await getAllFromStore<InspectionRoom>(STORES.rooms);
  return allRooms.filter(room => room.inspection_id === inspectionId);
};

// Save a room to the local database
const saveRoomLocally = async (room: InspectionRoom, isSynced = false): Promise<string> => {
  // Generate an ID if not present
  const roomToSave = { 
    ...room,
    id: room.id || `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    _isSynced: isSynced 
  };
  
  const id = await addToStore(STORES.rooms, roomToSave);
  
  // Add to sync queue if not synced
  if (!isSynced) {
    await addToSyncQueue('rooms', roomToSave.id.startsWith('local_') ? 'create' : 'update', roomToSave);
  }
  
  return id;
};

// Get items for a room from the local database
const getItemsLocallyByRoomId = async (roomId: string): Promise<InspectionItem[]> => {
  const allItems = await getAllFromStore<InspectionItem>(STORES.items);
  return allItems.filter(item => item.room_id === roomId);
};

// Save an item to the local database
const saveItemLocally = async (item: InspectionItem, isSynced = false): Promise<string> => {
  // Generate an ID if not present
  const itemToSave = { 
    ...item,
    id: item.id || `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    _isSynced: isSynced 
  };
  
  const id = await addToStore(STORES.items, itemToSave);
  
  // Add to sync queue if not synced
  if (!isSynced) {
    await addToSyncQueue('items', itemToSave.id.startsWith('local_') ? 'create' : 'update', itemToSave);
  }
  
  return id;
};

// Get media files for an item from the local database
const getMediaLocallyByItemId = async (itemId: string): Promise<InspectionMedia[]> => {
  const allMedia = await getAllFromStore<InspectionMedia>(STORES.medias);
  return allMedia.filter(media => media.item_id === itemId);
};

// Save a media to the local database
const saveMediaLocally = async (media: InspectionMedia, isSynced = false): Promise<string> => {
  // Generate an ID if not present
  const mediaToSave = { 
    ...media,
    id: media.id || `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    _isSynced: isSynced 
  };
  
  const id = await addToStore(STORES.medias, mediaToSave);
  
  // Add to sync queue if not synced
  if (!isSynced) {
    await addToSyncQueue('medias', mediaToSave.id.startsWith('local_') ? 'create' : 'update', mediaToSave);
  }
  
  return id;
};

// Get signatures for an inspection from the local database
const getSignaturesLocallyByInspectionId = async (inspectionId: string): Promise<InspectionSignature[]> => {
  const allSignatures = await getAllFromStore<InspectionSignature>(STORES.signatures);
  return allSignatures.filter(sig => sig.inspection_id === inspectionId);
};

// Save a signature to the local database
const saveSignatureLocally = async (signature: InspectionSignature, isSynced = false): Promise<string> => {
  // Generate an ID if not present
  const sigToSave = { 
    ...signature,
    id: signature.id || `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    _isSynced: isSynced 
  };
  
  const id = await addToStore(STORES.signatures, sigToSave);
  
  // Add to sync queue if not synced
  if (!isSynced) {
    await addToSyncQueue('signatures', 'create', sigToSave);
  }
  
  return id;
};

// Get complete inspection data locally (inspection, rooms, items, and signatures)
const getCompleteInspectionLocally = async (inspectionId: string): Promise<{
  inspection: Inspection | null;
  rooms: InspectionRoom[];
  signatures: InspectionSignature[];
}> => {
  const inspection = await getInspectionLocally(inspectionId);
  
  if (!inspection) {
    return {
      inspection: null,
      rooms: [],
      signatures: [],
    };
  }
  
  // Get all rooms
  const rooms = await getRoomsLocallyByInspectionId(inspectionId);
  
  // Get items for each room
  const roomsWithItems = await Promise.all(
    rooms.map(async room => {
      const items = await getItemsLocallyByRoomId(room.id);
      return {
        ...room,
        items,
      };
    })
  );
  
  // Get signatures
  const signatures = await getSignaturesLocallyByInspectionId(inspectionId);
  
  return {
    inspection,
    rooms: roomsWithItems,
    signatures,
  };
};

// Create the inspectionDataService object with all methods
const inspectionDataService = {
  getInspectionLocally,
  saveInspectionLocally,
  getRoomsLocallyByInspectionId,
  saveRoomLocally,
  getItemsLocallyByRoomId,
  saveItemLocally,
  getMediaLocallyByItemId,
  saveMediaLocally,
  getSignaturesLocallyByInspectionId,
  saveSignatureLocally,
  getCompleteInspectionLocally,
  init: async (db: any) => {
    console.log('Initializing inspection data service');
    return true;
  }
};

// Export both named and default exports for maximum compatibility
export { inspectionDataService };
export default inspectionDataService;

