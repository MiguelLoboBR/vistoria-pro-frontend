
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Calendar, Clock } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";
import { toast } from "sonner";

interface HeaderInfoProps {
  address: string;
  date: string;
  time: string | null;
  onResponsibleChange: (name: string) => void;
}

export function HeaderInfo({ address, date, time, onResponsibleChange }: HeaderInfoProps) {
  const [responsibleName, setResponsibleName] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);

  useEffect(() => {
    // Get current location when component mounts
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Não foi possível obter a localização atual");
        }
      );
    }
  }, []);

  const handleResponsibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setResponsibleName(name);
    onResponsibleChange(name);
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Endereço</span>
          </div>
          <Input value={address} readOnly className="bg-gray-50" />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-gray-500">
            Responsável no local
          </Label>
          <Input
            placeholder="Nome do responsável presente"
            value={responsibleName}
            onChange={handleResponsibleChange}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-500">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Data</span>
            </div>
            <Input value={formatDate(date)} readOnly className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-500">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Hora</span>
            </div>
            <Input value={time || "--:--"} readOnly className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Coordenadas</span>
            </div>
            <Input
              value={currentLocation || "Obtendo localização..."}
              readOnly
              className="bg-gray-50 text-xs"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
