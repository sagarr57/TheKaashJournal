import { formatDate } from "@/lib/blog-utils";
import { getAuthorProfilePath } from "@/lib/authors";
import { BlogPost } from "@/lib/types";
import { FileCheck } from "lucide-react";

interface PostEditorialFooterProps {
  post: BlogPost;
}

export function PostEditorialFooter({ post }: PostEditorialFooterProps) {
  const authorPath = getAuthorProfilePath(post.author);
  const displayDate = post.updated || post.date;

  return (
    <div className="border border-gray-200 rounded-lg p-5 md:p-6 mb-8 bg-gray-50/80">
      <div className="flex gap-3">
        <FileCheck className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" aria-hidden />
        <div className="text-sm text-gray-700 space-y-2 leading-relaxed">
          <p className="font-semibold text-gray-900">Editorial note</p>
          <p>
            This article was researched and written by{" "}
            {authorPath ? (
              <a href={authorPath} className="text-blue-700 hover:underline font-medium">
                {post.author}
              </a>
            ) : (
              post.author
            )}
            . Claims are linked to primary sources where possible. Last reviewed{" "}
            <time dateTime={displayDate}>{formatDate(displayDate)}</time>.
          </p>
          <p>
            Spotted an error?{" "}
            <a href="/contact" className="text-blue-700 hover:underline font-medium">
              Contact us
            </a>{" "}
            with the article URL. Read our{" "}
            <a href="/editorial-policy" className="text-blue-700 hover:underline font-medium">
              editorial policy
            </a>{" "}
            and{" "}
            <a href="/disclaimer" className="text-blue-700 hover:underline font-medium">
              disclaimers
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
