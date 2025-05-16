
// Re-export from the new structure to maintain backward compatibility
import { offlineService, inspectionDataService } from './offline';

// Export only named exports for maximum compatibility
export { inspectionDataService };
export * from './offline';
export default offlineService;
