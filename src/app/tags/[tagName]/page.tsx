import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import { getAllPostsStatic } from '@/lib/posts-static';
import { getAllTagsStatic } from '@/lib/tags-static';
import Link from 'next/link';

export const revalidate = 0; // Disable cache for now

interface TagPageProps {
  params: {
    tagName: string;
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tagName } = params;
  const decodedTagName = decodeURIComponent(tagName);

  // Get all tags for the filter component
  const allTags = await getAllTagsStatic();

  // Check if the tag exists
  const tagExists = allTags.some(tag => tag.name === decodedTagName);
  if (!tagExists) {
    notFound();
  }

  // Get posts filtered by tag
  const posts = await getAllPostsStatic(decodedTagName);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            href="/"
            className="text-emerald-600 dark:text-emerald-400 hover:underline mb-4 inline-flex items-center text-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to all posts
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 mt-2">
            Posts tagged with &ldquo;{decodedTagName}&rdquo;
          </h1>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No posts found with this tag.
          </div>
        )}
      </main>
    </div>
  );
}
