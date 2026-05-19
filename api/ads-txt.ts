import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
  res.status(200).send(
    "google.com, pub-5606354728180472, DIRECT, f08c47fec0942fa0\n"
  );
}
