import fs from "fs";
import { join } from "path";

export default function handler(req, res) {
  const portfolioData = join(process.cwd(), "/data/portfolio.json");

  if (req.method === "POST") {
    if (process.env.NODE_ENV === "development") {
      try {
        fs.writeFileSync(portfolioData, JSON.stringify(req.body, null, 2), "utf-8");
        res.status(200).json({ message: "Portfolio data saved successfully" });
      } catch (error) {
        res.status(500).json({ error: "Failed to save portfolio data" });
      }
    } else {
      // Production mein API call successful hogi but file write nahi hogi
      res.status(200).json({ message: "Changes saved (deploy to apply)" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
