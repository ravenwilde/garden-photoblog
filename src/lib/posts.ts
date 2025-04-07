import fs from 'fs/promises';
import path from 'path';
import { Post } from '@/types';
import { samplePosts } from './sample-data';

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');

// Ensure data directory exists
async function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

// Initialize posts file if it doesn't exist
async function initializePostsFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await ensureDataDir();
    await fs.writeFile(DATA_FILE, JSON.stringify(samplePosts, null, 2));
  }
}

export async function getAllPosts(): Promise<Post[]> {
  await initializePostsFile();
  const content = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(content);
}

export async function createPost(post: Omit<Post, 'id'>): Promise<Post> {
  const posts = await getAllPosts();
  
  const newPost: Post = {
    ...post,
    id: Math.random().toString(36).substring(2) + Date.now().toString(36),
  };
  
  await fs.writeFile(
    DATA_FILE,
    JSON.stringify([newPost, ...posts], null, 2)
  );
  
  return newPost;
}

export async function deletePost(id: string): Promise<void> {
  const posts = await getAllPosts();
  const updatedPosts = posts.filter(post => post.id !== id);
  await fs.writeFile(DATA_FILE, JSON.stringify(updatedPosts, null, 2));
}

export async function updatePost(id: string, updatedPost: Partial<Post>): Promise<Post> {
  const posts = await getAllPosts();
  const index = posts.findIndex(post => post.id === id);
  
  if (index === -1) {
    throw new Error('Post not found');
  }
  
  const updated = {
    ...posts[index],
    ...updatedPost,
    id, // Ensure ID doesn't change
  };
  
  posts[index] = updated;
  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2));
  
  return updated;
}
