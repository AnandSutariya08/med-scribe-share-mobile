
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import RecordingHistory from '@/components/RecordingHistory';
import { Mic, Video } from 'lucide-react';
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const [recordingType, setRecordingType] = useState<'audio' | 'video'>('audio');
  const [fileName, setFileName] = useState('');
  const [email, setEmail] = useState('');

  const handleStartRecording = () => {
    // Validate inputs
    if (!fileName.trim()) {
      toast.error('Please enter a file name');
      return;
    }
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }
    
    // Navigate to content selection page with recording parameters
    navigate('/content-selection', {
      state: {
        recordingType,
        fileName,
        email
      }
    });
  };
  
  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <div className="app-container min-h-screen">
      <header className="mb-8 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">DocMedia</h1>
        <p className="text-muted-foreground">Record, organize, and share medical media</p>
      </header>
      
      <Tabs defaultValue="record" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="record" className="flex-1">Record</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="record">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-center">New Recording</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="recording-type">Recording Type</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={recordingType === 'audio' ? 'default' : 'outline'}
                    onClick={() => setRecordingType('audio')}
                    className={`flex items-center justify-center h-24 ${recordingType === 'audio' ? 'border-primary' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      <Mic className="h-10 w-10 mb-2" />
                      <span>Audio</span>
                    </div>
                  </Button>
                  <Button
                    type="button"
                    variant={recordingType === 'video' ? 'default' : 'outline'}
                    onClick={() => setRecordingType('video')}
                    className={`flex items-center justify-center h-24 ${recordingType === 'video' ? 'border-primary' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      <Video className="h-10 w-10 mb-2" />
                      <span>Video</span>
                    </div>
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file-name">File Name</Label>
                <Input 
                  id="file-name" 
                  placeholder="Enter file name" 
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="input-field"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="doctor@hospital.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                />
              </div>
              
              <Button 
                className="w-full mt-4" 
                size="lg"
                onClick={handleStartRecording}
              >
                Continue to Content Selection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <RecordingHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
