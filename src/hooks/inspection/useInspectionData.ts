import { useState } from "react";
import { useInspectionLoading } from './useInspectionLoading';
import { useInspectionProgress } from './useInspectionProgress';
import { useQRCodeScanner } from './useQRCodeScanner';
import { useSignatures } from './useSignatures';

/**
 * Main hook that combines all inspection data functionality
 */
export const useInspectionData = (id?: string) => {
  // Use more specialized hooks
  const inspectionLoading = useInspectionLoading(id);
  const { rooms, setRooms } = inspectionLoading;
  const progress = useInspectionProgress(rooms);
  const qrCodeScanner = useQRCodeScanner();
  
  // Keep the same signature state and methods from useInspectionLoading
  // This is to prevent breaking changes with inspectorSignature from useInspectionLoading
  const {
    inspectorSignature: loadedInspectorSignature,
    setInspectorSignature: setLoadedInspectorSignature,
    responsibleSignature: loadedResponsibleSignature,
    setResponsibleSignature: setLoadedResponsibleSignature
  } = inspectionLoading;
  
  const signatures = useSignatures();
  
  // Sync signature states between the hooks to maintain compatibility
  if (loadedInspectorSignature && !signatures.inspectorSignature) {
    signatures.setInspectorSignature(loadedInspectorSignature);
  }
  
  if (loadedResponsibleSignature && !signatures.responsibleSignature) {
    signatures.setResponsibleSignature(loadedResponsibleSignature);
  }
  
  // Return the combined data, maintaining the same interface as before
  return {
    ...inspectionLoading,
    progress,
    ...qrCodeScanner,
    ...signatures,
  };
};
