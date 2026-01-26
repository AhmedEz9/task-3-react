import {MediaItem} from '../types/DBTypes';
import MediaRow from './MediaRow';

const mediaArray: MediaItem[] = [
  {
    media_id: 8,
    user_id: 5,
    filename: 'https://placehold.co/600x400?text=Pic1',
    thumbnail: 'https://placehold.co/320x240?text=Thumb1',
    filesize: 170469,
    media_type: 'image/jpeg',
    title: 'Picture 1',
    description: 'This is a placeholder picture.',
    created_at: '2024-01-07T20:49:34.000Z',
  },
  {
    media_id: 9,
    user_id: 7,
    filename: 'https://placehold.co/600x400?text=Pic2',
    thumbnail: 'https://placehold.co/320x240?text=Thumb2',
    filesize: 1002912,
    media_type: 'image/jpeg',
    title: 'Pic 2',
    description: 'Another cool picture',
    created_at: '2024-01-07T21:32:27.000Z',
  },
  {
    media_id: 17,
    user_id: 2,
    filename:
      'http://distribution.bbb3d.renderfarming.net/video/mp4/bbb_sunflower_1080p_60fps_normal.mp4',
    thumbnail: 'https://placehold.co/320x240?text=Video',
    filesize: 1236616,
    media_type: 'video/mp4',
    title: 'Bunny',
    description: 'Butterflies fly around the bunny.',
    created_at: '2024-01-07T20:48:13.000Z',
  },
];

const Home = () => {
  return (
    <>
      <h2>My Media</h2>
      <table>
        <thead>
          <tr>
            <th>Thumbnail</th>
            <th>Title</th>
            <th>Description</th>
            <th>Created</th>
            <th>Size</th>
            <th>Type</th>
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