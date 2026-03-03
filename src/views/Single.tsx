import { useLocation, Navigate } from 'react-router';
import type { MediaItemWithOwner } from '../types/DBTypes';

const Single = () => {
  const location = useLocation();
  // 1. Update the type here
  const item = location.state as MediaItemWithOwner;

  if (!item) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <h2>{item.title}</h2>
      {/* 2. Display the owner's username */}
      <p><strong>Uploaded by:</strong> {item.username}</p>
      
      {item.media_type.includes('video') ? (
        <video controls src={item.filename} width="400"></video>
      ) : (
        <img src={item.filename} alt={item.title} width="400" />
      )}
      <p>{item.description}</p>
      <p>Size: {item.filesize} bytes</p>
      <p>Type: {item.media_type}</p>
      <p>Created: {new Date(item.created_at).toLocaleString('fi-FI')}</p>
    </>
  );
};

export default Single;