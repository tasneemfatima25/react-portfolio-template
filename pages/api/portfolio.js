import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      await kv.set("portfolio", req.body);
      res.status(200).json({ message: "Portfolio data saved successfully" });
    } else if (req.method === "GET") {
      const data = await kv.get("portfolio");
      res.status(200).json(data || {});
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
}
