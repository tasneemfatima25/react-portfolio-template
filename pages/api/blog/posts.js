import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === "GET") {
      const posts = (await kv.get("blog_posts")) || [];
      res.status(200).json({ posts });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Blog posts fetch error:", error);

    // Return empty array on error instead of 500
    res.status(200).json({ posts: [] });
  }
}
