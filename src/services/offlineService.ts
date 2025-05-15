
import { openDB, IDBPDatabase } from 'idb';
import { toast } from 'sonner';
import { inspectionService } from './inspectionService';
import { 
  Inspection, 
  InspectionRoom, 
  InspectionItem, 
  InspectionMedia, 
  InspectionSignature 
} from './inspectionService/types';

// Database name and version
const DB_NAME = 'inspections_offline_db';
const DB_VERSION = 1;

// Store names
const STORES = {
  inspections: 'inspections',
  rooms: 'rooms',
  items: 'items',
  medias: 'medias',
  signatures: 'signatures',
  syncQueue: 'syncQueue',
};

// Sync queue action types
export type SyncAction = {
  id: string;
  table: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
};

// Database reference
let db: IDBPDatabase | null = null;

// Returns true if the app is online
export const isOnline = () => navigator.onLine;

// Initialize the offline service
export const initOfflineService = async (): Promise<void> => {
  if (db) return;
  
  try {
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create object stores
        if (!db.objectStoreNames.contains(STORES.inspections)) {
          db.createObjectStore(STORES.inspections, { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains(STORES.rooms)) {
          db.createObjectStore(STORES.rooms, { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains(STORES.items)) {
          db.createObjectStore(STORES.items, { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains(STORES.medias)) {
          db.createObjectStore(STORES.medias, { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains(STORES.signatures)) {
          const signaturesStore = db.createObjectStore(STORES.signatures, { keyPath: 'id' });
          signaturesStore.createIndex('by_inspection_signer', ['inspection_id', 'signer'], { unique: true });
        }
        
        if (!db.objectStoreNames.contains(STORES.syncQueue)) {
          db.createObjectStore(STORES.syncQueue, { keyPath: 'id', autoIncrement: true });
        }
      },
    });
    
    console.log('IndexedDB initialized successfully');
    
    // Set up online listener to process sync queue
    window.addEventListener('online', processSyncQueue);
  } catch (error) {
    console.error('Error initializing IndexedDB:', error);
    toast.error('Erro ao inicializar armazenamento offline');
  }
};

// Process the sync queue when online
export const processSyncQueue = async (): Promise<void> => {
  if (!isOnline() || !db) return;
  
  try {
    const syncActions = await db.getAll(STORES.syncQueue);
    
    if (syncActions.length === 0) return;
    
    toast.info(`Sincronizando ${syncActions.length} alterações...`);
    
    // Sort by timestamp to ensure operations happen in the right order
    syncActions.sort((a, b) => a.timestamp - b.timestamp);
    
    for (const action of syncActions) {
      try {
        switch (action.table) {
          case 'inspections':
            await syncInspection(action);
            break;
          case 'rooms':
            await syncRoom(action);
            break;
          case 'items':
            await syncItem(action);
            break;
          case 'medias':
            await syncMedia(action);
            break;
          case 'signatures':
            await syncSignature(action);
            break;
        }
        
        // Remove processed action from queue
        if (db) {
          await db.delete(STORES.syncQueue, action.id);
        }
      } catch (error) {
        console.error(`Error processing sync action ${action.id}:`, error);
        // Continue with next action
      }
    }
    
    toast.success('Sincronização concluída com sucesso!');
  } catch (error) {
    console.error('Error processing sync queue:', error);
    toast.error('Erro ao sincronizar dados');
  }
};

// Sync an inspection
const syncInspection = async (action: SyncAction): Promise<void> => {
  switch (action.action) {
    case 'create':
      await inspectionService.createInspection(action.data);
      break;
    case 'update':
      await inspectionService.updateInspection(action.data.id, action.data);
      break;
    case 'delete':
      await inspectionService.deleteInspection(action.data.id);
      break;
  }
};

// Sync a room
const syncRoom = async (action: SyncAction): Promise<void> => {
  switch (action.action) {
    case 'create':
      await inspectionService.createRoom(action.data);
      break;
    case 'update':
      await inspectionService.updateRoom(action.data.id, action.data);
      break;
    case 'delete':
      await inspectionService.deleteRoom(action.data.id);
      break;
  }
};

// Sync an item
const syncItem = async (action: SyncAction): Promise<void> => {
  switch (action.action) {
    case 'create':
      await inspectionService.createItem(action.data);
      break;
    case 'update':
      await inspectionService.updateItem(action.data.id, action.data);
      break;
    case 'delete':
      await inspectionService.deleteItem(action.data.id);
      break;
  }
};

// Sync a media
const syncMedia = async (action: SyncAction): Promise<void> => {
  switch (action.action) {
    case 'create':
      await inspectionService.createMedia(action.data);
      break;
    case 'delete':
      await inspectionService.deleteMedia(action.data.id);
      break;
  }
};

// Sync a signature
const syncSignature = async (action: SyncAction): Promise<void> => {
  if (action.action === 'create' || action.action === 'update') {
    await inspectionService.createSignature(action.data);
  }
};

// Get an inspection from the local database
export const getInspectionLocally = async (id: string): Promise<Inspection | null> => {
  if (!db) await initOfflineService();
  
  try {
    return await db?.get(STORES.inspections, id) || null;
  } catch (error) {
    console.error('Error getting local inspection:', error);
    return null;
  }
};

// Save an inspection to the local database
export const saveInspectionLocally = async (inspection: Inspection, isSynced = false): Promise<string> => {
  if (!db) await initOfflineService();
  
  try {
    await db?.put(STORES.inspections, { 
      ...inspection,
      _isSynced: isSynced 
    });
    
    // Add to sync queue if not synced
    if (!isSynced) {
      await addToSyncQueue('inspections', 'update', inspection);
    }
    
    return inspection.id;
  } catch (error) {
    console.error('Error saving local inspection:', error);
    toast.error('Erro ao salvar vistoria localmente');
    return '';
  }
};

// Get rooms for an inspection from the local database
export const getRoomsLocallyByInspectionId = async (inspectionId: string): Promise<InspectionRoom[]> => {
  if (!db) await initOfflineService();
  
  try {
    const allRooms = await db?.getAll(STORES.rooms) || [];
    return allRooms.filter(room => room.inspection_id === inspectionId);
  } catch (error) {
    console.error('Error getting local rooms:', error);
    return [];
  }
};

// Save a room to the local database
export const saveRoomLocally = async (room: InspectionRoom, isSynced = false): Promise<string> => {
  if (!db) await initOfflineService();
  
  try {
    // Generate an ID if not present
    const roomToSave = { 
      ...room,
      id: room.id || `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      _isSynced: isSynced 
    };
    
    await db?.put(STORES.rooms, roomToSave);
    
    // Add to sync queue if not synced
    if (!isSynced) {
      await addToSyncQueue('rooms', roomToSave.id.startsWith('local_') ? 'create' : 'update', roomToSave);
    }
    
    return roomToSave.id;
  } catch (error) {
    console.error('Error saving local room:', error);
    toast.error('Erro ao salvar ambiente localmente');
    return '';
  }
};

// Get items for a room from the local database
export const getItemsLocallyByRoomId = async (roomId: string): Promise<InspectionItem[]> => {
  if (!db) await initOfflineService();
  
  try {
    const allItems = await db?.getAll(STORES.items) || [];
    return allItems.filter(item => item.room_id === roomId);
  } catch (error) {
    console.error('Error getting local items:', error);
    return [];
  }
};

// Save an item to the local database
export const saveItemLocally = async (item: InspectionItem, isSynced = false): Promise<string> => {
  if (!db) await initOfflineService();
  
  try {
    // Generate an ID if not present
    const itemToSave = { 
      ...item,
      id: item.id || `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      _isSynced: isSynced 
    };
    
    await db?.put(STORES.items, itemToSave);
    
    // Add to sync queue if not synced
    if (!isSynced) {
      await addToSyncQueue('items', itemToSave.id.startsWith('local_') ? 'create' : 'update', itemToSave);
    }
    
    return itemToSave.id;
  } catch (error) {
    console.error('Error saving local item:', error);
    toast.error('Erro ao salvar item localmente');
    return '';
  }
};

// Get media files for an item from the local database
export const getMediaLocallyByItemId = async (itemId: string): Promise<InspectionMedia[]> => {
  if (!db) await initOfflineService();
  
  try {
    const allMedia = await db?.getAll(STORES.medias) || [];
    return allMedia.filter(media => media.item_id === itemId);
  } catch (error) {
    console.error('Error getting local media:', error);
    return [];
  }
};

// Save a media to the local database
export const saveMediaLocally = async (media: InspectionMedia, isSynced = false): Promise<string> => {
  if (!db) await initOfflineService();
  
  try {
    // Generate an ID if not present
    const mediaToSave = { 
      ...media,
      id: media.id || `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      _isSynced: isSynced 
    };
    
    await db?.put(STORES.medias, mediaToSave);
    
    // Add to sync queue if not synced
    if (!isSynced) {
      await addToSyncQueue('medias', mediaToSave.id.startsWith('local_') ? 'create' : 'update', mediaToSave);
    }
    
    return mediaToSave.id;
  } catch (error) {
    console.error('Error saving local media:', error);
    toast.error('Erro ao salvar mídia localmente');
    return '';
  }
};

// Get signatures for an inspection from the local database
export const getSignaturesLocallyByInspectionId = async (inspectionId: string): Promise<InspectionSignature[]> => {
  if (!db) await initOfflineService();
  
  try {
    const allSignatures = await db?.getAll(STORES.signatures) || [];
    return allSignatures.filter(sig => sig.inspection_id === inspectionId);
  } catch (error) {
    console.error('Error getting local signatures:', error);
    return [];
  }
};

// Save a signature to the local database
export const saveSignatureLocally = async (signature: InspectionSignature, isSynced = false): Promise<string> => {
  if (!db) await initOfflineService();
  
  try {
    // Generate an ID if not present
    const sigToSave = { 
      ...signature,
      id: signature.id || `local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      _isSynced: isSynced 
    };
    
    await db?.put(STORES.signatures, sigToSave);
    
    // Add to sync queue if not synced
    if (!isSynced) {
      await addToSyncQueue('signatures', 'create', sigToSave);
    }
    
    return sigToSave.id;
  } catch (error) {
    console.error('Error saving local signature:', error);
    toast.error('Erro ao salvar assinatura localmente');
    return '';
  }
};

// Add an item to the sync queue
export const addToSyncQueue = async (table: string, action: 'create' | 'update' | 'delete', data: any): Promise<void> => {
  if (!db) await initOfflineService();
  
  try {
    const queueItem: SyncAction = {
      id: `${table}_${data.id}_${Date.now()}`,
      table,
      action,
      data,
      timestamp: Date.now(),
    };
    
    await db?.put(STORES.syncQueue, queueItem);
  } catch (error) {
    console.error('Error adding to sync queue:', error);
  }
};

// Delete an item from a store
export const deleteLocally = async (storeName: string, id: string): Promise<void> => {
  if (!db) await initOfflineService();
  
  try {
    await db?.delete(storeName, id);
  } catch (error) {
    console.error(`Error deleting from ${storeName}:`, error);
  }
};

// Get complete inspection data locally (inspection, rooms, items, and signatures)
export const getCompleteInspectionLocally = async (inspectionId: string): Promise<{
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

export const offlineService = {
  initOfflineService,
  isOnline,
  processSyncQueue,
  saveInspectionLocally,
  saveRoomLocally,
  saveItemLocally,
  saveMediaLocally,
  saveSignatureLocally,
  getCompleteInspectionLocally,
};
