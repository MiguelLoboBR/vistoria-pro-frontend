
// Re-export from the new structure to maintain backward compatibility
import offlineService, { inspectionDataService } from './offline';

// Export both named export and default export for maximum compatibility
export { inspectionDataService };
export * from './offline';
export default offlineService;
