import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { getAllPosts } from '@/lib/posts';

export const revalidate = 0; // Disable cache for now

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No posts yet. Click &quot;New Post&quot; to create one!
          </div>
        )}
      </main>
    </div>
  );
}
