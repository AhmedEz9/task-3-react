import { Link } from 'react-router';
import type { MediaItemWithOwner } from '../types/DBTypes';

const MediaRow = ({ item }: { item: MediaItemWithOwner }) => {
  return (
    <tr>
      <td>
        <img src={item.thumbnail} alt={item.title} />
      </td>
      {/* 2. Add this new cell to show the username */}
      <td>{item.username}</td>
      
      <td>{item.title}</td>
      <td>{item.description}</td>
      <td>{new Date(item.created_at).toLocaleString('fi-FI')}</td>
      <td>{item.filesize}</td>
      <td>{item.media_type}</td>
      <td>
        {/* Pass the item with the owner in the state */}
        <Link to="/single" state={item}>View</Link>
      </td>
    </tr>
  );
};

export default MediaRow;