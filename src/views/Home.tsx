import { useState, useEffect } from 'react';
import MediaRow from '../components/MediaRow';
import type { MediaItem } from '../types/DBTypes';

const Home = () => {
  // 1. State to hold our media items (starts as an empty array)
  const [mediaArray, setMediaArray] = useState<MediaItem[]>([]);

  // 2. Function to fetch data from test.json
  const getMedia = async () => {
    try {
      const response = await fetch('test.json');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const json = await response.json();
      
      setMediaArray(json);
      console.log('Fetched data:', json); 
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
            <th>Title</th>
            <th>Description</th>
            <th>Created</th>
            <th>Size</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Loop through the state array and render a MediaRow for each item */}
          {mediaArray.map((item) => (
            <MediaRow key={item.media_id} item={item} />
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Home;