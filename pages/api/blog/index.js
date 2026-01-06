import { kv } from "@vercel/kv";
import { v4 as uuidv4 } from "uuid";
import { getRandomImage } from "../../../utils";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const slug = uuidv4();
      const newPost = {
        slug,
        content: "# New Blog",
        date: new Date().toISOString(),
        title: "New Blog",
        tagline: "Amazing New Blog",
        preview:
          "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        image: getRandomImage(),
      };

      // Get existing posts
      const posts = (await kv.get("blog_posts")) || [];
      posts.push(newPost);

      // Save to database
      await kv.set("blog_posts", posts);

      res.status(200).json({ status: "CREATED", slug });
    } else if (req.method === "DELETE") {
      const { slug } = req.body;

      // Get existing posts
      const posts = (await kv.get("blog_posts")) || [];

      // Filter out the deleted post
      const updatedPosts = posts.filter(post => post.slug !== slug);

      // Save to database
      await kv.set("blog_posts", updatedPosts);

      res.status(200).json({ status: "DONE" });
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Blog API error:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
}
