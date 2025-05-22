
import React, { useRef, useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface VideoRecorderProps {
  isRecording: boolean;
  onRecordingComplete: (blob: Blob) => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ 
  isRecording,
  onRecordingComplete 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#0077CC'); // Primary blue
  const lastPosRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);
  
  useEffect(() => {
    const setupVideo = async () => {
      try {
        if (isRecording) {
          // Get user camera
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          });
          
          streamRef.current = stream;
          
          // Display camera feed in video element
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
          
          // Initialize canvas for drawing
          if (drawCanvasRef.current) {
            const ctx = drawCanvasRef.current.getContext('2d');
            if (ctx) {
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, drawCanvasRef.current.width, drawCanvasRef.current.height);
              ctx.lineWidth = 3;
              ctx.lineCap = 'round';
              ctx.strokeStyle = drawColor;
            }
          }
          
          // Set up recording canvas for merging video + drawing
          setupRecordingCanvas();
          
          // Start recording
          if (canvasRef.current) {
            const recordingStream = canvasRef.current.captureStream(30); // 30fps
            mediaRecorderRef.current = new MediaRecorder(recordingStream, {
              mimeType: 'video/webm;codecs=vp9'
            });
            chunksRef.current = [];
            
            mediaRecorderRef.current.ondataavailable = (e) => {
              if (e.data.size > 0) {
                chunksRef.current.push(e.data);
              }
            };
            
            mediaRecorderRef.current.onstop = () => {
              const videoBlob = new Blob(chunksRef.current, { type: 'video/webm' });
              onRecordingComplete(videoBlob);
              chunksRef.current = [];
            };
            
            mediaRecorderRef.current.start(1000); // Collect data every second
          }
        } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          mediaRecorderRef.current.stop();
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
          
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
          }
        }
      } catch (err) {
        toast.error('Error accessing camera: ' + (err as Error).message);
        console.error('Error accessing camera:', err);
      }
    };
    
    setupVideo();
    
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRecording, onRecordingComplete, drawColor]);
  
  const setupRecordingCanvas = () => {
    if (!canvasRef.current || !videoRef.current || !drawCanvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const drawFrame = () => {
      if (!isRecording) return;
      
      if (videoRef.current && drawCanvasRef.current) {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the drawing canvas (main content)
        ctx.drawImage(drawCanvasRef.current, 0, 0, canvas.width, canvas.height);
        
        // Draw the video (picture-in-picture)
        const pipWidth = canvas.width * 0.25; // 25% of canvas width
        const pipHeight = (videoRef.current.videoHeight / videoRef.current.videoWidth) * pipWidth;
        ctx.drawImage(videoRef.current, canvas.width - pipWidth - 10, 10, pipWidth, pipHeight);
      }
      
      animationRef.current = requestAnimationFrame(drawFrame);
    };
    
    drawFrame();
  };
  
  const handleDrawingStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!drawCanvasRef.current) return;
    
    const canvas = drawCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    setIsDrawing(true);
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      lastPosRef.current = { x, y };
    }
  };
  
  const handleDrawingMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawCanvasRef.current) return;
    e.preventDefault();
    
    const canvas = drawCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = drawColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(lastPosRef.current.x, lastPosRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
      lastPosRef.current = { x, y };
    }
  };
  
  const handleDrawingEnd = () => {
    setIsDrawing(false);
  };
  
  const colors = ['#0077CC', '#F44336', '#4CAF50', '#000000'];
  
  return (
    <Card className="p-4">
      {/* Hidden elements used for the recording process */}
      <video ref={videoRef} className="hidden" muted playsInline />
      <canvas ref={canvasRef} width={640} height={480} className="hidden" />
      
      {/* Drawing canvas visible to the user */}
      <div className="relative">
        <canvas 
          ref={drawCanvasRef}
          width={640}
          height={480}
          className="w-full border rounded bg-white touch-none cursor-crosshair"
          onMouseDown={handleDrawingStart}
          onMouseMove={handleDrawingMove}
          onMouseUp={handleDrawingEnd}
          onMouseLeave={handleDrawingEnd}
          onTouchStart={handleDrawingStart}
          onTouchMove={handleDrawingMove}
          onTouchEnd={handleDrawingEnd}
        />
        
        {isRecording && (
          <div className="absolute top-4 right-4 flex items-center bg-black/70 text-white px-2 py-1 rounded-md text-sm">
            <div className="h-3 w-3 rounded-full bg-destructive animate-pulse-recording mr-2"></div>
            REC
          </div>
        )}
      </div>
      
      {isRecording && (
        <div className="mt-4 flex justify-center space-x-2">
          {colors.map(color => (
            <button
              key={color}
              className={`h-8 w-8 rounded-full border-2 ${drawColor === color ? 'border-black' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
              onClick={() => setDrawColor(color)}
              aria-label={`Select ${color} color`}
            />
          ))}
        </div>
      )}
      
      {!isRecording && (
        <div className="text-center mt-4 text-sm text-muted-foreground">
          Press record to start video capture with drawing
        </div>
      )}
    </Card>
  );
};

export default VideoRecorder;
