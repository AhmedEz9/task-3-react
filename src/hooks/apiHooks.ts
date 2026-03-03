import { useState, useEffect } from 'react';
import type { MediaItem, MediaItemWithOwner } from '../types/DBTypes';
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

  return { mediaArray };
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
    
    // Send the data to the auth API
    const response = await fetch(import.meta.env.VITE_AUTH_API + '/auth/login', fetchOptions);
    
    if (!response.ok) {
      throw new Error('Login failed: Invalid credentials');
    }
    
    const loginResult = await response.json();
    return loginResult;
  };

  const postRegister = async (inputs: Record<string, string>) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    
    // The registration endpoint is /users
    const response = await fetch(import.meta.env.VITE_AUTH_API + '/users', fetchOptions);
    
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    
    const registerResult = await response.json();
    return registerResult;
  };

  return { postLogin, postRegister };
};

export { useMedia, useAuthentication };