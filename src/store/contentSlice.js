
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  categories: {
    Audio: [
      {
        id: 32,
        type: 1, // folder
        name: "Audio Books",
        children: [
          {
            id: 334,
            type: 2, // file
            name: "Anne Perry-Execution Dock.mp3",
            description: "A William Monk Novel",
            href: "https://example.com/audio/execution-dock.mp3",
            thumbnailHref: "https://example.com/thumbnails/book-cover.jpg",
            runtime: "12Hr 51Min",
          },
          {
            id: 335,
            type: 2,
            name: "The Silent Patient.mp3",
            description: "By Alex Michaelides",
            href: "https://example.com/audio/silent-patient.mp3",
            thumbnailHref: "https://example.com/thumbnails/silent-patient.jpg",
            runtime: "8Hr 43Min",
          }
        ],
      },
      {
        id: 33,
        type: 1,
        name: "Medical Lectures",
        children: [
          {
            id: 336,
            type: 2,
            name: "Latest Advances in Cardiology.mp3",
            description: "By Dr. Sarah Johnson",
            href: "https://example.com/audio/cardiology-advances.mp3",
            thumbnailHref: "https://example.com/thumbnails/cardiology.jpg",
            runtime: "1Hr 24Min",
          },
        ],
      },
    ],
    Edu: [
      {
        id: 40,
        type: 1,
        name: "Medical Training",
        children: [
          {
            id: 401,
            type: 2,
            name: "Patient Assessment Techniques.mp4",
            description: "Best practices for initial assessment",
            href: "https://example.com/edu/patient-assessment.mp4",
            thumbnailHref: "https://example.com/thumbnails/assessment.jpg",
            runtime: "45Min",
          },
          {
            id: 402,
            type: 2,
            name: "Modern Surgical Approaches.mp4",
            description: "Minimally invasive techniques",
            href: "https://example.com/edu/surgical-approaches.mp4",
            thumbnailHref: "https://example.com/thumbnails/surgery.jpg",
            runtime: "1Hr 12Min",
          }
        ],
      },
    ],
    Movies: [
      {
        id: 50,
        type: 1,
        name: "Medical Documentaries",
        children: [
          {
            id: 501,
            type: 2,
            name: "The Pandemic Response.mp4",
            description: "Global healthcare challenges",
            href: "https://example.com/movies/pandemic-response.mp4",
            thumbnailHref: "https://example.com/thumbnails/pandemic.jpg",
            runtime: "1Hr 48Min",
          },
        ],
      },
    ],
    Relax: [
      {
        id: 60,
        type: 1,
        name: "Nature Sounds",
        children: [
          {
            id: 601,
            type: 2,
            name: "Ocean Waves.mp3",
            description: "Calming beach ambience",
            href: "https://example.com/relax/ocean-waves.mp3",
            thumbnailHref: "https://example.com/thumbnails/ocean.jpg",
            runtime: "1Hr",
          },
          {
            id: 602,
            type: 2,
            name: "Rainfall.mp3",
            description: "Gentle rain on leaves",
            href: "https://example.com/relax/rainfall.mp3",
            thumbnailHref: "https://example.com/thumbnails/rain.jpg",
            runtime: "45Min",
          }
        ],
      },
    ],
  },
  selectedFiles: [],
  currentCategory: 'Audio',
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setCurrentCategory: (state, action) => {
      state.currentCategory = action.payload;
    },
    toggleFileSelection: (state, action) => {
      const fileId = action.payload;
      const index = state.selectedFiles.findIndex(id => id === fileId);
      
      if (index === -1) {
        state.selectedFiles.push(fileId);
      } else {
        state.selectedFiles.splice(index, 1);
      }
    },
    clearSelectedFiles: (state) => {
      state.selectedFiles = [];
    },
    addRecording: (state, action) => {
      const { category, recording } = action.payload;
      
      // Add to the corresponding category
      if (state.categories[category]) {
        const personalFolder = state.categories[category].find(item => item.name === "My Recordings");
        
        if (personalFolder) {
          // Add to existing personal recordings folder
          personalFolder.children.push(recording);
        } else {
          // Create a personal recordings folder
          state.categories[category].push({
            id: Date.now(),
            type: 1,
            name: "My Recordings",
            children: [recording],
          });
        }
      }
    },
  },
});

export const { setCurrentCategory, toggleFileSelection, clearSelectedFiles, addRecording } = contentSlice.actions;
export default contentSlice.reducer;
