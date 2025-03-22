export type Post = {
  id: string;
  title: string;
  content: string;
  user: { id: string; username: string };
  likes: { id: string; userId: string }[];
  createdAt: Date;
  updatedAt: Date;
};
