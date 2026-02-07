// Newsletter integration with Brevo (formerly Sendinblue)
// Free tier: 300 emails/day, unlimited contacts
// Sign up at: https://www.brevo.com

import { supabase } from './supabase';

const BREVO_API_KEY = import.meta.env.VITE_BREVO_API_KEY;
const BREVO_LIST_ID = import.meta.env.VITE_BREVO_LIST_ID;

interface NewsletterResponse {
  success: boolean;
  message: string;
}

/**
 * Subscribe to newsletter - saves to both Brevo and Supabase
 */
export async function subscribeToNewsletter(
  email: string,
  source?: string
): Promise<NewsletterResponse> {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  // Step 1: Subscribe to Brevo
  let brevoSuccess = false;
  let brevoMessage = "";

  if (BREVO_API_KEY && BREVO_LIST_ID) {
    try {
      const url = "https://api.brevo.com/v3/contacts";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
        body: JSON.stringify({
          email: trimmedEmail,
          listIds: [parseInt(BREVO_LIST_ID)],
          updateEnabled: true, // Update if contact already exists
        }),
      });

      // Handle empty responses
      let data: any = {};
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        try {
          const text = await response.text();
          if (text) {
            data = JSON.parse(text);
          }
        } catch (e) {
          // Response is not valid JSON, that's okay
        }
      }

      if (response.ok || response.status === 201) {
        brevoSuccess = true;
        brevoMessage = "Successfully subscribed to Brevo!";
      } else if (response.status === 400) {
        // Check if contact already exists
        if (data.message?.includes("already exists") || data.message?.includes("Contact already exist")) {
          brevoSuccess = true; // Treat as success
          brevoMessage = "Already subscribed in Brevo.";
        } else if (data.message?.includes("Invalid email")) {
          return {
            success: false,
            message: "Please enter a valid email address.",
          };
        } else {
          brevoMessage = data.message || "Brevo subscription failed.";
        }
      } else {
        brevoMessage = data.message || `Brevo error: ${response.status}`;
      }
    } catch (error: any) {
      const errorMsg = error?.message || "Network error";
      brevoMessage = `Brevo subscription failed: ${errorMsg}`;
    }
  } else {
    brevoMessage = "Brevo not configured.";
  }

  // Step 2: Save to Supabase directly (client-side, uses RLS)
  let supabaseSuccess = false;
  let supabaseMessage = "";

  try {
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: trimmedEmail,
        source: source || 'unknown',
        subscribed_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      // Check if it's a duplicate (already exists)
      if (error.code === '23505' || error.message?.includes('duplicate') || error.message?.includes('unique')) {
        supabaseSuccess = true;
        supabaseMessage = "Already in database.";
      } else if (error.code === 'PGRST116') {
        // RLS policy violation
        supabaseMessage = "Permission denied. Please check database policies.";
      } else if (error.code === '23514') {
        // Constraint violation
        supabaseMessage = "Invalid data. Please check your input.";
      } else {
        supabaseMessage = `Database error: ${error.message || 'Unknown error'}`;
      }
    } else {
      supabaseSuccess = true;
      supabaseMessage = "Saved to database.";
    }
  } catch (error: any) {
    const errorMsg = error?.message || error?.toString() || 'Unknown error';
    supabaseMessage = `Database error: ${errorMsg}`;
  }

  // Return success if at least one succeeded
  if (brevoSuccess || supabaseSuccess) {
    return {
      success: true,
      message: "Successfully subscribed! Check your email for confirmation.",
    };
  }

  // Both failed
  return {
    success: false,
    message: `Subscription failed. ${brevoMessage} ${supabaseMessage}`,
  };
}
