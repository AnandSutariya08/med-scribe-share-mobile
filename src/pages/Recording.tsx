
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Mic, Video, Pause, Square, Save } from 'lucide-react';
import { toast } from 'sonner';
import AudioRecorder from '@/components/AudioRecorder';
import VideoRecorder from '@/components/VideoRecorder';

interface LocationState {
  recordingType: 'audio' | 'video';
  fileName: string;
  email: string;
  selectedFiles: number[];
}

const Recording = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recordingType, fileName, email, selectedFiles } = location.state as LocationState;
  
  const [isRecording, setIsRecording] = useState(false);
  const [recordingData, setRecordingData] = useState<{ blob: Blob, url: string } | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStartRecording = () => {
    setIsRecording(true);
    toast.info(`${recordingType === 'audio' ? 'Audio' : 'Video'} recording started`);
  };
  
  const handleStopRecording = (blob: Blob) => {
    setIsRecording(false);
    const url = URL.createObjectURL(blob);
    setRecordingData({ blob, url });
    toast.success('Recording completed successfully');
  };
  
  const handlePauseRecording = () => {
    // This would be implemented with the actual recorder component
    console.log('Pause recording');
  };
  
  const handleSave = () => {
    if (recordingData) {
      navigate('/share', {
        state: {
          recordingType,
          fileName,
          email,
          recordingData,
          selectedFiles,
          recordingDuration: formatTime(elapsedTime)
        }
      });
    } else {
      toast.error('No recording available to save');
    }
  };
  
  const handleBack = () => {
    navigate('/content-selection', {
      state: { recordingType, fileName, email }
    });
  };
  
  return (
    <div className="app-container">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0" 
        onClick={handleBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      
      <h1 className="text-2xl font-bold mb-6">
        {recordingType === 'audio' ? 'Audio' : 'Video'} Recording
      </h1>
      
      <Card className="p-6 flex flex-col items-center">
        <div className="mb-6 w-full">
          <p className="font-medium">{fileName}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
          <div className="mt-2 py-2 px-3 bg-accent rounded flex items-center">
            {recordingType === 'audio' ? (
              <Mic className="h-4 w-4 mr-2 text-primary" />
            ) : (
              <Video className="h-4 w-4 mr-2 text-primary" />
            )}
            <span className="text-sm font-medium">
              {isRecording ? 'Recording in progress...' : 'Ready to record'}
            </span>
            {isRecording && (
              <div className="ml-2 h-3 w-3 rounded-full bg-destructive animate-pulse-recording"></div>
            )}
            <span className="ml-auto font-mono">{formatTime(elapsedTime)}</span>
          </div>
        </div>
        
        <div className="w-full mb-6">
          {recordingType === 'audio' ? (
            <AudioRecorder 
              isRecording={isRecording}
              onRecordingComplete={handleStopRecording}
            />
          ) : (
            <VideoRecorder 
              isRecording={isRecording}
              onRecordingComplete={handleStopRecording}
            />
          )}
        </div>
        
        <Separator className="mb-6" />
        
        <div className="flex flex-wrap justify-center gap-4">
          {!isRecording && !recordingData && (
            <Button 
              onClick={handleStartRecording}
              size="lg"
              className="recording-btn"
            >
              {recordingType === 'audio' ? (
                <Mic className="h-6 w-6" />
              ) : (
                <Video className="h-6 w-6" />
              )}
            </Button>
          )}
          
          {isRecording && (
            <>
              <Button 
                onClick={handlePauseRecording}
                size="lg"
                variant="outline"
                className="recording-btn"
              >
                <Pause className="h-6 w-6" />
              </Button>
              
              <Button 
                onClick={() => setIsRecording(false)}
                size="lg"
                variant="destructive"
                className="recording-btn"
              >
                <Square className="h-6 w-6" />
              </Button>
            </>
          )}
          
          {recordingData && (
            <Button 
              onClick={handleSave}
              size="lg"
              className="px-6"
            >
              <Save className="h-5 w-5 mr-2" /> Save & Continue
            </Button>
          )}
        </div>
        
        {recordingData && (
          <div className="mt-8 w-full">
            <h3 className="font-medium mb-2">Recording Preview</h3>
            {recordingType === 'audio' ? (
              <audio src={recordingData.url} controls className="w-full" />
            ) : (
              <video src={recordingData.url} controls className="w-full rounded-md" />
            )}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Recording;
