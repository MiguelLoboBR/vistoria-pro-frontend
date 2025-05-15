
// Re-export from the new structure to maintain backward compatibility
import { offlineService } from './offline';

// Export both default and named export for maximum compatibility
export * from './offline';
export default offlineService;
