
import { openDB, IDBPDatabase } from 'idb';
import { toast } from 'sonner';

// Database name and version
export const DB_NAME = 'inspections_offline_db';
export const DB_VERSION = 1;

// Store names
export const STORES = {
  inspections: 'inspections',
  rooms: 'rooms',
  items: 'items',
  medias: 'medias',
  signatures: 'signatures',
  syncQueue: 'syncQueue',
};

// Database reference
let db: IDBPDatabase | null = null;

// Initialize the offline database
export const initDatabase = async (): Promise<void> => {
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
  } catch (error) {
    console.error('Error initializing IndexedDB:', error);
    toast.error('Erro ao inicializar armazenamento offline');
  }
};

// Returns true if the app is online
export const isOnline = () => navigator.onLine;

// Get the database instance
export const getDB = () => db;

// Add a generic item to a store
export const addToStore = async <T extends { id: string }>(
  storeName: string, 
  item: T
): Promise<string> => {
  if (!db) await initDatabase();
  
  try {
    await db?.put(storeName, item);
    return item.id;
  } catch (error) {
    console.error(`Error adding to ${storeName}:`, error);
    toast.error(`Erro ao salvar em ${storeName}`);
    return '';
  }
};

// Get a generic item from a store
export const getFromStore = async <T>(
  storeName: string, 
  id: string
): Promise<T | null> => {
  if (!db) await initDatabase();
  
  try {
    return await db?.get(storeName, id) || null;
  } catch (error) {
    console.error(`Error getting from ${storeName}:`, error);
    return null;
  }
};

// Get all items from a store
export const getAllFromStore = async <T>(storeName: string): Promise<T[]> => {
  if (!db) await initDatabase();
  
  try {
    return await db?.getAll(storeName) || [];
  } catch (error) {
    console.error(`Error getting all from ${storeName}:`, error);
    return [];
  }
};

// Delete an item from a store
export const deleteFromStore = async (storeName: string, id: string): Promise<void> => {
  if (!db) await initDatabase();
  
  try {
    await db?.delete(storeName, id);
  } catch (error) {
    console.error(`Error deleting from ${storeName}:`, error);
  }
};
