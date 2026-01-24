// Newsletter integration with Brevo (formerly Sendinblue)
// Free tier: 300 emails/day, unlimited contacts
// Sign up at: https://www.brevo.com

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_LIST_ID = import.meta.env.VITE_BREVO_LIST_ID;

interface NewsletterResponse {
  success: boolean;
  message: string;
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterResponse> {
  if (!BREVO_API_KEY || !BREVO_LIST_ID) {
    console.error("Brevo configuration is missing");
    return {
      success: false,
      message: "Newsletter service is not configured. Please contact support.",
    };
  }

  try {
    // Brevo API endpoint for adding contacts
    const url = "https://api.brevo.com/v3/contacts";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email.trim(),
        listIds: [parseInt(BREVO_LIST_ID)],
        updateEnabled: true, // Update if contact already exists
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle Brevo errors
      if (response.status === 400 && data.message?.includes("already exists")) {
        return {
          success: true, // Treat as success since they're already subscribed
          message: "You're already subscribed to our newsletter!",
        };
      }
      
      if (response.status === 400 && data.message?.includes("Invalid email")) {
        return {
          success: false,
          message: "Please enter a valid email address.",
        };
      }

      return {
        success: false,
        message: data.message || "Failed to subscribe. Please try again later.",
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
