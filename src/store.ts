import { create } from 'zustand';

export type Comment = {
  comment_id: number;
  comment_text: string;
  user_id: number;
  media_id: number;
  created_at: Date | string;
};

type CommentStore = {
   comments: Partial<Comment & {username: string}>[];
   setComments: (comments: Partial<Comment & {username: string}>[]) => void;
   addComment: (comment: Partial<Comment & {username: string}>) => void;
};

export const useCommentStore = create<CommentStore>((set) => ({
   comments: [],
   setComments: (comments) => set({ comments }), 
   addComment: (comment) =>
           set((state) => ({
              comments: [
                 ...state.comments,
                 {
                    ...comment,
                    created_at: new Date(),
                 },
              ],
           })),
}));