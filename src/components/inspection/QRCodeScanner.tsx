
import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface QRCodeScannerProps {
  onClose: () => void;
  onCodeScanned: (qrData: string) => void;
}

export function QRCodeScanner({ onClose, onCodeScanned }: QRCodeScannerProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Initialize scanner when component mounts
    const qrScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        disableFlip: false,
        videoConstraints: {
          facingMode: 'environment'
        }
      },
      /* verbose= */ false
    );

    setScanner(qrScanner);

    // Render the scanner
    qrScanner.render(onScanSuccess, onScanFailure);

    // Cleanup function
    return () => {
      if (qrScanner) {
        try {
          qrScanner.clear();
        } catch (error) {
          console.error("Error clearing scanner:", error);
        }
      }
    };
  }, []);

  const onScanSuccess = (decodedText: string) => {
    console.log(`QR Code detected: ${decodedText}`);
    
    // Stop the scanner
    if (scanner) {
      scanner.clear();
    }
    
    // Pass the scanned data to parent component
    onCodeScanned(decodedText);
    
    // Close the dialog
    handleClose();
    
    // Show success message
    toast.success("QR Code escaneado com sucesso!");
  };

  const onScanFailure = (error: string) => {
    // This is called when QR detection fails (not necessarily an error)
    console.log("QR scan no result:", error);
  };

  const handleClose = () => {
    if (scanner) {
      try {
        scanner.clear();
      } catch (error) {
        console.error("Error clearing scanner:", error);
      }
    }
    
    setIsOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-xl p-4">
        <DialogHeader>
          <DialogTitle>Escanear QR Code</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div id="qr-reader" className="mx-auto"></div>
          
          <p className="text-center text-sm text-gray-500">
            Posicione o QR Code no centro da câmera para escanear
          </p>
          
          <Button
            variant="outline"
            className="w-full"
            onClick={handleClose}
          >
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
