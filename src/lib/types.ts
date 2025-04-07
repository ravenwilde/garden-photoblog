export interface Post {
  id: string;
  title: string;
  description: string;
  notes?: string;
  date: string;
  created_at: string;
  updated_at: string;
  images: Array<{
    id: string;
    url: string;
    alt?: string;
    width?: number;
    height?: number;
  }>;
  tags?: string[];
}
