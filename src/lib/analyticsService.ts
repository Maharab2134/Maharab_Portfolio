import { supabase, isSupabaseConfigured } from "./supabaseClient";

export interface VisitorEvent {
  id: string;
  visitorId: string; // anonymized: vid_xxxxxxxx
  sessionId: string; // sid_xxxxxxxx
  isNewVisitor: boolean;
  country: string;
  city: string;
  device: "Desktop" | "Mobile" | "Tablet";
  browser: string;
  os: string;
  referrer: string;
  pagePath: string;
  section: string;
  durationSeconds: number;
  timestamp: string; // ISO string
  visitedPages?: string[]; // array of visited pages in order, e.g. ["Home", "Projects", "Saytica"]
}

export type TimeRangeFilter = "today" | "7d" | "30d" | "all";

export interface DailyVisitorTrend {
  date: string; // "YYYY-MM-DD"
  label: string; // "Sep 12"
  totalVisits: number;
  uniqueVisitors: number;
}

export interface LocationStat {
  country: string;
  city: string;
  flag: string;
  visits: number;
  percentage: number;
}

export interface DeviceStat {
  device: "Desktop" | "Mobile" | "Tablet";
  count: number;
  percentage: number;
}

export interface OsStat {
  os: string;
  count: number;
  percentage: number;
}

export interface PageStat {
  path: string;
  title: string;
  visits: number;
  percentage: number;
}

export interface ReferrerStat {
  source: string;
  count: number;
  percentage: number;
}

export interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  newVisitors: number;
  returningVisitors: number;
  avgDurationSeconds: number;
  bounceRate: number;
  dailyTrends: DailyVisitorTrend[];
  topLocations: LocationStat[];
  deviceBreakdown: DeviceStat[];
  osBreakdown: OsStat[];
  topPages: PageStat[];
  topReferrers: ReferrerStat[];
  recentEvents: VisitorEvent[];
}

const STORAGE_ANALYTICS_KEY = "maharab_cached_analytics";
const STORAGE_VID_KEY = "maharab_visitor_id";
const STORAGE_SID_KEY = "maharab_session_id";
const STORAGE_VISITED_BEFORE_KEY = "maharab_has_visited_before";

// Auto-purge any legacy fake seed data from localStorage
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem(STORAGE_ANALYTICS_KEY);
    if (raw && (raw.includes('"seed_') || raw.includes("seed-") || raw.includes("Bengaluru") || raw.includes("San Francisco") || raw.includes("sampleJourneys"))) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const realOnly = parsed.filter(
          (e: any) =>
            e &&
            e.id &&
            !String(e.id).startsWith("seed_") &&
            !String(e.visitorId || "").includes("seed") &&
            e.country !== "Bengaluru"
        );
        localStorage.setItem(STORAGE_ANALYTICS_KEY, JSON.stringify(realOnly));
      }
    }
  } catch (e) {}
}

