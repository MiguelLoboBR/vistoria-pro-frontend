
import { useState } from "react";

/**
 * Hook for managing inspection signatures
 */
export const useSignatures = () => {
  const [inspectorSignature, setInspectorSignature] = useState<string | null>(null);
  const [responsibleSignature, setResponsibleSignature] = useState<string | null>(null);
  const [isInspectorSignatureOpen, setIsInspectorSignatureOpen] = useState(false);
  const [isResponsibleSignatureOpen, setIsResponsibleSignatureOpen] = useState(false);
  
  return {
    inspectorSignature, 
    setInspectorSignature,
    responsibleSignature, 
    setResponsibleSignature,
    isInspectorSignatureOpen, 
    setIsInspectorSignatureOpen,
    isResponsibleSignatureOpen, 
    setIsResponsibleSignatureOpen,
  };
};
