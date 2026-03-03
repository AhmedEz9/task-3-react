import { useState, useEffect } from 'react';
import type { MediaItem, MediaItemWithOwner } from '../types/DBTypes';

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

export { useMedia };