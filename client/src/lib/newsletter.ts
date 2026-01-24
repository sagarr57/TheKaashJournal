// Newsletter integration with Mailchimp
// You'll need to set up a Mailchimp account and get your API key and list ID

const MAILCHIMP_API_KEY = import.meta.env.VITE_MAILCHIMP_API_KEY;
const MAILCHIMP_LIST_ID = import.meta.env.VITE_MAILCHIMP_LIST_ID;
const MAILCHIMP_SERVER_PREFIX = import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX; // e.g., "us1", "us2", etc.

interface NewsletterResponse {
  success: boolean;
  message: string;
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterResponse> {
  if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER_PREFIX) {
    console.error("Mailchimp configuration is missing");
    return {
      success: false,
      message: "Newsletter service is not configured. Please contact support.",
    };
  }

  try {
    // Mailchimp API endpoint
    const url = `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed", // or "pending" for double opt-in
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle Mailchimp errors
      if (data.title === "Member Exists") {
        return {
          success: false,
          message: "This email is already subscribed to our newsletter.",
        };
      }
      return {
        success: false,
        message: data.detail || "Failed to subscribe. Please try again later.",
      };
    }

    return {
      success: true,
      message: "Successfully subscribed! Check your email for confirmation.",
    };
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return {
      success: false,
      message: "An error occurred. Please try again later.",
    };
  }
}

// Alternative: Use Mailchimp's embedded form (simpler, no API needed)
// You can also use their hosted form URL directly
