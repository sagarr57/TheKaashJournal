import { PostCard } from "./PostCard";
import { getRelatedPosts } from "@/lib/blog-utils";
import { BlogPost } from "@/lib/types";

interface RelatedPostsProps {
  currentPost: BlogPost;
}

export function RelatedPosts({ currentPost }: RelatedPostsProps) {
  const relatedPosts = getRelatedPosts(currentPost, 3);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-10 pt-8 md:pt-10 border-t border-gray-200">
      <h2 className="font-oswald text-xl md:text-2xl font-bold mb-5 uppercase">
        Related <span className="text-blue-600">Articles</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {relatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
