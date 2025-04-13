export interface Image {
  id?: string;
  url: string;
  alt?: string;
  width: number;
  height: number;
}

export interface Post {
  id: string;
  title: string;
  description: string;
  notes?: string;
  date: string;
  created_at: string;
  updated_at: string;
  images: Image[];
  tags?: string[];
}

export type NewPost = Omit<Post, 'id' | 'created_at' | 'updated_at'>;
