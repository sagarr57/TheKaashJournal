import { usePostIndex } from "@/lib/post-cache";
import { getTopicHub } from "@/lib/topic-hubs";

/** Links an article to the main guide and sibling articles on its topic, and to official bodies. */
export function TopicHubBox({ slug }: { slug: string }) {
  const posts = usePostIndex();
  const topic = getTopicHub(slug);
  if (!topic) return null;

  const titleOf = (s: string) => posts.find((post) => post.slug === s)?.title;
  const hubTitle = topic.hub !== slug ? titleOf(topic.hub) : undefined;
  const others = topic.members.filter((s) => s !== slug && titleOf(s)).slice(0, 6);
  if (!hubTitle && others.length === 0 && topic.resources.length === 0) return null;

  return (
    <section aria-label={`More on ${topic.label}`} className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-4 md:p-5">
      <h2 className="font-oswald text-lg md:text-xl font-bold normal-case mb-3 text-gray-900">
        More on {topic.label}
      </h2>

      {hubTitle && (
        <p className="mb-3 text-sm md:text-base">
          <span className="font-semibold text-gray-900">Start with the main guide: </span>
          <a href={`/blog/${topic.hub}`} className="text-blue-700 font-medium hover:underline">
            {hubTitle}
          </a>
        </p>
      )}

      {others.length > 0 && (
        <ul className="space-y-1.5 text-sm md:text-base list-disc pl-5 marker:text-gray-400">
          {others.map((s) => (
            <li key={s}>
              <a href={`/blog/${s}`} className="text-blue-700 hover:underline">
                {titleOf(s)}
              </a>
            </li>
          ))}
        </ul>
      )}

      {topic.resources.length > 0 && (
        <p className="mt-4 pt-3 border-t border-gray-200 text-xs md:text-sm text-gray-600 leading-relaxed">
          <span className="font-semibold text-gray-800">Check the facts with official sources: </span>
          {topic.resources.map((resource, index) => (
            <span key={resource.url}>
              {index > 0 && " · "}
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">
                {resource.name}
              </a>
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
