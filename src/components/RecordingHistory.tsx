
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, Video, Calendar, Clock, Download, Share } from 'lucide-react';
import { Button } from "@/components/ui/button";

// Mock history data - in a real app this would come from a database or local storage
const mockRecordings = [
  {
    id: 1,
    name: "Patient Interview Notes",
    type: "audio",
    date: "2023-04-12",
    duration: "12:34",
  },
  {
    id: 2,
    name: "Surgery Explanation",
    type: "video",
    date: "2023-04-10",
    duration: "05:46",
  },
  {
    id: 3,
    name: "Medication Instructions",
    type: "audio",
    date: "2023-04-07",
    duration: "03:21",
  },
];

const RecordingHistory = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Recording History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {mockRecordings.length > 0 ? (
          mockRecordings.map((recording) => (
            <div 
              key={recording.id}
              className="flex items-center border rounded-lg p-3 hover:bg-accent transition-colors"
            >
              <div className="mr-4 p-3 bg-primary/10 rounded-full">
                {recording.type === 'audio' ? (
                  <Mic className="h-6 w-6 text-primary" />
                ) : (
                  <Video className="h-6 w-6 text-primary" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium">{recording.name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span className="mr-3">{recording.date}</span>
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{recording.duration}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recordings found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecordingHistory;
