import { useMemo } from "react";
import { usePostIndex } from "@/lib/post-cache";
import { categories } from "@/lib/categories";
import { formatDate } from "@/lib/blog-utils";
import { NewsletterForm } from "@/components/NewsletterForm";

export function Sidebar() {
  const allPosts = usePostIndex();
  const recentPosts = useMemo(
    () =>
      [...allPosts]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5),
    [allPosts]
  );

  return (
    <aside className="space-y-4 md:space-y-5">
      {/* Recent Posts */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
        <h3 className="font-oswald text-base font-bold uppercase mb-3 text-gray-900">
          Recent <span className="text-blue-600">Posts</span>
        </h3>
        <ul className="space-y-3">
          {recentPosts.map((post) => (
            <li key={post.id} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
              <a
                href={`/blog/${post.slug}`}
                className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors line-clamp-2 leading-snug"
              >
                {post.title}
              </a>
              <p className="text-xs text-gray-400 mt-1">{formatDate(post.date)}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5">
        <h3 className="font-oswald text-base font-bold uppercase mb-3 text-gray-900">
          <span className="text-blue-600">Categories</span>
        </h3>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.id}>
              <a
                href={`/category/${category.slug}`}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2.5 py-1.5 px-2 rounded-lg hover:bg-gray-50"
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter Signup */}
      <div className="rounded-2xl p-4 md:p-5 bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-sm">
        <h3 className="font-oswald text-base font-bold uppercase mb-1">
          Stay Updated
        </h3>
        <p className="text-sm mb-3 text-blue-100 leading-relaxed">
          Get the latest insights delivered to your inbox.
        </p>
        <NewsletterForm
          placeholder="Your email"
          buttonText="Subscribe"
          className="space-y-2.5"
          source="sidebar"
        />
      </div>
    </aside>
  );
}
