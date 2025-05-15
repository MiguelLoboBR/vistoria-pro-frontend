
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import InspectorLayout from "@/components/layouts/InspectorLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import hooks
import { useInspectionData } from "@/hooks/useInspectionData";
import { useInspectionActions } from "@/hooks/useInspectionActions";

// Import custom components
import { HeaderInfoSection } from "@/components/inspection/HeaderInfoSection";
import { RoomsTabContent } from "@/components/inspection/RoomsTabContent";
import { FinishTabContent } from "@/components/inspection/FinishTabContent";
import { SignatureCanvas } from "@/components/inspection/SignatureCanvas";
import { FloatingActions } from "@/components/inspection/FloatingActions";
import { QRCodeScanner } from "@/components/inspection/QRCodeScanner";
import { InspectionLoadingState } from "@/components/inspection/InspectionLoadingState";
import { InspectionNotFound } from "@/components/inspection/InspectionNotFound";

export const InspectionExecute = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [currentTab, setCurrentTab] = useState("rooms");
  
  // Use inspection data hook
  const {
    inspection,
    rooms,
    setRooms,
    responsibleName,
    setResponsibleName,
    isLoading,
    isOnline,
    progress,
    qrCodeData,
    setQrCodeData,
    isQrScannerOpen,
    setIsQrScannerOpen,
    inspectorSignature,
    setInspectorSignature,
    responsibleSignature,
    setResponsibleSignature,
    isInspectorSignatureOpen,
    setIsInspectorSignatureOpen,
    isResponsibleSignatureOpen,
    setIsResponsibleSignatureOpen,
  } = useInspectionData(id);
  
  // Use inspection actions hook
  const {
    handleRoomNameChange,
    handleRoomDelete,
    handleAddRoom,
    handleAddItem,
    handleItemUpdate,
    handleItemDelete,
    handleSaveProgress,
    handleCompleteInspection,
  } = useInspectionActions(inspection, rooms, setRooms, inspectorSignature);

  // Handle QR code scanning
  const handleQrCodeScanned = (qrData: string) => {
    setQrCodeData(qrData);
    
    // Parse the QR code data - format should be determined by your application
    try {
      // Example: If QR code contains JSON with inspection details
      const qrInfo = JSON.parse(qrData);
      
      if (qrInfo.inspection_id && qrInfo.room) {
        toast.success(`QR Code vinculado ao ambiente: ${qrInfo.room}`);
      }
    } catch (error) {
      // If not JSON, just store as plain text
      toast.info(`QR Code escaneado: ${qrData}`);
    }
  };
  
  // Show loading state
  if (isLoading) {
    return <InspectionLoadingState />;
  }
  
  // Show not found state
  if (!inspection) {
    return <InspectionNotFound onBackClick={() => navigate("/app/inspector/dashboard")} />;
  }
  
  return (
    <InspectorLayout>
      <div className="space-y-6 pb-16">
        {/* Header Information */}
        <HeaderInfoSection 
          address={inspection.address}
          date={inspection.date}
          time={inspection.time}
          isOnline={isOnline}
          onResponsibleChange={setResponsibleName}
          onBackClick={() => navigate("/app/inspector/dashboard")}
          onQrCodeClick={() => setIsQrScannerOpen(true)}
        />
        
        {/* Tabs */}
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rooms">Ambientes</TabsTrigger>
            <TabsTrigger value="finish">Finalizar</TabsTrigger>
          </TabsList>
          
          {/* Rooms Tab */}
          <TabsContent value="rooms" className="space-y-4">
            <RoomsTabContent
              rooms={rooms}
              onRoomNameChange={handleRoomNameChange}
              onRoomDelete={handleRoomDelete}
              onAddItem={handleAddItem}
              onItemUpdate={handleItemUpdate}
              onItemDelete={handleItemDelete}
              onAddRoom={handleAddRoom}
            />
          </TabsContent>
          
          {/* Finish Tab */}
          <TabsContent value="finish" className="space-y-4">
            <FinishTabContent 
              inspection={inspection}
              rooms={rooms}
              progress={progress}
              responsibleName={responsibleName}
              qrCodeData={qrCodeData}
              inspectorSignature={inspectorSignature}
              responsibleSignature={responsibleSignature}
              isOnline={isOnline}
              onCompleteInspection={handleCompleteInspection}
              onInspectorSignatureClick={() => setIsInspectorSignatureOpen(true)}
              onResponsibleSignatureClick={() => setIsResponsibleSignatureOpen(true)}
            />
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Floating Actions */}
      <FloatingActions
        progress={progress}
        onAddRoom={handleAddRoom}
        onSaveProgress={handleSaveProgress}
        onCompleteInspection={handleCompleteInspection}
      />
      
      {/* Signature Dialogs */}
      {isInspectorSignatureOpen && (
        <SignatureCanvas
          inspectionId={inspection.id}
          signer="vistoriador"
          title="Assinatura do Vistoriador"
          description="Assine no espaço abaixo para finalizar a vistoria."
          onClose={() => setIsInspectorSignatureOpen(false)}
          onSignatureAdded={(signatureData) => setInspectorSignature(signatureData)}
        />
      )}
      
      {isResponsibleSignatureOpen && (
        <SignatureCanvas
          inspectionId={inspection.id}
          signer="responsavel"
          title="Assinatura do Responsável"
          description="Solicite ao responsável que assine no espaço abaixo."
          onClose={() => setIsResponsibleSignatureOpen(false)}
          onSignatureAdded={(signatureData) => setResponsibleSignature(signatureData)}
        />
      )}
      
      {/* QR Code Scanner */}
      {isQrScannerOpen && (
        <QRCodeScanner
          onClose={() => setIsQrScannerOpen(false)}
          onCodeScanned={handleQrCodeScanned}
        />
      )}
    </InspectorLayout>
  );
};

export default InspectionExecute;
