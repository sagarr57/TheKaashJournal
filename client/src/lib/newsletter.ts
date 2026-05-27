interface NewsletterResponse {
  success: boolean;
  message: string;
}

export async function subscribeToNewsletter(
  email: string,
  source?: string
): Promise<NewsletterResponse> {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return { success: false, message: "Please enter a valid email address." };
  }

  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmedEmail, source: source || "unknown" }),
    });
    const data = await res.json().catch(() => ({}));
    return {
      success: data.success ?? res.ok,
      message: data.message ?? (res.ok ? "Successfully subscribed! Check your email for confirmation." : "Subscription failed. Please try again later."),
    };
  } catch {
    return { success: false, message: "Subscription failed. Please try again later." };
  }
}
