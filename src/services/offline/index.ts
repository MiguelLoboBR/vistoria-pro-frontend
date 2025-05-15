
import { openDB } from 'idb';
import { syncQueue } from './syncQueue';
import inspectionDataService from './inspectionDataService';

// Initialize IndexedDB
const initializeDB = async () => {
  try {
    const db = await openDB('vistoria-pro-offline', 1, {
      upgrade(db) {
        // Sync queue store for offline actions
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }
        
        // Inspections store
        if (!db.objectStoreNames.contains('inspections')) {
          const store = db.createObjectStore('inspections', { keyPath: 'id' });
          store.createIndex('status', 'status');
          store.createIndex('inspectorId', 'inspectorId');
        }
        
        // Media store for photos, videos, etc.
        if (!db.objectStoreNames.contains('media')) {
          const store = db.createObjectStore('media', { keyPath: 'id' });
          store.createIndex('inspectionId', 'inspectionId');
          store.createIndex('type', 'type');
        }
      }
    });
    return db;
  } catch (error) {
    console.error('Error initializing IndexedDB:', error);
    throw error;
  }
};

// Network status detection
const networkStatusService = {
  isOnline: () => navigator.onLine,
  
  onlineCallbacks: [] as Function[],
  offlineCallbacks: [] as Function[],
  
  init() {
    window.addEventListener('online', () => {
      console.log('🌐 Network is online');
      this.onlineCallbacks.forEach(callback => callback());
    });
    
    window.addEventListener('offline', () => {
      console.log('🔌 Network is offline');
      this.offlineCallbacks.forEach(callback => callback());
    });
    
    return this;
  },
  
  onOnline(callback: Function) {
    this.onlineCallbacks.push(callback);
  },
  
  onOffline(callback: Function) {
    this.offlineCallbacks.push(callback);
  }
};

// Create the offlineService object with all methods directly accessible
const offlineService = {
  db: null as any,
  networkStatus: networkStatusService.init(),
  syncQueue,
  inspectionDataService,
  
  // Initialize the service
  async init() {
    try {
      this.db = await initializeDB();
      console.log('Offline service initialized');
      
      // Set up network change handlers
      this.networkStatus.onOnline(() => {
        this.processSyncQueue();
      });
      
      // Initialize sub-services
      await this.syncQueue.init(this.db);
      await this.inspectionDataService.init(this.db);
      
      return true;
    } catch (error) {
      console.error('Failed to initialize offline service:', error);
      return false;
    }
  },
  
  // Initialize the offline service
  initOfflineService() {
    this.init().catch(error => {
      console.error('Failed to initialize offline service:', error);
    });
  },
  
  // Direct method access from root object
  processSyncQueue() {
    return this.syncQueue.processSyncQueue();
  },
  
  saveInspectionLocally(inspection: any, isSynced = false) {
    return this.inspectionDataService.saveInspectionLocally(inspection, isSynced);
  },
  
  getCompleteInspectionLocally(inspectionId: string) {
    return this.inspectionDataService.getCompleteInspectionLocally(inspectionId);
  },
  
  saveRoomLocally(room: any, isSynced = false) {
    return this.inspectionDataService.saveRoomLocally(room, isSynced);
  },
  
  saveItemLocally(item: any, isSynced = false) {
    return this.inspectionDataService.saveItemLocally(item, isSynced);
  },
  
  saveSignatureLocally(signature: any, isSynced = false) {
    return this.inspectionDataService.saveSignatureLocally(signature, isSynced);
  },
  
  // Clear all data
  async clearAllData() {
    try {
      if (!this.db) {
        console.warn('Database not initialized');
        return false;
      }
      
      const tx = this.db.transaction(['syncQueue', 'inspections', 'media'], 'readwrite');
      await tx.objectStore('syncQueue').clear();
      await tx.objectStore('inspections').clear();
      await tx.objectStore('media').clear();
      await tx.done;
      
      console.log('All offline data cleared');
      return true;
    } catch (error) {
      console.error('Error clearing offline data:', error);
      return false;
    }
  },
  
  // Check if online
  isOnline() {
    return this.networkStatus.isOnline();
  }
};

export { offlineService, initializeDB, networkStatusService };
