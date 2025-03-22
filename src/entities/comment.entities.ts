export type Comment = {
  id: string;
  content: string;
  user: { id: string; username: string };
  createdAt: Date;
  updatedAt: Date;
};
