import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === "POST") {
      await kv.set("portfolio", req.body);
      res.status(200).json({ message: "Portfolio data saved successfully" });
    } else if (req.method === "GET") {
      const data = await kv.get("portfolio");

      // If no data in database, return empty object (not null)
      if (!data) {
        return res.status(200).json({});
      }

      res.status(200).json(data);
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Database error:", error);

    // Return empty object on error instead of 500
    res.status(200).json({});
  }
}
