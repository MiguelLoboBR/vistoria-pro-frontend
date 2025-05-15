
import { toast } from 'sonner';
import { inspectionService } from '../inspectionService';
import { Inspection, InspectionRoom, InspectionItem, InspectionMedia, InspectionSignature } from '../inspectionService/types';
import { getDB, STORES, initDatabase, isOnline } from './db';

// Sync queue action types
export type SyncAction = {
  id: string;
  table: string;
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
};

// Add an item to the sync queue
export const addToSyncQueue = async (table: string, action: 'create' | 'update' | 'delete', data: any): Promise<void> => {
  const db = getDB();
  if (!db) await initDatabase();
  
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

// Process the sync queue when online
export const processSyncQueue = async (): Promise<void> => {
  if (!isOnline()) return;
  
  const db = getDB();
  if (!db) await initDatabase();
  
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
