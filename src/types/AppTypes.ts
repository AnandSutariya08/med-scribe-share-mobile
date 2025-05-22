
export interface AudioFile {
  id: number;
  type: 1 | 2; // 1 for folder, 2 for file
  name: string;
  children?: AudioFile[];
  description?: string;
  href?: string;
  thumbnailHref?: string;
  runtime?: string;
}

export interface ContentState {
  categories: {
    [key: string]: AudioFile[];
  };
  selectedFiles: number[];
  currentCategory: string;
}

export interface RootState {
  content: ContentState;
}
