const fs = require("fs");
const path = require("path");
const https = require("https");

const BASE_URL = "https://dev-maharab.netlify.app";
const SITEMAP_PATH = path.join(__dirname, "..", "public", "sitemap.xml");
const BUILD_SITEMAP_PATH = path.join(__dirname, "..", "build", "sitemap.xml");
const PROJECTS_DATA_PATH = path.join(__dirname, "..", "src", "data", "projectsData.ts");

console.log("\n=======================================================");
console.log("🚀 [SEO Automation] Running Dynamic Sitemap Generator...");
console.log("=======================================================");

// 1. Read static projects from src/data/projectsData.ts
function extractProjectsFromSource() {
  const projects = [];
  try {
    const content = fs.readFileSync(PROJECTS_DATA_PATH, "utf8");
    // Match project blocks: id, title, featured
    const regex = /id:\s*["']([^"']+)["'][\s\S]*?title:\s*["']([^"']+)["']/g;
    let match;
    const seen = new Set();

    while ((match = regex.exec(content)) !== null) {
      const id = match[1].trim();
      const title = match[2].trim();
      if (!seen.has(id)) {
        seen.add(id);
        projects.push({
          id,
          title,
          featured: false,
        });
      }
    }
  } catch (err) {
    console.warn("⚠️ Warning reading projectsData.ts:", err.message);
  }
  return projects;
}

// 2. Read Supabase environment variables if available
function getSupabaseCredentials() {
  const envFiles = [".env.local", ".env", ".env.production"];
  let supabaseUrl = "";
  let supabaseKey = "";

  for (const file of envFiles) {
    const fullPath = path.join(__dirname, "..", file);
    if (fs.existsSync(fullPath)) {
      const envContent = fs.readFileSync(fullPath, "utf8");
      const urlMatch = envContent.match(/REACT_APP_SUPABASE_URL\s*=\s*(.*)/);
      const keyMatch = envContent.match(/REACT_APP_SUPABASE_ANON_KEY\s*=\s*(.*)/);
      if (urlMatch && urlMatch[1]) supabaseUrl = urlMatch[1].trim().replace(/['"]/g, "");
      if (keyMatch && keyMatch[1]) supabaseKey = keyMatch[1].trim().replace(/['"]/g, "");
      if (supabaseUrl && supabaseKey) break;
    }
  }

  return {
    url: process.env.REACT_APP_SUPABASE_URL || supabaseUrl,
    key: process.env.REACT_APP_SUPABASE_ANON_KEY || supabaseKey,
  };
}

// 3. Fetch remote projects from Supabase if configured
function fetchRemoteProjects(url, key) {
  return new Promise((resolve) => {
    if (!url || !key) {
      return resolve([]);
    }

    try {
      const endpoint = `${url.replace(/\/+$/, "")}/rest/v1/projects?select=id,title,featured`;
      const parsedUrl = new URL(endpoint);

      const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: "GET",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        timeout: 4000,
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = JSON.parse(data);
              if (Array.isArray(parsed)) {
                console.log(`🌐 Fetched ${parsed.length} projects from Supabase cloud database.`);
                return resolve(parsed);
              }
            } catch (e) {}
          }
          resolve([]);
        });
      });

      req.on("error", () => resolve([]));
      req.on("timeout", () => {
        req.destroy();
        resolve([]);
      });
      req.end();
    } catch (e) {
      resolve([]);
    }
  });
}

// 4. Generate XML string
function generateXml(projects) {
  const today = new Date().toISOString().split("T")[0];

  const staticRoutes = [
    { url: `${BASE_URL}/`, lastmod: today, changefreq: "weekly", priority: "1.0", name: "Homepage" },
    { url: `${BASE_URL}/hire`, lastmod: today, changefreq: "monthly", priority: "0.9", name: "Hire Page" },
    { url: `${BASE_URL}/journey`, lastmod: today, changefreq: "monthly", priority: "0.9", name: "Journey Page" },
    { url: `${BASE_URL}/#about`, lastmod: today, changefreq: "monthly", priority: "0.8", name: "About Section" },
    { url: `${BASE_URL}/#skills`, lastmod: today, changefreq: "monthly", priority: "0.8", name: "Skills Section" },
    { url: `${BASE_URL}/#projects`, lastmod: today, changefreq: "weekly", priority: "0.9", name: "Projects Section" },
    { url: `${BASE_URL}/#experience`, lastmod: today, changefreq: "monthly", priority: "0.8", name: "Experience Section" },
    { url: `${BASE_URL}/#education`, lastmod: today, changefreq: "monthly", priority: "0.7", name: "Education Section" },
    { url: `${BASE_URL}/#certificates`, lastmod: today, changefreq: "monthly", priority: "0.7", name: "Certificates Section" },
    { url: `${BASE_URL}/#contact`, lastmod: today, changefreq: "monthly", priority: "0.8", name: "Contact Section" },
  ];

  // Sort projects alphabetically from A to Z
  const sortedProjects = [...projects].sort((a, b) =>
    (a.title || a.id).localeCompare(b.title || b.id)
  );

  const projectRoutes = sortedProjects.map((p) => ({
    url: `${BASE_URL}/?project=${encodeURIComponent(p.id)}`,
    lastmod: today,
    changefreq: "weekly",
    priority: p.featured ? "0.9" : "0.8",
    name: `Project: ${p.title || p.id}`,
  }));

  const allRoutes = [...staticRoutes, ...projectRoutes];

  const xmlEntries = allRoutes
    .map(
      (r) => `  <!-- ${r.name.replace(/<!--|-->/g, "")} -->
  <url>
    <loc>${r.url}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join("\n\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${xmlEntries}

</urlset>
`;
}

// Main execution
async function main() {
  const localProjects = extractProjectsFromSource();
  console.log(`📁 Found ${localProjects.length} projects in local codebase.`);

  const { url, key } = getSupabaseCredentials();
  const remoteProjects = await fetchRemoteProjects(url, key);

  // Merge projects without duplicates (prefer remote metadata if exists)
  const projectMap = new Map();
  localProjects.forEach((p) => projectMap.set(p.id, p));
  remoteProjects.forEach((p) => {
    if (p && p.id) {
      projectMap.set(p.id, {
        id: p.id,
        title: p.title || projectMap.get(p.id)?.title || p.id,
        featured: Boolean(p.featured),
      });
    }
  });

  const mergedProjects = Array.from(projectMap.values());
  console.log(`✨ Total unified projects to index (A to Z): ${mergedProjects.length}`);

  const xml = generateXml(mergedProjects);

  // Write to public/sitemap.xml
  fs.writeFileSync(SITEMAP_PATH, xml, "utf8");
  console.log(`✅ Successfully updated: ${SITEMAP_PATH}`);

  // Write to build/sitemap.xml if build directory exists
  const buildDir = path.join(__dirname, "..", "build");
  if (fs.existsSync(buildDir)) {
    fs.writeFileSync(BUILD_SITEMAP_PATH, xml, "utf8");
    console.log(`✅ Successfully updated build output: ${BUILD_SITEMAP_PATH}`);
  }

  console.log(`🎉 Automation complete: ${mergedProjects.length + 10} URLs generated in sitemap.xml!\n`);
}

main().catch((err) => {
  console.error("❌ Error generating sitemap:", err);
});
