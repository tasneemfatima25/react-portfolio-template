import clientPromise from "../../lib/mongodb";

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("portfolio");

    if (req.method === "POST") {
      const result = await db.collection("data").updateOne(
        { type: "portfolio" },
        { $set: { ...req.body, type: "portfolio", updatedAt: new Date() } },
        { upsert: true }
      );
      res.status(200).json({ message: "Portfolio data saved successfully", result });
    } else if (req.method === "GET") {
      const data = await db.collection("data").findOne({ type: "portfolio" });
      res.status(200).json(data || {});
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Database error", details: error.message });
  }
}
