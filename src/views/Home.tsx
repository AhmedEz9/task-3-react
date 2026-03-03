import { useState, useEffect } from 'react';
import MediaRow from '../components/MediaRow';
import type { MediaItem, MediaItemWithOwner } from '../types/DBTypes';

const Home = () => {
  // 1. Notice the type is now MediaItemWithOwner[] because we are adding the username
  const [mediaArray, setMediaArray] = useState<MediaItemWithOwner[]>([]);

  const getMedia = async () => {
    try {
      // 2. Fetch the media list from the real API
      const response = await fetch(import.meta.env.VITE_MEDIA_API + '/media');
      if (!response.ok) throw new Error('Network response was not ok');
      const mediaItems: MediaItem[] = await response.json();

      // 3. Use Promise.all to fetch the username for every single media item
      const itemsWithOwner: MediaItemWithOwner[] = await Promise.all(
        mediaItems.map(async (item) => {
          const userResponse = await fetch(import.meta.env.VITE_AUTH_API + '/users/' + item.user_id);
          const userData = await userResponse.json();
          
          // Combine the original item with the new username
          return {
            ...item,
            username: userData.username,
          };
        })
      );

      // 4. Save the combined data to state
      setMediaArray(itemsWithOwner);
      console.log('Fetched real data with owners:', itemsWithOwner);
      
    } catch (error) {
      console.log('Error fetching media:', (error as Error).message);
    }
  };

  useEffect(() => {
    getMedia();
  }, []);

  return (
    <>
      <h2>Home</h2>
      <table>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Owner</th>
            <th>Title</th>
            <th>Description</th>
            <th>Created</th>
            <th>Size</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mediaArray.map((item) => (
            <MediaRow key={item.media_id} item={item} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;