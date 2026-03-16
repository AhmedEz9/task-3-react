import { useState, useEffect } from 'react';
import type { 
  MediaItem, 
  MediaItemWithOwner, 
  UploadResponse, 
  MediaResponse 
} from '../types/DBTypes';
import type { Credentials } from '../types/LocalTypes';

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

  const postMedia = async (
    fileResponse: UploadResponse,
    inputs: Record<string, string>,
    token: string
  ): Promise<MediaResponse> => {
    const mediaData = {
      title: inputs.title,
      description: inputs.description,
      filename: fileResponse.data.filename,
      media_type: fileResponse.data.media_type,
      filesize: fileResponse.data.filesize,
    };

    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mediaData),
    };

    const response = await fetch(import.meta.env.VITE_MEDIA_API + '/media', fetchOptions);
    if (!response.ok) throw new Error('Media upload failed');
    return await response.json();
  };

  return { mediaArray, postMedia };
};

const useAuthentication = () => {
  const postLogin = async (inputs: Credentials) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    const response = await fetch(import.meta.env.VITE_AUTH_API + '/auth/login', fetchOptions);
    if (!response.ok) throw new Error('Login failed: Invalid credentials');
    return await response.json();
  };

  const postRegister = async (inputs: Record<string, string>) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputs),
    };
    const response = await fetch(import.meta.env.VITE_AUTH_API + '/users', fetchOptions);
    if (!response.ok) throw new Error('Registration failed');
    return await response.json();
  };

  const getUserByToken = async (token: string) => {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await fetch(import.meta.env.VITE_AUTH_API + '/users/token', fetchOptions);
    if (!response.ok) throw new Error('Invalid token');
    return await response.json();
  };

  const getUsernameAvailable = async (username: string) => {
    const response = await fetch(import.meta.env.VITE_AUTH_API + '/users/username/' + username);
    const result = await response.json();
    return result.available;
  };

  const getEmailAvailable = async (email: string) => {
    const response = await fetch(import.meta.env.VITE_AUTH_API + '/users/email/' + email);
    const result = await response.json();
    return result.available;
  };

  return { postLogin, postRegister, getUserByToken, getUsernameAvailable, getEmailAvailable };
};

const useFile = () => {
  const postFile = async (file: File, token: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      body: formData,
    };

    const response = await fetch(import.meta.env.VITE_UPLOAD_API + '/upload', fetchOptions);
    if (!response.ok) throw new Error('File upload failed');
    return await response.json();
  };

  return { postFile };
};

const useLike = () => {
  const postLike = async (media_id: number, token: string) => {
    const fetchOptions = {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ media_id }),
    };
    const response = await fetch(import.meta.env.VITE_MEDIA_API + '/likes', fetchOptions);
    if (!response.ok) throw new Error('Like failed');
    return await response.json();
  };

  const deleteLike = async (like_id: number, token: string) => {
    const fetchOptions = {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await fetch(import.meta.env.VITE_MEDIA_API + '/likes/' + like_id, fetchOptions);
    if (!response.ok) throw new Error('Delete like failed');
    return await response.json();
  };

  const getCountByMediaId = async (media_id: number) => {
    const response = await fetch(import.meta.env.VITE_MEDIA_API + '/likes/count/' + media_id);
    if (!response.ok) throw new Error('Get like count failed');
    const result = await response.json();
    return result.count;
  };

  const getUserLike = async (media_id: number, token: string) => {
    const fetchOptions = {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    };
    const response = await fetch(import.meta.env.VITE_MEDIA_API + '/likes/bymedia/user/' + media_id, fetchOptions);
    if (!response.ok) throw new Error('Get user like failed');
    return await response.json();
  };

  return { postLike, deleteLike, getCountByMediaId, getUserLike };
};

const useComment = () => {
  const postComment = async (
     comment_text: string,
     media_id: number,
     token: string) => {
      const fetchOptions = {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment_text, media_id }),
      };
      const response = await fetch(import.meta.env.VITE_MEDIA_API + '/comments', fetchOptions);
      if (!response.ok) throw new Error('Post comment failed');
      return await response.json();
  };

  const getCommentsByMediaId = async (media_id: number) => {
      const response = await fetch(import.meta.env.VITE_MEDIA_API + '/comments/bymedia/' + media_id);
      if (!response.ok) throw new Error('Get comments failed');
      const comments: (Comment & {user_id: number})[] = await response.json();
      
      const commentsWithUsername = await Promise.all(
        comments.map(async (comment) => {
          const userRes = await fetch(import.meta.env.VITE_AUTH_API + '/users/' + comment.user_id);
          const userData = await userRes.json();
          return { ...comment, username: userData.username };
        })
      );
      return commentsWithUsername;
  };

  return { postComment, getCommentsByMediaId };
};

export { useMedia, useAuthentication, useFile, useLike, useComment };