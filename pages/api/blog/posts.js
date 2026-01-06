import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const posts = (await kv.get("blog_posts")) || [];
      res.status(200).json({ posts });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Blog posts fetch error:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
}
