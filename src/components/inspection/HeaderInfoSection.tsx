
import { HeaderInfo } from "@/components/inspection/HeaderInfo";
import { Button } from "@/components/ui/button";
import { ArrowLeft, QrCode, Wifi, WifiOff } from "lucide-react";

interface HeaderInfoSectionProps {
  address: string;
  date: string;
  time: string | null;
  isOnline: boolean;
  onResponsibleChange: (name: string) => void;
  onBackClick: () => void;
  onQrCodeClick: () => void;
}

export const HeaderInfoSection = ({
  address,
  date,
  time,
  isOnline,
  onResponsibleChange,
  onBackClick,
  onQrCodeClick
}: HeaderInfoSectionProps) => {
  return (
    <div className="space-y-6">
      {/* Header with back button and connection status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={onBackClick}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">Vistoria</h1>
            <p className="text-gray-500 text-sm">{address}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={onQrCodeClick}
          >
            <QrCode size={16} />
            <span className="hidden sm:inline">Escanear QR</span>
          </Button>
          
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gray-100">
            {isOnline ? (
              <>
                <Wifi className="h-3 w-3 text-green-500" />
                <span className="hidden sm:inline text-green-500">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3 w-3 text-amber-500" />
                <span className="hidden sm:inline text-amber-500">Offline</span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Main Info */}
      <HeaderInfo 
        address={address}
        date={date}
        time={time}
        onResponsibleChange={onResponsibleChange}
      />
    </div>
  );
};
