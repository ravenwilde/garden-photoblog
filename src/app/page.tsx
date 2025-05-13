import Header from '@/components/Header';
import PostCard from '@/components/PostCard';
import FeaturedPost from '@/components/FeaturedPost';
import TagFilter from '@/components/TagFilter';
import { getAllPosts } from '@/lib/posts';
import { getTagsWithPostCounts } from '@/lib/tags';
import type { Post } from '@/types';

export const revalidate = 0; // Disable cache for now

export default async function Home({ searchParams }: { searchParams: { tag?: string } }) {
  // Get the tag filter from search params
  // In Next.js 15, we need to await searchParams before accessing its properties
  const params = await searchParams;
  const tagFilter = params.tag;

  // Get all tags for the filter component
  const tags = await getTagsWithPostCounts();

  // First get all posts without filtering to find the most recent post
  const allPosts = await getAllPosts();

  // Always separate the most recent post as the featured post
  let featuredPost: Post | null = null;
  let remainingPosts: Post[] = [];

  if (allPosts.length > 0) {
    [featuredPost, ...remainingPosts] = allPosts;
  }

  // If tag filter is applied, get all posts with that tag
  // If no filter, use the remaining posts (excluding featured)
  let displayPosts = remainingPosts;
  let showFeaturedPost = true;

  if (tagFilter) {
    // When a tag filter is applied, get all posts with that tag
    // including the featured post if it has the tag
    displayPosts = await getAllPosts(tagFilter);

    // Don't show the featured post separately when filtering
    showFeaturedPost = false;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {/* Tag filter */}
          {/* The TagFilter spans two columns on small screens (sm:col-span-2) */}
          {/* and one column on large screens (lg:col-span-1) to fit the responsive grid layout */}
          <div className="sm:col-span-2 lg:col-span-1 lg:order-last">
            <TagFilter tags={tags} className="lg:sticky lg:top-20" />
          </div>

          <div className="sm:col-span-2 lg:col-span-3 lg:order-first">
            {/* Show featured post only when no tag filter is applied */}
            {showFeaturedPost && featuredPost && <FeaturedPost post={featuredPost} />}

            {displayPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayPosts.map(post => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : null}

            {allPosts.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No posts yet. Click &quot;New Post&quot; to create one!
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
