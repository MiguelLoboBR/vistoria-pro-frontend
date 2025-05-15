
// Re-export from the new structure to maintain backward compatibility
import { offlineService } from './offline';
import { inspectionDataService } from './offline/inspectionDataService';

// Export both named export and the object as default for maximum compatibility
export { inspectionDataService };
export * from './offline';
export default offlineService;

