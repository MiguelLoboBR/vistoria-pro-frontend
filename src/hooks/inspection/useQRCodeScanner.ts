
import { useState } from "react";

/**
 * Hook for managing QR code scanning functionality
 */
export const useQRCodeScanner = () => {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  
  return {
    qrCodeData,
    setQrCodeData,
    isQrScannerOpen,
    setIsQrScannerOpen,
  };
};
