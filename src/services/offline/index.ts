
import { openDB } from 'idb';
import { syncQueue } from './syncQueue';
import inspectionDataService from './inspectionDataService';

// Initialize IndexedDB
const initializeDB = async () => {
  try {
    const db = await openDB('vistoria-pro-offline', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('inspections')) {
          const store = db.createObjectStore('inspections', { keyPath: 'id' });
          store.createIndex('status', 'status');
          store.createIndex('inspectorId', 'inspectorId');
        }
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
        this.syncQueue.processSyncQueue();
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
  
  // Initialize the offline service - convenience method
  initOfflineService() {
    this.init().catch(error => {
      console.error('Failed to initialize offline service:', error);
    });
  },
  
  // Check if online
  isOnline() {
    return this.networkStatus.isOnline();
  },
  
  // Convenience methods that pass through to inspectionDataService
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
  
  // Process sync queue
  processSyncQueue() {
    return this.syncQueue.processSyncQueue();
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
  }
};

export { offlineService, initializeDB, networkStatusService, inspectionDataService };
export default offlineService;
