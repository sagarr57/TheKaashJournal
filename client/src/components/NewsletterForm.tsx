import { useState, FormEvent } from "react";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { toast } from "sonner";
import { pushToDataLayer } from "./GTM";
import { trackConversion } from "@/lib/tracking";

interface NewsletterFormProps {
  placeholder?: string;
  buttonText?: string;
  className?: string;
  source?: string;
}

export function NewsletterForm({
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  className = "",
  source = "unknown",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!consent) {
      toast.error("Please agree to receive email updates to subscribe");
      return;
    }

    setIsLoading(true);

    try {
      const result = await subscribeToNewsletter(email.trim(), source);

      if (result.success) {
        toast.success(result.message);
        setEmail("");
        setConsent(false);

        pushToDataLayer("newsletter_subscribe", { email: email.trim() });
        trackConversion("newsletter", "newsletter_signup", {
          metadata: { email: email.trim(), source: "newsletter_form" },
        });
      } else {
        toast.error(result.message);
      }
    } catch {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-3">
        <label htmlFor={`newsletter-email-${source}`} className="sr-only">
          Email address
        </label>
        <input
          id={`newsletter-email-${source}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 h-10 text-gray-900 placeholder:text-gray-500 bg-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-white"
          required
          disabled={isLoading}
          autoComplete="email"
        />
        <label className="flex items-start gap-2 text-xs text-blue-100 cursor-pointer">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-0.5 shrink-0 accent-white"
            required
          />
          <span>
            I agree to receive email updates from The Kaash Journal. You can unsubscribe at any time.
          </span>
        </label>
        <button
          type="submit"
          disabled={isLoading || !consent}
          className="w-full bg-white text-blue-700 font-semibold py-2 h-10 rounded hover:bg-gray-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Subscribing..." : buttonText}
        </button>
      </div>
    </form>
  );
}
