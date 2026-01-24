import { getRecentPosts } from "@/lib/blog-utils";
import { categories } from "@/lib/posts";
import { formatDate } from "@/lib/blog-utils";
import { NewsletterForm } from "@/components/NewsletterForm";

export function Sidebar() {
  const recentPosts = getRecentPosts(5);

  return (
    <aside className="space-y-8">
      {/* Recent Posts */}
      <div className="border border-gray-200 p-6">
        <h3 className="font-oswald text-xl font-bold uppercase mb-4">
          Recent <span className="text-blue-600">Posts</span>
        </h3>
        <ul className="space-y-4">
          {recentPosts.map((post) => (
            <li key={post.id} className="pb-4 border-b border-gray-200 last:border-0">
              <a
                href={`/blog/${post.slug}`}
                className="text-sm font-semibold hover:text-blue-600 transition-colors line-clamp-2"
              >
                {post.title}
              </a>
              <p className="text-xs text-gray-500 mt-1">{formatDate(post.date)}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Categories */}
      <div className="border border-gray-200 p-6">
        <h3 className="font-oswald text-xl font-bold uppercase mb-4">
          <span className="text-blue-600">Categories</span>
        </h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <a
                href={`/category/${category.slug}`}
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-blue-700 text-white p-6 border-2 border-blue-800">
        <h3 className="font-oswald text-lg font-bold uppercase mb-2">
          Stay Updated
        </h3>
        <p className="text-sm mb-4 text-blue-50">
          Get the latest insights delivered to your inbox.
        </p>
        <NewsletterForm
          placeholder="Your email"
          buttonText="Subscribe"
          className="space-y-3"
        />
      </div>
    </aside>
  );
}
