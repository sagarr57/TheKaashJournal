// Starts a new production deployment so prerendered pages, the sitemap and the RSS feed pick up
// content changes made in the database. Needs a Vercel deploy hook URL in VERCEL_DEPLOY_HOOK_URL.
export async function triggerRebuild(): Promise<{ configured: boolean; triggered: boolean }> {
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook) return { configured: false, triggered: false };
  try {
    const response = await fetch(hook, { method: 'POST' });
    return { configured: true, triggered: response.ok };
  } catch (err) {
    console.error('Deploy hook failed:', err);
    return { configured: true, triggered: false };
  }
}
