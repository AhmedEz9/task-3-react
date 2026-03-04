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

export { useMedia, useAuthentication };