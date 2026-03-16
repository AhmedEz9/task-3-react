import { useReducer, useEffect } from 'react';
import { useUserContext } from '../hooks/ContextHooks';
import { useLike } from '../hooks/apiHooks';
import type { MediaItemWithOwner } from '../types/DBTypes';

type Like = { like_id: number; media_id: number; user_id: number };

type LikeState = {
  count: number;
  userLike: Like | null;
};

type LikeAction = {
  type: 'setLikeCount' | 'like';
  like?: Like | null;
  count?: number;
};

const likeInitialState: LikeState = {
  count: 0,
  userLike: null,
};

function likeReducer(state: LikeState, action: LikeAction): LikeState {
  switch (action.type) {
    case 'setLikeCount':
      return { ...state, count: action.count ?? 0 };
    case 'like':
      if (action.like !== undefined) {
        return { ...state, userLike: action.like };
      }
      return state;
    default:
      return state;
  }
}

const Likes = ({ item }: { item: MediaItemWithOwner | null }) => {
  const { user } = useUserContext();
  const [likeState, likeDispatch] = useReducer(likeReducer, likeInitialState);
  
  const { postLike, deleteLike, getCountByMediaId, getUserLike } = useLike();

  const getLikeCount = async () => {
    if (!item) return;
    try {
      const count = await getCountByMediaId(item.media_id);
      likeDispatch({ type: 'setLikeCount', count });
    } catch (e) {
      console.error('get like count error', (e as Error).message);
    }
  };

  const getLikes = async () => {
    const token = localStorage.getItem('token');
    if (!item || !token) return;
    try {
      const userLike = await getUserLike(item.media_id, token);
      likeDispatch({ type: 'like', like: userLike });
    } catch (e) {
      likeDispatch({ type: 'like', like: null });
      console.error('get user like error', (e as Error).message);
    }
  };

  useEffect(() => {
    getLikeCount();
    getLikes();
  }, [item]);

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!item || !token) return;

      if (likeState.userLike) {
        await deleteLike(likeState.userLike.like_id, token);
      } else {
        await postLike(item.media_id, token);
      }
      
      getLikes();
      getLikeCount();
    } catch (e) {
      console.error('like error', (e as Error).message);
    }
  };

  if (!item) return null;

  return (
    <div className="flex items-center gap-4 mt-4">
      <p className="font-semibold text-lg text-gray-700">Likes: {likeState.count}</p>
      
      {user && (
        <button 
          className={`px-4 py-1 rounded text-sm font-bold transition-colors ${
            likeState.userLike 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-blue-500 text-white hover:bg-blue-600' 
          }`}
          onClick={handleLike}
        >
          {likeState.userLike ? 'Unlike' : 'Like'}
        </button>
      )}
    </div>
  );
};

export default Likes;