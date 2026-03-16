import { Link } from 'react-router';
import type { MediaItemWithOwner } from '../types/DBTypes';
import { useUserContext } from '../hooks/ContextHooks';

const MediaRow = ({ item }: { item: MediaItemWithOwner }) => {
  const { user } = useUserContext();

  const isOwnerOrAdmin = user && (user.user_id === item.user_id || user.username === 'mediaAdmin');

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-2">
        <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded" />
      </td>
      <td className="p-2">{item.username}</td>
      <td className="p-2 font-semibold">{item.title}</td>
      <td className="p-2">{item.description}</td>
      <td className="p-2">{new Date(item.created_at).toLocaleString('fi-FI')}</td>
      <td className="p-2">{item.filesize}</td>
      <td className="p-2">{item.media_type}</td>
      <td className="p-2 flex gap-2 items-center h-full">
        {}
        <Link 
          to="/single" 
          state={item}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
        >
          View
        </Link>

        {}
        {isOwnerOrAdmin && (
          <>
            <button 
              className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600 transition-colors"
              onClick={() => console.log('modify', item)}
            >
              Modify
            </button>
            <button 
              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
              onClick={() => console.log('delete', item)}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  );
};

export default MediaRow;