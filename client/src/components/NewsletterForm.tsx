import { useState, FormEvent } from "react";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { toast } from "sonner";
import { pushToDataLayer } from "./GTM";
import { trackConversion } from "@/lib/google-ads";

interface NewsletterFormProps {
  placeholder?: string;
  buttonText?: string;
  className?: string;
}

export function NewsletterForm({
  placeholder = "Enter your email",
  buttonText = "Subscribe",
  className = "",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const result = await subscribeToNewsletter(email.trim());

      if (result.success) {
        toast.success(result.message);
        setEmail("");
        
        // Track newsletter subscription in GTM
        pushToDataLayer("newsletter_subscribe", {
          email: email.trim(),
        });
        
        // Track conversion with GCLID for Google Ads
        trackConversion("newsletter_signup");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 h-10 text-gray-900 placeholder:text-gray-500 bg-white rounded text-sm focus:outline-none focus:ring-2 focus:ring-white"
          required
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-white text-blue-700 font-semibold py-2 h-10 rounded hover:bg-gray-100 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Subscribing..." : buttonText}
        </button>
      </div>
    </form>
  );
}
