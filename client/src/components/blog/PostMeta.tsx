import { Badge } from "@/components/ui/badge";
import { formatDate, getCategoryColor } from "@/lib/blog-utils";
import { BlogPost } from "@/lib/types";
import { Calendar, Clock, User } from "lucide-react";

interface PostMetaProps {
  post: BlogPost;
}

export function PostMeta({ post }: PostMetaProps) {
  const categoryColor = getCategoryColor(post.category);

  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <Badge
          variant="outline"
          className="border-2 rounded-full text-sm font-bold px-4 py-1"
          style={{ borderColor: categoryColor, color: categoryColor }}
        >
          {post.category}
        </Badge>
      </div>

      {/* Meta Information */}
      <div className="space-y-4 py-6 border-y border-gray-200">
        <div className="flex items-center gap-3 text-gray-600">
          <User className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">Author</p>
            <p className="font-semibold">{post.author}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <Calendar className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">Published</p>
            <p className="font-semibold">{formatDate(post.date)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-gray-600">
          <Clock className="w-5 h-5 flex-shrink-0" />
          <div>
            <p className="text-xs uppercase font-bold text-gray-500">Reading Time</p>
            <p className="font-semibold">{post.readingTime} minutes</p>
          </div>
        </div>

        {post.updated && (
          <div className="flex items-center gap-3 text-gray-600">
            <Calendar className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-xs uppercase font-bold text-gray-500">Last Updated</p>
              <p className="font-semibold">{formatDate(post.updated)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      <div>
        <p className="text-xs uppercase font-bold text-gray-500 mb-3">Tags</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <a
              key={tag}
              href={`/tag/${tag.toLowerCase()}`}
              className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
            >
              #{tag}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
