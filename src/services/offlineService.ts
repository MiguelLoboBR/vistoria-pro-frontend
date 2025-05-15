
import { openDB, IDBPDatabase } from 'idb';
import { 
  Inspection,
  InspectionRoom,
  InspectionItem,
  InspectionMedia,
  InspectionSignature 
} from './inspectionService/types';
import { inspectionService } from './inspectionService';
import { toast } from 'sonner';

// Database name and version
const DB_NAME = 'inspection_offline_db';
const DB_VERSION = 1;

// Store names
const STORES = {
  INSPECTIONS: 'inspections',
  ROOMS: 'rooms',
  ITEMS: 'items',
  MEDIAS: 'medias',
  SIGNATURES: 'signatures',
  SYNC_QUEUE: 'sync_queue'
};

// Define a type for objects in the sync queue
type SyncQueueItem = {
  id: string;
  table: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  is_synced: boolean;
};

// Initialize the IndexedDB database
const initDB = async (): Promise<IDBPDatabase> => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Inspections store
      if (!db.objectStoreNames.contains(STORES.INSPECTIONS)) {
        const inspectionStore = db.createObjectStore(STORES.INSPECTIONS, { keyPath: 'id' });
        inspectionStore.createIndex('company_id', 'company_id', { unique: false });
        inspectionStore.createIndex('inspector_id', 'inspector_id', { unique: false });
        inspectionStore.createIndex('status', 'status', { unique: false });
      }
      
      // Rooms store
      if (!db.objectStoreNames.contains(STORES.ROOMS)) {
        const roomStore = db.createObjectStore(STORES.ROOMS, { keyPath: 'id' });
        roomStore.createIndex('inspection_id', 'inspection_id', { unique: false });
      }
      
      // Items store
      if (!db.objectStoreNames.contains(STORES.ITEMS)) {
        const itemStore = db.createObjectStore(STORES.ITEMS, { keyPath: 'id' });
        itemStore.createIndex('room_id', 'room_id', { unique: false });
      }
      
      // Medias store
      if (!db.objectStoreNames.contains(STORES.MEDIAS)) {
        const mediaStore = db.createObjectStore(STORES.MEDIAS, { keyPath: 'id' });
        mediaStore.createIndex('item_id', 'item_id', { unique: false });
        mediaStore.createIndex('is_uploaded', 'is_uploaded', { unique: false });
      }
      
      // Signatures store
      if (!db.objectStoreNames.contains(STORES.SIGNATURES)) {
        const signatureStore = db.createObjectStore(STORES.SIGNATURES, { keyPath: 'id' });
        signatureStore.createIndex('inspection_id', 'inspection_id', { unique: false });
      }
      
      // Sync queue store
      if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
        const queueStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id', autoIncrement: true });
        queueStore.createIndex('is_synced', 'is_synced', { unique: false });
        queueStore.createIndex('table', 'table', { unique: false });
      }
    }
  });
};

// Check if network is available
const isOnline = (): boolean => {
  return navigator.onLine;
};

// Save an inspection with all its related data to local DB
const saveInspectionLocally = async (inspection: Inspection): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(STORES.INSPECTIONS, 'readwrite');
  await tx.store.put({
    ...inspection,
    is_synced: true // Already exists in remote DB
  });
  await tx.done;
};

