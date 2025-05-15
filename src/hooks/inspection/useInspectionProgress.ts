
import { useState, useEffect } from "react";
import { InspectionRoom } from "@/services/inspectionService/types";

/**
 * Hook for managing inspection progress calculation
 */
export const useInspectionProgress = (rooms: InspectionRoom[]) => {
  const [progress, setProgress] = useState(0);
  
  // Calculate progress
  useEffect(() => {
    if (rooms.length === 0) {
      setProgress(0);
      return;
    }
    
    let totalItems = 0;
    let completedItems = 0;
    
    rooms.forEach(room => {
      if (room.items) {
        totalItems += room.items.length;
        room.items.forEach(item => {
          if (item.state) {
            completedItems++;
          }
        });
      }
    });
    
    const calculatedProgress = totalItems > 0 
      ? Math.round((completedItems / totalItems) * 100)
      : 0;
      
    setProgress(calculatedProgress);
  }, [rooms]);
  
  return progress;
};
