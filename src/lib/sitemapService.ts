import { Project } from "../data/projectsData";
import { getLiveProjects } from "./portfolioService";

export const DEFAULT_BASE_URL = "https://dev-maharab.netlify.app";

export interface SitemapEntry {
  url: string;
  lastmod: string;
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: string;
  title?: string;
}

/**
 * Generate full sitemap XML string from project list
 */
export const buildSitemapXml = (
  projects: Project[],
  baseUrl: string = DEFAULT_BASE_URL
): { xml: string; entries: SitemapEntry[] } => {
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "");
  const today = new Date().toISOString().split("T")[0];

  const entries: SitemapEntry[] = [
    // 1. Homepage / Main View
    {
      url: `${cleanBaseUrl}/`,
      lastmod: today,
      changefreq: "weekly",
      priority: "1.0",
      title: "Home / Full Portfolio",
    },
    // 2. Hire Me Page
    {
      url: `${cleanBaseUrl}/hire`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.9",
      title: "Hire Inquiry & Direct Booking",
    },
    // 3. Journey & Timeline
    {
      url: `${cleanBaseUrl}/journey`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.9",
      title: "Career Journey & Milestones",
    },
    // 4. Section Deep Links for Google site-links
    {
      url: `${cleanBaseUrl}/#about`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
      title: "About Md. Maharab Hosen",
    },
    {
      url: `${cleanBaseUrl}/#skills`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
      title: "Technical Skills & Arsenal",
    },
    {
      url: `${cleanBaseUrl}/#projects`,
      lastmod: today,
      changefreq: "weekly",
      priority: "0.9",
      title: "Projects Showcase",
    },
    {
      url: `${cleanBaseUrl}/#experience`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
      title: "Professional Experience",
    },
    {
      url: `${cleanBaseUrl}/#education`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
      title: "Education & Academics",
    },
    {
      url: `${cleanBaseUrl}/#certificates`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.7",
      title: "Certifications & Credentials",
    },
    {
      url: `${cleanBaseUrl}/#contact`,
      lastmod: today,
      changefreq: "monthly",
      priority: "0.8",
      title: "Contact & Collaboration",
    },
  ];

  // Add all projects A to Z
  const sortedProjects = [...projects].sort((a, b) => a.title.localeCompare(b.title));

  sortedProjects.forEach((proj) => {
    // Standard web URL query
    entries.push({
      url: `${cleanBaseUrl}/?project=${encodeURIComponent(proj.id)}`,
      lastmod: today,
      changefreq: "weekly",
      priority: proj.featured ? "0.9" : "0.8",
      title: proj.title,
    });
  });

  const xmlEntries = entries
    .map(
      (e) => `  <!-- ${e.title ? e.title.replace(/<!--|-->/g, "") : "Page"} -->
  <url>
    <loc>${e.url}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`
    )
    .join("\n\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${xmlEntries}

</urlset>
`;

  return { xml, entries };
};

/**
 * Fetch all live projects (including Supabase cloud additions) and generate dynamic sitemap
 */
export const getLiveDynamicSitemap = async (
  baseUrl: string = DEFAULT_BASE_URL
): Promise<{ xml: string; entries: SitemapEntry[]; totalProjects: number }> => {
  const liveProjects = await getLiveProjects();
  const { xml, entries } = buildSitemapXml(liveProjects, baseUrl);
  return { xml, entries, totalProjects: liveProjects.length };
};

/**
 * Trigger client-side download of the sitemap.xml file
 */
export const triggerSitemapDownload = (xmlContent: string, filename: string = "sitemap.xml"): void => {
  if (typeof document === "undefined") return;

  const blob = new Blob([xmlContent], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
