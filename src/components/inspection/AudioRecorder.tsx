
import { useState, useRef, useEffect } from "react";
import { Mic, Square, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface AudioRecorderProps {
  onTranscriptionComplete: (text: string) => void;
}

export const AudioRecorder = ({ onTranscriptionComplete }: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);
  
  // Format recording time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
      toast.success("Gravação iniciada. Fale claramente.");
    } catch (error) {
      console.error("Error starting recording:", error);
      toast.error("Não foi possível iniciar a gravação. Verifique as permissões de microfone.");
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      toast.success("Gravação finalizada.");
    }
  };
  
  // Transcribe audio
  const transcribeAudio = async () => {
    if (!audioBlob) {
      toast.error("Nenhum áudio para transcrever.");
      return;
    }
    
    setIsTranscribing(true);
    
    try {
      // This is a mock implementation for demonstration purposes
      // In a real app, you would send the audio to a server endpoint that calls the OpenAI Whisper API
      
      toast.info("Simulando transcrição com OpenAI Whisper (em produção seria enviado para API)");
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mocked response for demo
      // In production, replace with actual API call to OpenAI Whisper
      const mockedTranscription = "O imóvel apresenta algumas manchas de umidade no canto superior direito da parede. A pintura está em bom estado, com exceção dessa área afetada.";
      
      onTranscriptionComplete(mockedTranscription);
      toast.success("Áudio transcrito com sucesso!");
    } catch (error) {
      console.error("Error transcribing audio:", error);
      toast.error("Erro ao transcrever áudio. Tente novamente.");
    } finally {
      setIsTranscribing(false);
    }
  };
  
  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {isRecording ? 'Gravando...' : audioBlob ? 'Áudio gravado' : 'Gravar áudio'}
        </span>
        <span className="text-sm text-gray-500">
          {formatTime(recordingTime)}
        </span>
      </div>
      
      {isRecording && (
        <Progress value={recordingTime % 60 * (100/60)} className="h-1" />
      )}
      
      <div className="flex gap-2 mt-1">
        {!isRecording && !audioBlob && (
          <Button
            onClick={startRecording}
            variant="outline"
            className="flex-1"
            size="sm"
          >
            <Mic className="mr-2 h-4 w-4" />
            Iniciar Gravação
          </Button>
        )}
        
        {isRecording && (
          <Button
            onClick={stopRecording}
            variant="destructive"
            className="flex-1"
            size="sm"
          >
            <Square className="mr-2 h-4 w-4" />
            Parar Gravação
          </Button>
        )}
        
        {audioBlob && !isRecording && (
          <>
            <Button
              onClick={startRecording}
              variant="outline"
              size="sm"
            >
              <Mic className="h-4 w-4" />
              Regravar
            </Button>
            
            <Button
              onClick={transcribeAudio}
              variant="default"
              className="flex-1"
              size="sm"
              disabled={isTranscribing}
            >
              <File className="mr-2 h-4 w-4" />
              {isTranscribing ? 'Transcrevendo...' : 'Transcrever'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
