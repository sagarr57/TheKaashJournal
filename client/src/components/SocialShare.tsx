import { Twitter, Linkedin, Facebook, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
}

export function SocialShare({ title, url, description }: SocialShareProps) {
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedDescription = encodeURIComponent(description || "");

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="border-t border-gray-200 pt-8 mt-8">
      <h3 className="font-oswald text-xl font-bold uppercase mb-4 text-black">
        Share This Article
      </h3>
      <div className="flex flex-wrap gap-3">
        <Button
          asChild
          variant="outline"
          className="border-2 border-gray-300 hover:bg-gray-50 rounded-none"
          aria-label="Share on Twitter"
        >
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Twitter className="w-4 h-4" />
            Twitter
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-2 border-gray-300 hover:bg-gray-50 rounded-none"
          aria-label="Share on LinkedIn"
        >
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Linkedin className="w-4 h-4" />
            LinkedIn
          </a>
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-2 border-gray-300 hover:bg-gray-50 rounded-none"
          aria-label="Share on Facebook"
        >
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </a>
        </Button>
        <Button
          variant="outline"
          className="border-2 border-gray-300 hover:bg-gray-50 rounded-none"
          onClick={copyToClipboard}
          aria-label="Copy link to clipboard"
        >
          <Link2 className="w-4 h-4 mr-2" />
          Copy Link
        </Button>
      </div>
    </div>
  );
}
