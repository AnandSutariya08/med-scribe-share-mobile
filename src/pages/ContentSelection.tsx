
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toggleFileSelection, setCurrentCategory } from '@/store/contentSlice';
import { ArrowLeft, Folder, File, Check } from 'lucide-react';
import { RootState, AudioFile } from '@/types/AppTypes';

interface LocationState {
  recordingType: 'audio' | 'video';
  fileName: string;
  email: string;
}

interface CategoryItemProps {
  item: AudioFile;
  isFolder?: boolean;
  isSelected?: boolean;
  onToggle: () => void;
  depth?: number;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ 
  item, 
  isFolder = true, 
  isSelected = false, 
  onToggle,
  depth = 0
}) => {
  return (
    <div 
      className={`file-item ${isSelected ? 'file-item-selected' : ''} ${depth > 0 ? 'ml-' + (depth * 4) : ''}`}
      onClick={onToggle}
    >
      {isFolder ? (
        <Folder className="h-5 w-5 mr-3 text-primary" />
      ) : (
        <File className="h-5 w-5 mr-3 text-primary" />
      )}
      <div className="flex-1">
        <p className="font-medium">{item.name}</p>
        {!isFolder && item.description && (
          <p className="text-sm text-muted-foreground">{item.description}</p>
        )}
        {!isFolder && item.runtime && (
          <p className="text-xs text-muted-foreground mt-1">{item.runtime}</p>
        )}
      </div>
      {!isFolder && (
        <Checkbox 
          checked={isSelected}
          className="ml-2"
          onCheckedChange={() => onToggle()}
        />
      )}
    </div>
  );
};

const ContentSelection = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { recordingType, fileName, email } = location.state as LocationState;
  
  const categories = useSelector((state: RootState) => state.content.categories);
  const currentCategory = useSelector((state: RootState) => state.content.currentCategory);
  const selectedFiles = useSelector((state: RootState) => state.content.selectedFiles);
  
  const [expandedFolders, setExpandedFolders] = useState<number[]>([]);
  
  const handleCategoryChange = (category) => {
    dispatch(setCurrentCategory(category));
  };
  
  const toggleFolder = (folderId) => {
    setExpandedFolders(prev => 
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  };
  
  const handleFileSelection = (fileId) => {
    dispatch(toggleFileSelection(fileId));
  };
  
  const handleContinue = () => {
    navigate('/recording', {
      state: {
        recordingType,
        fileName,
        email,
        selectedFiles
      }
    });
  };
  
  const handleBack = () => {
    navigate('/');
  };

  const renderItems = (items: AudioFile[], depth = 0) => {
    return items.map(item => (
      <React.Fragment key={item.id}>
        <Card className="overflow-hidden mb-2">
          <CategoryItem 
            item={item} 
            isFolder={item.type === 1}
            onToggle={() => item.type === 1 ? toggleFolder(item.id) : handleFileSelection(item.id)}
            isSelected={selectedFiles.includes(item.id)}
            depth={depth}
          />
          
          {item.type === 1 && expandedFolders.includes(item.id) && item.children && (
            <CardContent className="pt-2">
              {renderItems(item.children, depth + 1)}
            </CardContent>
          )}
        </Card>
      </React.Fragment>
    ));
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
      
      <h1 className="text-2xl font-bold mb-6">Select Content</h1>
      
      <Tabs 
        defaultValue={currentCategory}
        onValueChange={handleCategoryChange}
        value={currentCategory}
      >
        <TabsList className="grid grid-cols-4 mb-6 w-full">
          <TabsTrigger value="Audio">Audio</TabsTrigger>
          <TabsTrigger value="Edu">Edu</TabsTrigger>
          <TabsTrigger value="Movies">Movies</TabsTrigger>
          <TabsTrigger value="Relax">Relax</TabsTrigger>
        </TabsList>
        
        {Object.keys(categories).map(category => (
          <TabsContent key={category} value={category} className="space-y-4">
            {renderItems(categories[category])}
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
        <Button onClick={handleContinue} disabled={selectedFiles.length === 0}>
          Continue to Recording
          {selectedFiles.length > 0 && (
            <span className="ml-2 bg-white text-primary rounded-full h-6 w-6 flex items-center justify-center text-sm">
              {selectedFiles.length}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContentSelection;
