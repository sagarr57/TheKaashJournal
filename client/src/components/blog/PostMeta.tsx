import { Badge } from "@/components/ui/badge";
import { getAuthorProfilePath } from "@/lib/authors";
import { formatDate, getCategoryColor } from "@/lib/blog-utils";
import { BlogPost } from "@/lib/types";
import { Calendar, Clock, User } from "lucide-react";

interface PostMetaProps {
  post: BlogPost;
}

export function PostMeta({ post }: PostMetaProps) {
  const categoryColor = getCategoryColor(post.category);
  const authorProfilePath = getAuthorProfilePath(post.author);

  return (
    <div className="space-y-5">
      <div>
        <Badge
          variant="outline"
          className="border rounded-full text-xs font-semibold px-3 py-0.5 tracking-wide"
          style={{ borderColor: categoryColor, color: categoryColor }}
        >
          {post.category}
        </Badge>
      </div>

      <p className="text-sm text-gray-600 flex flex-wrap items-center gap-x-1 gap-y-1">
        <span className="inline-flex items-center gap-1.5">
          <User className="w-4 h-4 text-gray-500 flex-shrink-0" aria-hidden />
          {authorProfilePath ? (
            <a
              href={authorProfilePath}
              className="text-gray-900 font-medium hover:text-blue-700 hover:underline"
            >
              {post.author}
            </a>
          ) : (
            <span className="text-gray-900 font-medium">{post.author}</span>
          )}
        </span>
        <span className="text-gray-300" aria-hidden>
          ·
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" aria-hidden />
          <time dateTime={post.date}>{formatDate(post.date)}</time>
        </span>
        <span className="text-gray-300" aria-hidden>
          ·
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" aria-hidden />
          <span>{post.readingTime} min read</span>
        </span>
        {post.updated && (
          <>
            <span className="text-gray-300 hidden sm:inline" aria-hidden>
              ·
            </span>
            <span className="w-full sm:w-auto text-xs text-gray-500 sm:inline">
              Updated {formatDate(post.updated)}
            </span>
          </>
        )}
      </p>

      <div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <a
              key={tag}
              href={`/tag/${tag.toLowerCase().replace(/\s+/g, "-")}`}
              className="inline-block text-xs text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/80 px-2.5 py-1 rounded-md transition-colors"
            >
              {tag}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
