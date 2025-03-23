export type Post = {
  id: string;
  title: string;
  content: string;
  user: { id: string; username: string };
  likes: boolean;
  likes_count: number;
  createdAt: Date;
  updatedAt: Date;
};
