import { useLocation, Navigate } from 'react-router';
import type { MediaItemWithOwner } from '../types/DBTypes';
import Likes from '../components/Likes';
import Comments from '../components/Comments'; 

const Single = () => {
  const location = useLocation();
  const item = location.state as MediaItemWithOwner;

  if (!item) {
    return <Navigate to="/" />;
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-3xl font-bold mb-2">{item.title}</h2>
      <p className="text-gray-500 mb-4"><strong>Uploaded by:</strong> {item.username}</p>
      
      <div className="flex justify-center mb-4">
        {item.media_type.includes('video') ? (
          <video controls src={item.filename} className="max-w-full rounded" />
        ) : (
          <img src={item.filename} alt={item.title} className="max-w-full rounded" />
        )}
      </div>
      
      <p className="text-gray-800 text-lg mb-4">{item.description}</p>
      
      <Likes item={item} />

      {}
      <Comments item={item} />
      
      <div className="mt-6 text-sm text-gray-400 border-t pt-4">
        <p>Size: {item.filesize} bytes</p>
        <p>Type: {item.media_type}</p>
        <p>Created: {new Date(item.created_at).toLocaleString('fi-FI')}</p>
      </div>
    </div>
  );
};

export default Single;