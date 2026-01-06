import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { slug, content, variables } = req.body;
      const { date, title, tagline, preview, image } = variables;

      // Get existing posts
      const posts = (await kv.get("blog_posts")) || [];

      // Find and update the post
      const postIndex = posts.findIndex(post => post.slug === slug);

      if (postIndex !== -1) {
        posts[postIndex] = {
          slug,
          content,
          date,
          title,
          tagline,
          preview,
          image,
        };
      } else {
        // If post doesn't exist, create it
        posts.push({
          slug,
          content,
          date,
          title,
          tagline,
          preview,
          image,
        });
      }

      // Save to database
      await kv.set("blog_posts", posts);

      res.status(200).json({ status: "DONE" });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Blog edit error:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
}
