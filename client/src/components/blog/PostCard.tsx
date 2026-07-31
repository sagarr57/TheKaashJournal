import { getCategoryColor } from "@/lib/blog-utils";
import { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/blog-utils";
import { Clock, User } from "lucide-react";
import { Image } from "@/components/ui/image";
import { fetchPostBySlugWithContent } from "@/lib/blog-data";

function prefetchPost(slug: string) {
  fetchPostBySlugWithContent(slug).catch(() => {});
}

interface PostCardProps {
  post: BlogPost;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const categoryColor = getCategoryColor(post.category);

  return (
    <article className={`group bg-white rounded-2xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col ${className || ""}`}>
      {/* Image */}
      <a href={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden bg-gray-100 shrink-0" onMouseEnter={() => prefetchPost(post.slug)} onFocus={() => prefetchPost(post.slug)}>
        <Image
          src={post.image}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        {/* Category pill over image */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-block text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-sm border"
            style={{ borderColor: `${categoryColor}40`, color: categoryColor }}
          >
            {post.category}
          </span>
        </div>
      </a>

      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-1">
        {/* Title */}
        <h3 className="font-oswald text-base md:text-lg font-bold normal-case tracking-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug">
          <a href={`/blog/${post.slug}`} onMouseEnter={() => prefetchPost(post.slug)}>{post.title}</a>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-500 text-sm line-clamp-2 mb-3 leading-relaxed flex-1">{post.excerpt}</p>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400 mb-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span className="text-gray-500 font-medium">{post.author}</span>
          </div>
          <span aria-hidden>·</span>
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>·</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <a
              key={tag}
              href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[11px] bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-700 px-2 py-0.5 rounded-full border border-gray-100 transition-colors"
              aria-label={`View articles tagged ${tag}`}
            >
              #{tag}
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}
