// Load environment variables from .env.local
const fs = require('fs');
const path = require('path');

// Read .env.local and set environment variables
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const { kv } = require("@vercel/kv");
const portfolioData = require("../data/portfolio.json");
const matter = require("gray-matter");

async function initializeDatabase() {
  try {
    console.log("Initializing database with default data...");

    // Set portfolio data (always update to latest)
    await kv.set("portfolio", portfolioData);
    console.log("✅ Portfolio data initialized successfully!");

    // Load blog posts from _posts directory
    const postsDirectory = path.join(__dirname, '../_posts');
    const blogPosts = [];

    if (fs.existsSync(postsDirectory)) {
      const filenames = fs.readdirSync(postsDirectory);

      for (const filename of filenames) {
        if (filename.endsWith('.md')) {
          const slug = filename.replace(/\.md$/, '');
          const fullPath = path.join(postsDirectory, filename);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data, content } = matter(fileContents);

          blogPosts.push({
            slug,
            content,
            date: data.date || new Date().toISOString(),
            title: data.title || 'Untitled',
            tagline: data.tagline || '',
            preview: data.preview || '',
            image: data.image || '/images/default.jpg',
          });
        }
      }

      await kv.set("blog_posts", blogPosts);
      console.log(`✅ ${blogPosts.length} blog posts initialized successfully!`);
    } else {
      // Initialize empty blog posts array if no _posts directory
      await kv.set("blog_posts", []);
      console.log("✅ Blog posts initialized (empty array)!");
    }

    console.log("\n🎉 Database initialization complete!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

initializeDatabase();
