import { useEffect, useRef } from 'react';
import { useCommentStore } from '../store';
import { useUserContext } from '../hooks/ContextHooks';
import { useComment } from '../hooks/apiHooks';
import useForm from '../hooks/formHooks';
import type { MediaItemWithOwner } from '../types/DBTypes';

const Comments = ({ item }: { item: MediaItemWithOwner }) => {
  const { user } = useUserContext();
  const { comments, addComment, setComments } = useCommentStore();
  const { postComment, getCommentsByMediaId } = useComment();
  const formRef = useRef<HTMLFormElement>(null);

  const fetchComments = async () => {
    try {
      const apiComments = await getCommentsByMediaId(item.media_id);
      setComments(apiComments);
    } catch (e) {
      console.error('fetchComments error', (e as Error).message);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [item.media_id]);

  const initValues = { comment_text: '' };

  const doComment = async (inputs: Record<string, string>) => {
    const token = localStorage.getItem('token');
    if (!user || !token) return;
    
    try {
      await postComment(inputs.comment_text, item.media_id, token);
      
      addComment({
        comment_text: inputs.comment_text,
        media_id: item.media_id,
        user_id: user.user_id,
        username: user.username,
      });

      if (formRef.current) formRef.current.reset();
    } catch (e) {
      console.error('postComment error', (e as Error).message);
    }
  };

  const { handleSubmit, handleInputChange } = useForm(doComment, initValues);

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-bold mb-4">Comments ({comments.length})</h3>

      {user ? (
        <form onSubmit={handleSubmit} ref={formRef} className="mb-6 flex gap-2">
          <input
            name="comment_text"
            type="text"
            placeholder="Write a comment..."
            onChange={handleInputChange}
            className="flex-1 border p-2 rounded shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition-colors"
          >
            Post
          </button>
        </form>
      ) : (
        <p className="text-gray-500 italic mb-6">Log in to post a comment.</p>
      )}

      <ul className="space-y-4 list-none p-0">
        {comments.map((comment, index) => (
          <li key={index} className="bg-gray-100 p-3 rounded shadow-sm">
            <p className="text-sm font-bold text-blue-700">{comment.username}</p>
            <p className="text-gray-800">{comment.comment_text}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(comment.created_at!).toLocaleString('fi-FI')}
            </p>
          </li>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-400">No comments yet. Be the first!</p>
        )}
      </ul>
    </div>
  );
};

export default Comments;