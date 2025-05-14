
import { useState, useRef } from "react";
import { Camera, ImagePlus, Edit, Check, X, Circle, ArrowRight, Type, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { fabric } from "fabric";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export interface PhotoCaptureProps {
  onPhotoCapture: (photoData: string) => void;
  onCancel: () => void;
}

export const PhotoCapture = ({ onPhotoCapture, onCancel }: PhotoCaptureProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  
  // Initialize camera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      toast.error("Não foi possível acessar a câmera. Verifique as permissões.");
      console.error("Error accessing camera:", err);
    }
  };
  
  // Initialize camera on component mount
  useState(() => {
    startCamera();
    return () => {
      // Clean up camera stream when component unmounts
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  });
  
  // Take a photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageDataUrl);
      
      // Stop camera stream
      if (video.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    }
  };
  
  // Initialize fabric.js canvas for editing
  const startEditing = () => {
    setIsEditing(true);
    
    setTimeout(() => {
      if (photoRef.current) {
        const canvas = new fabric.Canvas('fabric-canvas', {
          width: photoRef.current.width,
          height: photoRef.current.height
        });
        
        fabricCanvasRef.current = canvas;
        
        // Add image to canvas
        fabric.Image.fromURL(capturedImage!, (img) => {
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width! / img.width!,
            scaleY: canvas.height! / img.height!
          });
        });
      }
    }, 100);
  };
  
  // Add circle marking
  const addCircle = () => {
    if (fabricCanvasRef.current) {
      const circle = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 30,
        fill: 'transparent',
        stroke: 'red',
        strokeWidth: 3
      });
      
      fabricCanvasRef.current.add(circle);
      fabricCanvasRef.current.setActiveObject(circle);
    }
  };
  
  // Add arrow marking
  const addArrow = () => {
    if (fabricCanvasRef.current) {
      const arrow = new fabric.Path('M 0 0 L 200 0 L 170 -20 M 200 0 L 170 20', {
        left: 100,
        top: 100,
        stroke: 'red',
        strokeWidth: 3,
        fill: 'transparent'
      });
      
      fabricCanvasRef.current.add(arrow);
      fabricCanvasRef.current.setActiveObject(arrow);
    }
  };
  
  // Add text marking
  const addText = () => {
    if (fabricCanvasRef.current) {
      const text = new fabric.Text('Edite este texto', {
        left: 100,
        top: 100,
        fontSize: 20,
        fill: 'red'
      });
      
      fabricCanvasRef.current.add(text);
      fabricCanvasRef.current.setActiveObject(text);
    }
  };
  
  // Save edited image
  const saveEdit = () => {
    if (fabricCanvasRef.current) {
      const editedImageData = fabricCanvasRef.current.toDataURL({
        format: 'jpeg',
        quality: 0.8
      });
      
      setCapturedImage(editedImageData);
      setIsEditing(false);
      
      // Clean up fabric canvas
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }
  };
  
  // Cancel editing
  const cancelEdit = () => {
    setIsEditing(false);
    
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }
  };
  
  // Upload image from device
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCapturedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden">
      <CardContent className="p-0">
        {/* Camera view for capturing */}
        {!capturedImage && (
          <div className="relative">
            <AspectRatio ratio={4/3} className="bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            
            <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 gap-4 bg-gradient-to-t from-black/70 to-transparent">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white h-12 w-12 rounded-full" 
                onClick={onCancel}
              >
                <X className="h-6 w-6" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white h-14 w-14 rounded-full" 
                onClick={capturePhoto}
              >
                <Camera className="h-8 w-8" />
              </Button>
              
              <label>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="bg-white h-12 w-12 rounded-full" 
                  onClick={() => {}}
                  asChild
                >
                  <div>
                    <ImagePlus className="h-6 w-6" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </Button>
              </label>
            </div>
          </div>
        )}
        
        {/* Hidden canvas for capturing photo */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Preview captured photo */}
        {capturedImage && !isEditing && (
          <div className="relative">
            <AspectRatio ratio={4/3}>
              <img
                ref={photoRef}
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-contain"
              />
            </AspectRatio>
            
            <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 gap-4 bg-gradient-to-t from-black/70 to-transparent">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white h-12 w-12 rounded-full" 
                onClick={() => {
                  setCapturedImage(null);
                  startCamera();
                }}
              >
                <X className="h-6 w-6" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white h-12 w-12 rounded-full" 
                onClick={startEditing}
              >
                <Edit className="h-6 w-6" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white h-12 w-12 rounded-full" 
                onClick={() => onPhotoCapture(capturedImage)}
              >
                <Check className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Edit photo with fabric.js */}
        {capturedImage && isEditing && (
          <div className="relative">
            <div className="fabric-container">
              <canvas id="fabric-canvas" />
            </div>
            
            <div className="absolute top-0 left-0 right-0 flex justify-center p-2 gap-2 bg-gradient-to-b from-black/70 to-transparent">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white"
                onClick={addCircle}
              >
                <Circle className="h-4 w-4 mr-1" />
                Círculo
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white"
                onClick={addArrow}
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                Seta
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white"
                onClick={addText}
              >
                <Type className="h-4 w-4 mr-1" />
                Texto
              </Button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 gap-4 bg-gradient-to-t from-black/70 to-transparent">
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white h-12 w-12 rounded-full" 
                onClick={cancelEdit}
              >
                <X className="h-6 w-6" />
              </Button>
              
              <Button 
                variant="outline" 
                size="icon" 
                className="bg-white h-12 w-12 rounded-full" 
                onClick={saveEdit}
              >
                <Save className="h-6 w-6" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoCapture;
