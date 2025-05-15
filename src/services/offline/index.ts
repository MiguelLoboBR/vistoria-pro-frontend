
import { initDatabase, isOnline } from './db';
import { processSyncQueue } from './syncQueue';
import { 
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
  getCompleteInspectionLocally 
} from './inspectionDataService';

// Initialize the offline service and set up online listener
export const initOfflineService = async (): Promise<void> => {
  await initDatabase();
  
  // Set up online listener to process sync queue
  window.addEventListener('online', processSyncQueue);
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
  getInspectionLocally,
  getRoomsLocallyByInspectionId,
  getItemsLocallyByRoomId,
  getMediaLocallyByItemId,
  getSignaturesLocallyByInspectionId,
};

export * from './db';
export * from './syncQueue';
export * from './inspectionDataService';
