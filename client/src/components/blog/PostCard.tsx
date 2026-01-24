import { Badge } from "@/components/ui/badge";
import { getCategoryColor } from "@/lib/blog-utils";
import { BlogPost } from "@/lib/types";
import { formatDate } from "@/lib/blog-utils";
import { Clock, User } from "lucide-react";
import { Image } from "@/components/ui/image";

interface PostCardProps {
  post: BlogPost;
}

export function PostCard({ post }: PostCardProps) {
  const categoryColor = getCategoryColor(post.category);

  return (
    <article className="group border border-gray-200 hover:border-black transition-all duration-300 hover:shadow-lg overflow-hidden">
      {/* Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <Image
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category Badge */}
        <div className="mb-3">
          <Badge
            variant="outline"
            className="border rounded-full text-xs font-semibold"
            style={{ borderColor: categoryColor, color: categoryColor }}
          >
            {post.category}
          </Badge>
        </div>

        {/* Title */}
        <h3 className="font-oswald text-xl font-bold mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{post.excerpt}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{post.author}</span>
          </div>
          <span>{formatDate(post.date)}</span>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <a
              key={tag}
              href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
              aria-label={`View articles tagged ${tag}`}
            >
              #{tag}
            </a>
          ))}
        </div>

        {/* Read More Link */}
        <a
          href={`/blog/${post.slug}`}
          className="inline-block mt-4 font-semibold text-blue-600 hover:text-blue-700 text-sm"
        >
          Read More →
        </a>
      </div>
    </article>
  );
}
