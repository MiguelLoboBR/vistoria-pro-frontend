
import { IDBPDatabase } from 'idb';
import { v4 as uuidv4 } from 'uuid';

// Export only as a named constant
export const inspectionDataService = {
  db: null as IDBPDatabase | null,

  // Initialize the service
  async init(dbInstance: IDBPDatabase) {
    this.db = dbInstance;
    return true;
  },

  // Save inspection locally
  async saveInspectionLocally(inspection: any, isSynced = false) {
    if (!this.db) return null;
    
    try {
      const id = inspection.id || uuidv4();
      const tx = this.db.transaction('inspections', 'readwrite');
      await tx.store.put({
        ...inspection,
        id,
        synced: isSynced,
        updatedAt: new Date().toISOString()
      });
      await tx.done;
      
      return id;
    } catch (error) {
      console.error('Error saving inspection locally:', error);
      return null;
    }
  },

  // Get inspection data with rooms and items
  async getCompleteInspectionLocally(inspectionId: string) {
    if (!this.db) return null;
    
    try {
      const inspection = await this.db.get('inspections', inspectionId);
      if (!inspection) return null;
      
      return inspection;
    } catch (error) {
      console.error('Error getting inspection locally:', error);
      return null;
    }
  },
  
  // Save room locally
  async saveRoomLocally(room: any, isSynced = false) {
    if (!this.db) return null;
    
    try {
      const id = room.id || uuidv4();
      const tx = this.db.transaction('rooms', 'readwrite');
      await tx.store.put({
        ...room,
        id,
        synced: isSynced,
        updatedAt: new Date().toISOString()
      });
      await tx.done;
      
      return id;
    } catch (error) {
      console.error('Error saving room locally:', error);
      return null;
    }
  },
  
  // Save item locally
  async saveItemLocally(item: any, isSynced = false) {
    if (!this.db) return null;
    
    try {
      const id = item.id || uuidv4();
      const tx = this.db.transaction('items', 'readwrite');
      await tx.store.put({
        ...item,
        id,
        synced: isSynced,
        updatedAt: new Date().toISOString()
      });
      await tx.done;
      
      return id;
    } catch (error) {
      console.error('Error saving item locally:', error);
      return null;
    }
  },
  
  // Save signature locally
  async saveSignatureLocally(signature: any, isSynced = false) {
    if (!this.db) return null;
    
    try {
      const id = signature.id || uuidv4();
      const tx = this.db.transaction('signatures', 'readwrite');
      await tx.store.put({
        ...signature,
        id,
        synced: isSynced,
        updatedAt: new Date().toISOString()
      });
      await tx.done;
      
      return id;
    } catch (error) {
      console.error('Error saving signature locally:', error);
      return null;
    }
  }
};
