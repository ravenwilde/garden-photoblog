export interface Post {
  id: string;
  title: string;
  description: string;
  notes?: string;
  date: string;
  images: Image[];
  tags: string[];
}

export interface Image {
  url: string;
  alt: string;
  width: number;
  height: number;
}