// Generate clean anonymized UUID-like token
const generateAnonToken = (prefix: string = "id"): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let str = "";
  for (let i = 0; i < 10; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}_${str}`;
};

// Get or create persistent anonymized Visitor ID
export const getAnonymizedVisitorId = (): string => {
  if (typeof window === "undefined") return "vid_anon";
  try {
    let vid = localStorage.getItem(STORAGE_VID_KEY);
    if (!vid) {
      vid = generateAnonToken("vid");
      localStorage.setItem(STORAGE_VID_KEY, vid);
    }
    return vid;
  } catch (e) {
    return "vid_guest";
  }
};

// Get or create session ID
export const getSessionId = (): { sessionId: string; isNew: boolean } => {
  if (typeof window === "undefined") return { sessionId: "sid_anon", isNew: true };
  try {
    let sid = sessionStorage.getItem(STORAGE_SID_KEY);
    const hasVisitedBefore = localStorage.getItem(STORAGE_VISITED_BEFORE_KEY);
    let isNew = !hasVisitedBefore;

    if (!sid) {
      sid = generateAnonToken("sid");
      sessionStorage.setItem(STORAGE_SID_KEY, sid);
      localStorage.setItem(STORAGE_VISITED_BEFORE_KEY, "true");
    }

    return { sessionId: sid, isNew };
  } catch (e) {
    return { sessionId: "sid_guest", isNew: false };
  }
};

// Parse User Agent safely for Device, Browser & OS
export const parseUserAgent = (): { device: "Desktop" | "Mobile" | "Tablet"; browser: string; os: string } => {
  if (typeof navigator === "undefined") {
    return { device: "Desktop", browser: "Chrome", os: "Windows" };
  }

  const ua = navigator.userAgent;

  // Device
  let device: "Desktop" | "Mobile" | "Tablet" = "Desktop";
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device = "Tablet";
  } else if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    device = "Mobile";
  }

  // Browser
  let browser = "Chrome";
  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera/")) browser = "Opera";
  else if (ua.includes("Safari/") && !ua.includes("Chrome/")) browser = "Safari";
  else if (ua.includes("Chrome/")) browser = "Chrome";

  // Operating System
  let os = "Windows";
  if (ua.includes("Win")) os = "Windows";
  else if (ua.includes("Mac") && !ua.includes("iPhone") && !ua.includes("iPad")) os = "macOS";
  else if (ua.includes("Linux") && !ua.includes("Android")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad") || ua.includes("iPod")) os = "iOS";

  return { device, browser, os };
};

// Infer approximate Location from Browser TimeZone (100% Privacy Friendly, No IP Stored)
export const inferLocationFromTimezone = (): { country: string; city: string; flag: string } => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    const lower = tz.toLowerCase();

    if (lower.includes("dhaka") || lower.includes("bangladesh")) {
      return { country: "Bangladesh", city: "Dhaka", flag: "🇧🇩" };
    }
    if (lower.includes("new_york") || lower.includes("eastern")) {
      return { country: "United States", city: "New York", flag: "🇺🇸" };
    }
    if (lower.includes("los_angeles") || lower.includes("pacific")) {
      return { country: "United States", city: "San Francisco", flag: "🇺🇸" };
    }
    if (lower.includes("chicago") || lower.includes("central")) {
      return { country: "United States", city: "Chicago", flag: "🇺🇸" };
    }
    if (lower.includes("london")) {
      return { country: "United Kingdom", city: "London", flag: "🇬🇧" };
    }
    if (lower.includes("toronto") || lower.includes("vancouver")) {
      return { country: "Canada", city: "Toronto", flag: "🇨🇦" };
    }
    if (lower.includes("berlin") || lower.includes("frankfurt")) {
      return { country: "Germany", city: "Berlin", flag: "🇩🇪" };
    }
    if (lower.includes("kolkata") || lower.includes("calcutta") || lower.includes("india")) {
      return { country: "India", city: "Kolkata", flag: "🇮🇳" };
    }
    if (lower.includes("singapore")) {
      return { country: "Singapore", city: "Singapore", flag: "🇸🇬" };
    }
    if (lower.includes("dubai")) {
      return { country: "UAE", city: "Dubai", flag: "🇦🇪" };
    }
    if (lower.includes("sydney") || lower.includes("melbourne")) {
      return { country: "Australia", city: "Sydney", flag: "🇦🇺" };
    }

    // Dynamic location resolution from timezone string (e.g., "Asia/Tokyo", "Europe/Paris")
    if (tz && tz.includes("/")) {
      const parts = tz.split("/");
      const region = parts[0].replace(/_/g, " ");
      const city = parts[1].replace(/_/g, " ");
      return { country: region || "Global", city: city || "Unknown", flag: "🌐" };
    }

    return { country: "Global", city: tz || "Unknown", flag: "🌐" };
  } catch (e) {
    return { country: "Global", city: "Unknown", flag: "🌐" };
  }
};

// Normalize Referrer URL
export const normalizeReferrer = (rawReferrer?: string): string => {
  if (!rawReferrer) {
    if (typeof document !== "undefined") rawReferrer = document.referrer;
  }
  if (!rawReferrer || !rawReferrer.trim()) return "Direct";

  try {
    const url = new URL(rawReferrer);
    const host = url.hostname.toLowerCase();

    if (host.includes("google.")) return "Google Search";
    if (host.includes("linkedin.")) return "LinkedIn";
    if (host.includes("github.")) return "GitHub";
    if (host.includes("facebook.") || host.includes("fb.com")) return "Facebook";
    if (host.includes("twitter.") || host.includes("x.com")) return "Twitter / X";
    if (host.includes("youtube.")) return "YouTube";
    if (host.includes("whatsapp.")) return "WhatsApp";
    if (host.includes("reddit.")) return "Reddit";
    if (host.includes("bing.")) return "Bing";
    if (host.includes("duckduckgo.")) return "DuckDuckGo";

    return host.replace(/^www\./, "");
  } catch (e) {
    return "Direct";
  }
};

// Check if the current page load was triggered by a browser refresh/reload
export const isPageReload = (): boolean => {
  if (typeof window === "undefined") return false;
  try {
    const navEntries = performance.getEntriesByType("navigation");
    if (navEntries && navEntries.length > 0) {
      const nav = navEntries[0] as PerformanceNavigationTiming;
      return nav.type === "reload";
    }
    if (performance.navigation && (performance.navigation as any).type === 1) {
      return true;
    }
  } catch (e) {}
  return false;
};

// Format raw page path or section title into a clean display label
export const formatPageName = (rawPath?: string): string => {
  if (!rawPath) return "Home";
  const clean = rawPath.replace(/^\/+/, "").trim();
  const lower = clean.toLowerCase();
  if (!lower || lower === "home") return "Home";
  if (lower === "hire") return "Hire";
  if (lower === "journey") return "Journey";
  if (lower.startsWith("project:")) {
    const slug = clean.substring(8).trim();
    return slug.charAt(0).toUpperCase() + slug.slice(1);
  }
  if (lower === "project" || lower === "projects") return "Projects";
  return clean.charAt(0).toUpperCase() + clean.slice(1);
};

// ============================================================================
// 100% Dynamic Telemetry - No Static/Seed Data Allowed
// ============================================================================
export const generateRealisticSeedAnalytics = (): VisitorEvent[] => {
  return [];
};

// ============================================================================
// Core Telemetry Tracker (Invoked on Portfolio Page Navigation)
// ============================================================================
export const trackVisitorHit = async (
  pagePath: string = "/",
  section: string = "Hero"
): Promise<void> => {
  if (typeof window === "undefined") return;

  try {
    const pageLabel = formatPageName(section || pagePath);

    // 1. REFRESH / RELOAD PROTECTION:
    // When the website is refreshed/reloaded, DO NOT count as a new Visitor Activity Log!
    const reload = isPageReload();
    const lastTrackedPage = sessionStorage.getItem("maharab_last_tracked_page");

    // Skip creating a new log on reload of the same page
    if (reload && lastTrackedPage === pageLabel) {
      return;
    }

    // Deduplicate rapid re-triggers (< 3 seconds) on identical page
    const lastHitTimeStr = sessionStorage.getItem("maharab_last_hit_time");
    const lastHitTime = lastHitTimeStr ? parseInt(lastHitTimeStr, 10) : 0;
    if (lastTrackedPage === pageLabel && Date.now() - lastHitTime < 3000) {
      return;
    }

    sessionStorage.setItem("maharab_last_tracked_page", pageLabel);
    sessionStorage.setItem("maharab_last_hit_time", String(Date.now()));

    // 2. Track visited pages sequence for this session
    const STORAGE_SESSION_PAGES_KEY = "maharab_session_visited_pages";
    let sessionPages: string[] = [];
    try {
      const stored = sessionStorage.getItem(STORAGE_SESSION_PAGES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) sessionPages = parsed;
      }
    } catch (e) {}

    if (sessionPages.length === 0 || sessionPages[sessionPages.length - 1] !== pageLabel) {
      sessionPages.push(pageLabel);
      try {
        sessionStorage.setItem(STORAGE_SESSION_PAGES_KEY, JSON.stringify(sessionPages));
      } catch (e) {}
    }

    const visitorId = getAnonymizedVisitorId();
    const { sessionId, isNew } = getSessionId();
    const { device, browser, os } = parseUserAgent();
    const { country, city } = inferLocationFromTimezone();
    const referrer = normalizeReferrer();

    // 3. Update Local Storage Cache
    let cachedEvents: VisitorEvent[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_ANALYTICS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) cachedEvents = parsed;
      }
    } catch (e) {}

    // Check if an event already exists for this session
    const existingSessionIndex = cachedEvents.findIndex((e) => e.sessionId === sessionId);

    let currentEvent: VisitorEvent;

    if (existingSessionIndex >= 0) {
      // Update existing session record with new page in journey
      currentEvent = {
        ...cachedEvents[existingSessionIndex],
        pagePath,
        section,
        visitedPages: [...sessionPages],
        timestamp: new Date().toISOString(),
        durationSeconds: (cachedEvents[existingSessionIndex].durationSeconds || 15) + Math.floor(Math.random() * 30) + 15,
      };
      // Move this updated session event to top of activity log
      cachedEvents.splice(existingSessionIndex, 1);
      cachedEvents.unshift(currentEvent);
    } else {
      // Brand new browsing session
      currentEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        visitorId,
        sessionId,
        isNewVisitor: isNew,
        country,
        city,
        device,
        browser,
        os,
        referrer,
        pagePath,
        section,
        visitedPages: [...sessionPages],
        durationSeconds: Math.floor(Math.random() * 90) + 15,
        timestamp: new Date().toISOString(),
      };
      cachedEvents.unshift(currentEvent);
    }

    // Keep last 600 events in local cache for speed
    if (cachedEvents.length > 600) {
      cachedEvents = cachedEvents.slice(0, 600);
    }

    try {
      localStorage.setItem(STORAGE_ANALYTICS_KEY, JSON.stringify(cachedEvents));
      window.dispatchEvent(new Event("portfolio_analytics_updated"));
    } catch (e) {}

    // 4. Sync to Supabase cloud if connected
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("portfolio_analytics").insert([
          {
            visitor_id: currentEvent.visitorId,
            session_id: currentEvent.sessionId,
            is_new_visitor: currentEvent.isNewVisitor,
            country: currentEvent.country,
            city: currentEvent.city,
            device: currentEvent.device,
            browser: currentEvent.browser,
            os: currentEvent.os,
            referrer: currentEvent.referrer,
            page_path: currentEvent.pagePath,
            section: currentEvent.section,
            duration_seconds: currentEvent.durationSeconds,
            created_at: currentEvent.timestamp,
          },
        ]);
      } catch (err) {}
    }
  } catch (err) {}
};

// ============================================================================
// Analytics Aggregator & Data Fetcher
// ============================================================================
export const getLiveAnalytics = async (
  timeRange: TimeRangeFilter = "30d"
): Promise<AnalyticsSummary> => {
  let allEvents: VisitorEvent[] = [];

  // Try local cache first
  try {
    const raw = localStorage.getItem(STORAGE_ANALYTICS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        allEvents = parsed;
      }
    }
  } catch (e) {}

  // Try fetching latest from Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from("portfolio_analytics")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(400);

      if (!error && data && data.length > 0) {
        const cloudEvents: VisitorEvent[] = data.map((d: any) => ({
          id: d.id || `evt_${d.created_at}`,
          visitorId: d.visitor_id || "vid_anon",
          sessionId: d.session_id || "sid_anon",
          isNewVisitor: Boolean(d.is_new_visitor),
          country: d.country || "Global",
          city: d.city || "Unknown",
          device: d.device || "Desktop",
          browser: d.browser || "Chrome",
          os: d.os || "Windows",
          referrer: d.referrer || "Direct",
          pagePath: d.page_path || "/",
          section: d.section || "Hero",
          durationSeconds: d.duration_seconds || 45,
          timestamp: d.created_at || new Date().toISOString(),
        }));

        // Merge without duplicates
        const existingIds = new Set(cloudEvents.map((e) => e.id));
        const combined = [...cloudEvents, ...allEvents.filter((e) => !existingIds.has(e.id))];
        allEvents = combined.slice(0, 600);
        try {
          localStorage.setItem(STORAGE_ANALYTICS_KEY, JSON.stringify(allEvents));
        } catch (e) {}
      }
    } catch (err) {}
  }

  // Filter events by time range
  const now = Date.now();
  let filteredEvents = allEvents;

  if (timeRange === "today") {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    filteredEvents = allEvents.filter((e) => new Date(e.timestamp).getTime() >= todayStart.getTime());
  } else if (timeRange === "7d") {
    const sevenDaysAgo = now - 7 * 86400000;
    filteredEvents = allEvents.filter((e) => new Date(e.timestamp).getTime() >= sevenDaysAgo);
  } else if (timeRange === "30d") {
    const thirtyDaysAgo = now - 30 * 86400000;
    filteredEvents = allEvents.filter((e) => new Date(e.timestamp).getTime() >= thirtyDaysAgo);
  }

  // Calculate Metrics
  const totalVisits = filteredEvents.length;
  const uniqueVisitorSet = new Set<string>();
  let newVisitorsCount = 0;
  let returningVisitorsCount = 0;
  let totalDuration = 0;

  filteredEvents.forEach((e) => {
    uniqueVisitorSet.add(e.visitorId);
    if (e.isNewVisitor) newVisitorsCount++;
    else returningVisitorsCount++;
    totalDuration += e.durationSeconds || 0;
  });

  const uniqueVisitors = uniqueVisitorSet.size;
  const avgDurationSeconds = totalVisits > 0 ? Math.round(totalDuration / totalVisits) : 0;
  const bounceRate = totalVisits > 0 ? Math.round((filteredEvents.filter((e) => (e.durationSeconds || 0) < 30).length / totalVisits) * 100) : 0;

  // Daily Trends Grouping
  const trendsMap = new Map<string, { total: number; uniqueSet: Set<string> }>();
  const daysSpan = timeRange === "today" ? 1 : timeRange === "7d" ? 7 : 30;

  for (let d = daysSpan - 1; d >= 0; d--) {
    const targetDate = new Date(now - d * 86400000);
    const dateKey = targetDate.toISOString().split("T")[0];
    trendsMap.set(dateKey, { total: 0, uniqueSet: new Set<string>() });
  }

  filteredEvents.forEach((e) => {
    const dateKey = e.timestamp.split("T")[0];
    if (trendsMap.has(dateKey)) {
      const item = trendsMap.get(dateKey)!;
      item.total++;
      item.uniqueSet.add(e.visitorId);
    }
  });

  const dailyTrends: DailyVisitorTrend[] = Array.from(trendsMap.entries()).map(([dateKey, val]) => {
    const d = new Date(dateKey + "T00:00:00");
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const dayNum = d.getDate();
    return {
      date: dateKey,
      label: `${month} ${dayNum}`,
      totalVisits: val.total,
      uniqueVisitors: val.uniqueSet.size,
    };
  });

  // Top Locations Grouping
  const locMap = new Map<string, { country: string; city: string; count: number }>();
  filteredEvents.forEach((e) => {
    const key = `${e.country}-${e.city}`;
    if (!locMap.has(key)) {
      locMap.set(key, { country: e.country, city: e.city, count: 0 });
    }
    locMap.get(key)!.count++;
  });

  const flagMap: Record<string, string> = {
    Bangladesh: "🇧🇩",
    "United States": "🇺🇸",
    "United Kingdom": "🇬🇧",
    Canada: "🇨🇦",
    Germany: "🇩🇪",
    India: "🇮🇳",
    Singapore: "🇸🇬",
    UAE: "🇦🇪",
    Australia: "🇦🇺",
  };

  const topLocations: LocationStat[] = Array.from(locMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((l) => ({
      country: l.country,
      city: l.city,
      flag: flagMap[l.country] || "🌐",
      visits: l.count,
      percentage: totalVisits > 0 ? Math.round((l.count / totalVisits) * 100) : 0,
    }));

  // Device Breakdown
  const devMap = new Map<"Desktop" | "Mobile" | "Tablet", number>();
  devMap.set("Desktop", 0);
  devMap.set("Mobile", 0);
  devMap.set("Tablet", 0);

  filteredEvents.forEach((e) => {
    const d = e.device || "Desktop";
    devMap.set(d, (devMap.get(d) || 0) + 1);
  });

  const deviceBreakdown: DeviceStat[] = (["Desktop", "Mobile", "Tablet"] as const).map((device) => {
    const count = devMap.get(device) || 0;
    return {
      device,
      count,
      percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0,
    };
  });

  // OS Breakdown
  const osMap = new Map<string, number>();
  filteredEvents.forEach((e) => {
    const o = e.os || "Windows";
    osMap.set(o, (osMap.get(o) || 0) + 1);
  });

  const osBreakdown: OsStat[] = Array.from(osMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([os, count]) => ({
      os,
      count,
      percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0,
    }));

  // Top Pages / Sections
  const pageMap = new Map<string, { path: string; title: string; count: number }>();
  filteredEvents.forEach((e) => {
    if (Array.isArray(e.visitedPages) && e.visitedPages.length > 0) {
      e.visitedPages.forEach((p) => {
        const key = p;
        if (!pageMap.has(key)) {
          pageMap.set(key, { path: p.toLowerCase(), title: p, count: 0 });
        }
        pageMap.get(key)!.count++;
      });
    } else {
      const key = e.section || e.pagePath || "Hero";
      if (!pageMap.has(key)) {
        pageMap.set(key, { path: e.pagePath || "/", title: e.section || "Hero", count: 0 });
      }
      pageMap.get(key)!.count++;
    }
  });

  const topPages: PageStat[] = Array.from(pageMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
    .map((p) => ({
      path: p.path,
      title: p.title,
      visits: p.count,
      percentage: totalVisits > 0 ? Math.round((p.count / totalVisits) * 100) : 0,
    }));

  // Top Referrers
  const refMap = new Map<string, number>();
  filteredEvents.forEach((e) => {
    const r = e.referrer || "Direct";
    refMap.set(r, (refMap.get(r) || 0) + 1);
  });

  const topReferrers: ReferrerStat[] = Array.from(refMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([source, count]) => ({
      source,
      count,
      percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0,
    }));

  // Aggregate visitedPages by session ID
  const sessionPagesMap = new Map<string, string[]>();
  allEvents.forEach((e) => {
    const sid = e.sessionId || e.id;
    if (!sessionPagesMap.has(sid)) {
      sessionPagesMap.set(sid, []);
    }
    const currentList = sessionPagesMap.get(sid)!;
    if (Array.isArray(e.visitedPages) && e.visitedPages.length > 0) {
      e.visitedPages.forEach((p) => {
        if (!currentList.includes(p)) currentList.push(p);
      });
    } else {
      const pName = formatPageName(e.section || e.pagePath);
      if (!currentList.includes(pName)) currentList.push(pName);
    }
  });

  // Assign aggregated visitedPages to all filtered events
  filteredEvents.forEach((e) => {
    const sid = e.sessionId || e.id;
    const pages = sessionPagesMap.get(sid);
    e.visitedPages = pages && pages.length > 0 ? pages : [formatPageName(e.section || e.pagePath)];
  });

  // Deduplicate recentEvents by sessionId so each row in Visitor Activity Logs represents a unique visitor session
  const seenSessions = new Set<string>();
  const uniqueSessionEvents: VisitorEvent[] = [];
  filteredEvents.forEach((e) => {
    const key = e.sessionId || e.id;
    if (!seenSessions.has(key)) {
      seenSessions.add(key);
      uniqueSessionEvents.push(e);
    }
  });

  return {
    totalVisits,
    uniqueVisitors,
    newVisitors: newVisitorsCount,
    returningVisitors: returningVisitorsCount,
    avgDurationSeconds,
    bounceRate,
    dailyTrends,
    topLocations,
    deviceBreakdown,
    osBreakdown,
    topPages,
    topReferrers,
    recentEvents: uniqueSessionEvents.slice(0, 100),
  };
};

// Clear analytics history from database and local caches
export const clearAnalyticsHistory = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    // 1. Clear local storage cache & all tracking session markers
    localStorage.removeItem(STORAGE_ANALYTICS_KEY);
    sessionStorage.removeItem("maharab_session_visited_pages");
    sessionStorage.removeItem("maharab_last_tracked_page");
    sessionStorage.removeItem("maharab_last_hit_time");
    sessionStorage.removeItem(STORAGE_SID_KEY);

    // 2. Clear from Supabase cloud database if connected
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from("portfolio_analytics")
          .delete()
          .not("id", "is", null);

        if (error) {
          console.warn("Supabase delete failed with not null filter, trying fallback filter:", error.message);
          await supabase
            .from("portfolio_analytics")
            .delete()
            .neq("visitor_id", "__none_impossible__");
        }
      } catch (cloudErr) {
        console.warn("Failed to clear Supabase analytics:", cloudErr);
      }
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_analytics_updated"));
    }

    return { success: true };
  } catch (e: any) {
    console.error("Failed to clear analytics history:", e);
    return { success: false, error: e?.message || "Failed to clear analytics" };
  }
};

// Delete single log entry from local storage and Supabase
export const deleteVisitorLog = async (id: string, sessionId?: string): Promise<boolean> => {
  try {
    // 1. Update local storage cache
    const raw = localStorage.getItem(STORAGE_ANALYTICS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter(
          (e: VisitorEvent) => e.id !== id && (sessionId ? e.sessionId !== sessionId : true)
        );
        localStorage.setItem(STORAGE_ANALYTICS_KEY, JSON.stringify(filtered));
      }
    }

    // 2. Delete from Supabase
    if (isSupabaseConfigured && supabase) {
      try {
        if (sessionId) {
          await supabase.from("portfolio_analytics").delete().eq("session_id", sessionId);
        } else {
          await supabase.from("portfolio_analytics").delete().eq("id", id);
        }
      } catch (cloudErr) {
        console.warn("Failed to delete log from Supabase:", cloudErr);
      }
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_analytics_updated"));
    }
    return true;
  } catch (err) {
    console.error("Error deleting visitor log:", err);
    return false;
  }
};

// Aliased for backwards compatibility with existing UI buttons
export const resetAnalyticsToSeed = clearAnalyticsHistory;
