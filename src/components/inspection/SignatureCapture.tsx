
import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eraser, Save, RotateCcw } from "lucide-react";

export interface SignatureCaptureProps {
  title: string;
  onSignCapture: (signatureData: string) => void;
}

export const SignatureCapture = ({ title, onSignCapture }: SignatureCaptureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = 200;
      }
      
      // Set drawing style
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'black';
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);
  
  const getCoordinates = (event: MouseEvent | TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    
    if ('touches' in event) {
      // Touch event
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
  };
  
  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const coords = getCoordinates(event.nativeEvent);
    if (!coords) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    
    setIsDrawing(true);
    setHasSignature(true);
  };
  
  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    if (!isDrawing) return;
    
    const coords = getCoordinates(event.nativeEvent);
    if (!coords) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
  };
  
  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };
  
  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Convert to data URL and save
    const signatureData = canvas.toDataURL('image/png');
    onSignCapture(signatureData);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-md mb-3 overflow-hidden"
        >
          <canvas
            ref={canvasRef}
            className="w-full touch-none bg-white"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={clearSignature}
          >
            <Eraser className="h-4 w-4 mr-2" />
            Limpar
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="flex-1"
            disabled={!hasSignature}
            onClick={saveSignature}
          >
            <Save className="h-4 w-4 mr-2" />
            Salvar Assinatura
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SignatureCapture;