// Save a room to local DB
const saveRoomLocally = async (room: InspectionRoom, isSync = false): Promise<string> => {
  const db = await initDB();
  const tx = db.transaction(STORES.ROOMS, 'readwrite');
  
  // If no id, generate a temporary one
  if (!room.id) {
    room.id = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Mark whether the record is synced with the server
  const roomWithSyncFlag = {
    ...room,
    is_synced: isSync
  };
  
  await tx.store.put(roomWithSyncFlag);
  await tx.done;
  
  // If we're online and it's not already synced, add to sync queue
  if (isOnline() && !isSync) {
    await addToSyncQueue(STORES.ROOMS, 'create', roomWithSyncFlag);
  }
  
  return room.id;
};

// Save an item to local DB
const saveItemLocally = async (item: InspectionItem, isSync = false): Promise<string> => {
  const db = await initDB();
  const tx = db.transaction(STORES.ITEMS, 'readwrite');
  
  // If no id, generate a temporary one
  if (!item.id) {
    item.id = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Mark whether the record is synced with the server
  const itemWithSyncFlag = {
    ...item,
    is_synced: isSync
  };
  
  await tx.store.put(itemWithSyncFlag);
  await tx.done;
  
  // If we're online and it's not already synced, add to sync queue
  if (isOnline() && !isSync) {
    await addToSyncQueue(STORES.ITEMS, 'create', itemWithSyncFlag);
  }
  
  return item.id;
};

// Save media to local DB
const saveMediaLocally = async (media: InspectionMedia, file?: File): Promise<string> => {
  const db = await initDB();
  const tx = db.transaction(STORES.MEDIAS, 'readwrite');
  
  // If no id, generate a temporary one
  if (!media.id) {
    media.id = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Store file data URL if provided
  let fileDataUrl: string | null = null;
  if (file) {
    fileDataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
  
  const mediaWithFile = {
    ...media,
    local_file_data: fileDataUrl,
    is_uploaded: false
  };
  
  await tx.store.put(mediaWithFile);
  await tx.done;
  
  // Add to sync queue if we're online
  if (isOnline()) {
    await addToSyncQueue(STORES.MEDIAS, 'create', mediaWithFile);
  }
  
  return media.id;
};

// Save signature to local DB
const saveSignatureLocally = async (signature: InspectionSignature, isSync = false): Promise<string> => {
  const db = await initDB();
  const tx = db.transaction(STORES.SIGNATURES, 'readwrite');
  
  // If no id, generate a temporary one
  if (!signature.id) {
    signature.id = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Mark whether the record is synced with the server
  const signatureWithSyncFlag = {
    ...signature,
    is_synced: isSync
  };
  
  await tx.store.put(signatureWithSyncFlag);
  await tx.done;
  
  // If we're online and it's not already synced, add to sync queue
  if (isOnline() && !isSync) {
    await addToSyncQueue(STORES.SIGNATURES, 'create', signatureWithSyncFlag);
  }
  
  return signature.id;
};

// Get an inspection by ID from local DB
const getInspectionLocally = async (id: string): Promise<Inspection | null> => {
  const db = await initDB();
  return db.get(STORES.INSPECTIONS, id);
};

// Get rooms by inspection ID from local DB
const getRoomsByInspectionLocally = async (inspectionId: string): Promise<InspectionRoom[]> => {
  const db = await initDB();
  const tx = db.transaction(STORES.ROOMS, 'readonly');
  const index = tx.store.index('inspection_id');
  return index.getAll(inspectionId);
};

// Get items by room ID from local DB
const getItemsByRoomLocally = async (roomId: string): Promise<InspectionItem[]> => {
  const db = await initDB();
  const tx = db.transaction(STORES.ITEMS, 'readonly');
  const index = tx.store.index('room_id');
  return index.getAll(roomId);
};

// Get medias by item ID from local DB
const getMediasByItemLocally = async (itemId: string): Promise<InspectionMedia[]> => {
  const db = await initDB();
  const tx = db.transaction(STORES.MEDIAS, 'readonly');
  const index = tx.store.index('item_id');
  return index.getAll(itemId);
};

// Get signatures by inspection ID from local DB
const getSignaturesByInspectionLocally = async (inspectionId: string): Promise<InspectionSignature[]> => {
  const db = await initDB();
  const tx = db.transaction(STORES.SIGNATURES, 'readonly');
  const index = tx.store.index('inspection_id');
  return index.getAll(inspectionId);
};

// Add an operation to the sync queue
const addToSyncQueue = async (table: string, action: 'create' | 'update' | 'delete', data: any): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
  
  const queueItem: Omit<SyncQueueItem, 'id'> = {
    table,
    action,
    data,
    timestamp: Date.now(),
    is_synced: false
  };
  
  await tx.store.add(queueItem);
  await tx.done;
};

// Process the sync queue when online
const processSyncQueue = async (): Promise<void> => {
  if (!isOnline()) {
    return;
  }
  
  const db = await initDB();
  const tx = db.transaction(STORES.SYNC_QUEUE, 'readonly');
  const index = tx.store.index('is_synced');
  const unsyncedItems = await index.getAll(false);
  await tx.done;
  
  // Sort by timestamp to process in order
  unsyncedItems.sort((a, b) => a.timestamp - b.timestamp);
  
  for (const item of unsyncedItems) {
    try {
      await syncItem(item);
    } catch (error) {
      console.error('Error syncing item:', error, item);
    }
  }
};

// Sync a single item with the server
const syncItem = async (item: SyncQueueItem): Promise<void> => {
  try {
    switch (item.table) {
      case STORES.ROOMS:
        if (item.action === 'create') {
          const { id, is_synced, ...roomData } = item.data;
          const newId = await inspectionService.createRoom(roomData);
          await updateSyncedItem(item.id, true);
          await updateLocalItemId(STORES.ROOMS, id, newId);
        } else if (item.action === 'update') {
          const { is_synced, ...roomData } = item.data;
          await inspectionService.updateRoom(roomData.id, roomData);
          await updateSyncedItem(item.id, true);
        } else if (item.action === 'delete') {
          await inspectionService.deleteRoom(item.data.id);
          await updateSyncedItem(item.id, true);
          await deleteLocalItem(STORES.ROOMS, item.data.id);
        }
        break;
        
      case STORES.ITEMS:
        if (item.action === 'create') {
          const { id, is_synced, ...itemData } = item.data;
          const newId = await inspectionService.createItem(itemData);
          await updateSyncedItem(item.id, true);
          await updateLocalItemId(STORES.ITEMS, id, newId);
        } else if (item.action === 'update') {
          const { is_synced, ...itemData } = item.data;
          await inspectionService.updateItem(itemData.id, itemData);
          await updateSyncedItem(item.id, true);
        } else if (item.action === 'delete') {
          await inspectionService.deleteItem(item.data.id);
          await updateSyncedItem(item.id, true);
          await deleteLocalItem(STORES.ITEMS, item.data.id);
        }
        break;
        
      case STORES.MEDIAS:
        if (item.action === 'create') {
          const { id, is_synced, local_file_data, is_uploaded, ...mediaData } = item.data;
          
          // Convert data URL to File if we have local data
          if (local_file_data) {
            const response = await fetch(local_file_data);
            const blob = await response.blob();
            const file = new File(
              [blob], 
              `${mediaData.type === 'foto' ? 'photo' : 'video'}.${mediaData.type === 'foto' ? 'jpg' : 'webm'}`, 
              { type: mediaData.type === 'foto' ? 'image/jpeg' : 'video/webm' }
            );
            
            // Upload the file to storage
            const url = await inspectionService.uploadMedia(
              file, 
              `inspection-${mediaData.type === 'foto' ? 'photos' : 'videos'}/${mediaData.item_id}`
            );
            
            if (url) {
              mediaData.url = url;
            }
          }
          
          const newId = await inspectionService.createMedia(mediaData);
          await updateSyncedItem(item.id, true);
          await updateLocalItemId(STORES.MEDIAS, id, newId);
          
          // Update the local media to mark as uploaded
          const db = await initDB();
          const tx = db.transaction(STORES.MEDIAS, 'readwrite');
          const mediaObject = await tx.store.get(newId);
          if (mediaObject) {
            mediaObject.is_uploaded = true;
            await tx.store.put(mediaObject);
          }
          await tx.done;
        }
        break;
        
      case STORES.SIGNATURES:
        if (item.action === 'create') {
          const { id, is_synced, ...signatureData } = item.data;
          const newId = await inspectionService.createSignature(signatureData);
          await updateSyncedItem(item.id, true);
          await updateLocalItemId(STORES.SIGNATURES, id, newId);
        }
        break;
      
      default:
        console.warn('Unknown table in sync queue:', item.table);
    }
  } catch (error) {
    console.error(`Error syncing ${item.table}:`, error);
    throw error;
  }
};

// Update an item in the sync queue
const updateSyncedItem = async (id: string, synced: boolean): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(STORES.SYNC_QUEUE, 'readwrite');
  const item = await tx.store.get(id);
  
  if (item) {
    item.is_synced = synced;
    await tx.store.put(item);
  }
  
  await tx.done;
};

// Update local item ID after it's been synced with the server
const updateLocalItemId = async (store: string, oldId: string, newId: string): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(store, 'readwrite');
  
  try {
    const item = await tx.store.get(oldId);
    
    if (item) {
      // If it's a temporary ID, update it
      if (oldId.startsWith('temp_')) {
        await tx.store.delete(oldId);
        item.id = newId;
        await tx.store.put(item);
      }
    }
    
    await tx.done;
  } catch (error) {
    console.error(`Error updating local ID in ${store}:`, error);
    await tx.abort();
    throw error;
  }
};

// Delete a local item
const deleteLocalItem = async (store: string, id: string): Promise<void> => {
  const db = await initDB();
  const tx = db.transaction(store, 'readwrite');
  await tx.store.delete(id);
  await tx.done;
};

// Fetch complete inspection data locally (with rooms, items, medias, signatures)
const getCompleteInspectionLocally = async (id: string): Promise<{
  inspection: Inspection | null;
  rooms: (InspectionRoom & { items?: (InspectionItem & { medias?: InspectionMedia[] })[] })[];
  signatures: InspectionSignature[];
}> => {
  const inspection = await getInspectionLocally(id);
  const rooms = await getRoomsByInspectionLocally(id);
  const signatures = await getSignaturesByInspectionLocally(id);
  
  // Fetch items for each room
  for (const room of rooms) {
    const items = await getItemsByRoomLocally(room.id);
    
    // Fetch medias for each item
    for (const item of items) {
      const medias = await getMediasByItemLocally(item.id);
      item.medias = medias;
    }
    
    room.items = items;
  }
  
  return {
    inspection,
    rooms,
    signatures
  };
};

// Set up network listeners to trigger sync when coming online
const setupNetworkListeners = (): void => {
  window.addEventListener('online', () => {
    toast.success("Conexão restabelecida. Sincronizando dados...");
    processSyncQueue().then(() => {
      toast.success("Dados sincronizados com sucesso!");
    }).catch(error => {
      console.error("Erro na sincronização:", error);
      toast.error("Erro ao sincronizar dados");
    });
  });
  
  window.addEventListener('offline', () => {
    toast.warning("Sem conexão. Modo offline ativado");
  });
};

// Initialize the offline service
const initOfflineService = (): void => {
  setupNetworkListeners();
  
  // Initial sync if online
  if (isOnline()) {
    processSyncQueue().catch(console.error);
  }
};

export const offlineService = {
  initOfflineService,
  isOnline,
  saveInspectionLocally,
  saveRoomLocally,
  saveItemLocally,
  saveMediaLocally,
  saveSignatureLocally,
  getInspectionLocally,
  getRoomsByInspectionLocally,
  getItemsByRoomLocally,
  getMediasByItemLocally,
  getSignaturesByInspectionLocally,
  getCompleteInspectionLocally,
  processSyncQueue
};
