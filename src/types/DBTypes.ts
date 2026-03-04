export interface MediaItem {
  media_id: number;
  user_id: number;
  filename: string;
  thumbnail: string;
  filesize: number;
  media_type: string;
  title: string;
  description: string;
  created_at: string;
  screenshots?: string[];
}

export type MediaItemWithOwner = MediaItem & {
  username: string;
};


export type User = {
  user_id: number;
  username: string;
  password?: string; 
  email: string;
  created_at: string;
};

export type AuthResponse = {
  message: string;
  token: string;
  user: User;
};

export type UploadResponse = {
  message: string;
  data: {
    filename: string;
    media_type: string;
    filesize: number;
  };
};

export type MediaResponse = {
  message: string;
  media_id: number;
};