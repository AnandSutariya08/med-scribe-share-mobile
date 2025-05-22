
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Download, Tv, Mail, Clock, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { addRecording } from '@/store/contentSlice';

interface LocationState {
  recordingType: 'audio' | 'video';
  fileName: string;
  email: string;
  recordingData: {
    blob: Blob;
    url: string;
  };
  selectedFiles: number[];
  recordingDuration: string;
}

const Share = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSending, setIsSending] = useState(false);
  const { recordingType, fileName, email, recordingData, selectedFiles, recordingDuration } = location.state as LocationState;
  
  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  };
  
  const handleDownload = () => {
    if (!recordingData) {
      toast.error('No recording available to download');
      return;
    }
    
    const a = document.createElement('a');
    a.href = recordingData.url;
    a.download = `${fileName}.${recordingType === 'audio' ? 'mp3' : 'mp4'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Recording downloaded successfully');
  };
  
  const sendToTv = async () => {
    if (isSending) return;
    
    if (!recordingData || !recordingData.blob) {
      toast.error('No recording available to send');
      return;
    }
    
    setIsSending(true);
    toast('Sending to TV...');
    
    try {
      // Mock IP address (would be retrieved from an API in production)
      const ipAddress = "192.168.137.3";
      const [ip1, ip2, ip3, ip4] = ipAddress.split(".");
      const url = `https://api.example.com/${ip1}/${ip2}/${ip3}/${ip4}`;
      
      const fileExt = recordingType === "video" ? "mp4" : "mp3";
      const mimeType = recordingType === "video" ? "video/mp4" : "audio/mpeg";
      const fileBlob = recordingData.blob;
      
      const file = new File([fileBlob], `${fileName}.${fileExt}`, {
        type: mimeType,
      });
      
      const formData = new FormData();
      formData.append("file", file);
      
      // For demo purposes, we'll just simulate the API call
      setTimeout(() => {
        toast.success('Recording sent to TV successfully!');
        setIsSending(false);
      }, 2000);
      
      // In a real app, you would make the API call:
      /*
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      
      if (response.ok) {
        toast.success('Recording sent to TV successfully!');
      } else {
        toast.error('Failed to send recording to TV');
      }
      */
    } catch (err) {
      toast.error(`Error sending to TV: ${err.message}`);
    } finally {
      // setIsSending(false); // This is handled by the setTimeout in the mock
    }
  };
  
  const sendToEmail = () => {
    toast('Sending files to email...');
    
    // Log selected files
    console.log("Selected files:", selectedFiles);
    
    // In a real app, you would make an API call to send the email
    setTimeout(() => {
      toast.success(`Files sent to ${email}`);
    }, 1500);
  };
  
  const saveRecording = () => {
    // Save the recording to the Redux store
    const newRecording = {
      id: Date.now(),
      type: 2, // file
      name: fileName,
      description: `${recordingType === 'audio' ? 'Audio' : 'Video'} recording`,
      href: recordingData.url,
      thumbnailHref: "",
      runtime: recordingDuration
    };
    
    dispatch(addRecording({
      category: recordingType === 'audio' ? 'Audio' : 'Movies',
      recording: newRecording
    }));
    
    toast.success('Recording saved to your library');
    navigate('/');
  };
  
  const handleBack = () => {
    navigate('/recording', {
      state: { recordingType, fileName, email, selectedFiles }
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
      
      <h1 className="text-2xl font-bold mb-6">Save & Share</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Recording Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <p className="font-medium">{fileName}</p>
            <div className="flex items-center text-sm text-muted-foreground gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{getCurrentDate()}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{recordingDuration}</span>
              </div>
            </div>
          </div>
          
          {recordingType === 'audio' ? (
            <audio src={recordingData.url} controls className="w-full" />
          ) : (
            <video src={recordingData.url} controls className="w-full rounded-md" />
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Share Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full flex justify-start" 
              onClick={handleDownload}
            >
              <Download className="mr-2 h-5 w-5" />
              Download Recording
            </Button>
            
            <Button 
              className="w-full flex justify-start" 
              variant="outline"
              onClick={sendToTv}
              disabled={isSending}
            >
              <Tv className="mr-2 h-5 w-5" />
              Send to TV
            </Button>
            
            <Button 
              className="w-full flex justify-start"
              variant="secondary"
              onClick={sendToEmail}
              disabled={selectedFiles.length === 0}
            >
              <Mail className="mr-2 h-5 w-5" />
              Email Selected Media
              {selectedFiles.length > 0 && (
                <span className="ml-2 bg-secondary-foreground text-secondary rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {selectedFiles.length}
                </span>
              )}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Save to Library</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              value={fileName}
              readOnly
              className="input-field"
            />
            
            <Button 
              className="w-full" 
              onClick={saveRecording}
            >
              Save Recording
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={() => navigate('/')}>
          Finish
        </Button>
      </div>
    </div>
  );
};

export default Share;
