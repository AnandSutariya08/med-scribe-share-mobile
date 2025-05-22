
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface AudioRecorderProps {
  isRecording: boolean;
  onRecordingComplete: (blob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ 
  isRecording, 
  onRecordingComplete 
}) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  useEffect(() => {
    const setupAudio = async () => {
      try {
        if (isRecording) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = stream;
          
          // Set up audio context for visualizer
          audioContextRef.current = new AudioContext();
          analyserRef.current = audioContextRef.current.createAnalyser();
          const source = audioContextRef.current.createMediaStreamSource(stream);
          source.connect(analyserRef.current);
          analyserRef.current.fftSize = 256;
          
          // Set up media recorder
          mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType: 'audio/webm'
          });
          audioChunksRef.current = [];
          
          mediaRecorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) {
              audioChunksRef.current.push(e.data);
            }
          };
          
          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            onRecordingComplete(audioBlob);
            audioChunksRef.current = [];
          };
          
          mediaRecorderRef.current.start(1000); // Collect data every second
          drawVisualizer();
        } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
          }
          
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
          
          if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
          }
        }
      } catch (err) {
        toast.error('Error accessing microphone: ' + (err as Error).message);
        console.error('Error accessing microphone:', err);
      }
    };
    
    setupAudio();
    
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRecording, onRecordingComplete]);
  
  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    if (!canvasCtx) return;
    
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    
    const draw = () => {
      if (!analyserRef.current || !canvasCtx) return;
      
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      canvasCtx.fillStyle = 'rgb(248, 249, 250)'; // Background color
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
      
      const barWidth = (WIDTH / bufferLength) * 2.5;
      let barHeight;
      let x = 0;
      
      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        canvasCtx.fillStyle = `rgb(${0}, ${119}, ${204})`; // Primary blue
        canvasCtx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
        
        x += barWidth + 1;
      }
    };
    
    draw();
  };
  
  return (
    <Card className="p-4 w-full">
      <canvas ref={canvasRef} className="w-full h-20 rounded" width={600} height={80} />
      {!isRecording && (
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Press record to start capturing audio
        </div>
      )}
    </Card>
  );
};

export default AudioRecorder;
