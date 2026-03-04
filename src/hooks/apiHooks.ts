import { useState, useEffect } from 'react';
import type { 
  MediaItem, 
  MediaItemWithOwner, 
  UploadResponse, 
  MediaResponse 
} from '../types/DBTypes';
import type { Credentials } from '../types/LocalTypes';

const useMedia = () => {
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);

  const getMedia = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_MEDIA_API + '/media');
      if (!response.ok) throw new Error('Network response was not ok');
      const mediaItems: MediaItem[] = await response.json();

      const itemsWithOwner: MediaItemWithOwner[] = await Promise.all(
        mediaItems.map(async (item) => {
          const userResponse = await fetch(import.meta.env.VITE_AUTH_API + '/users/' + item.user_id);
          const userData = await userResponse.json();
          
          return {
            ...item,
            username: userData.username,
          };
        })
      );

      setMediaArray(itemsWithOwner);
    } catch (error) {
      console.error('Error fetching media:', (error as Error).message);
    }
  };

  useEffect(() => {
    getMedia();
  }, []);

  const postMedia = async (
    fileResponse: UploadResponse,
    inputs: Record<string, string>,
    token: string
  ): Promise<MediaResponse> => {
    const mediaData = {
      title: inputs.title,
      description: inputs.description,
      filename: fileResponse.data.filename,
      media_type: fileResponse.data.media_type,
      filesize: fileResponse.data.filesize,
    };

    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mediaData),
    };

    const response = await fetch(import.meta.env.VITE_MEDIA_API + '/media', fetchOptions);
    if (!response.ok) throw new Error('Media upload failed');
    return await response.json();
  };

  return { mediaArray, postMedia };
};

const useAuthentication = () => {
  const postLogin = async (inputs: Credentials) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    const response = await fetch(import.meta.env.VITE_AUTH_API + '/auth/login', fetchOptions);
    if (!response.ok) throw new Error('Login failed: Invalid credentials');
    return await response.json();
  };

  const postRegister = async (inputs: Record<string, string>) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    const response = await fetch(import.meta.env.VITE_AUTH_API + '/users', fetchOptions);
    if (!response.ok) throw new Error('Registration failed');
    return await response.json();
  };

  const getUserByToken = async (token: string) => {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await fetch(import.meta.env.VITE_AUTH_API + '/users/token', fetchOptions);
    if (!response.ok) throw new Error('Invalid token');
    return await response.json();
  };

  return { postLogin, postRegister, getUserByToken };
};

const useFile = () => {
  const postFile = async (file: File, token: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    };

    const response = await fetch(import.meta.env.VITE_UPLOAD_API + '/upload', fetchOptions);
    if (!response.ok) throw new Error('File upload failed');
    return await response.json();
  };

  return { postFile };
};

export { useMedia, useAuthentication, useFile };