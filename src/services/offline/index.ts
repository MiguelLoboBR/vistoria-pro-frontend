
import { openDB } from 'idb';
import { syncQueue } from './syncQueue';
import { inspectionDataService } from './inspectionDataService';

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

  async init() {
    try {
      this.db = await initializeDB();
      console.log('Offline service initialized');
      this.networkStatus.onOnline(() => {
        this.syncQueue.processSyncQueue();
      });
      await this.syncQueue.init(this.db);
      await this.inspectionDataService.init(this.db);
    } catch (error) {
      console.error('Failed to initialize offline service:', error);
    }
  },
};

export { offlineService, initializeDB, networkStatusService, inspectionDataService };
export default offlineService;
