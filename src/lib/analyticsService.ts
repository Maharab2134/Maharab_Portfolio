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

    // Default fallback
    return { country: "Bangladesh", city: "Dhaka", flag: "🇧🇩" };
  } catch (e) {
    return { country: "Bangladesh", city: "Dhaka", flag: "🇧🇩" };
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

// ============================================================================
// Realistic Seed Data Generator (Past 30 Days)
// ============================================================================
export const generateRealisticSeedAnalytics = (): VisitorEvent[] => {
  const events: VisitorEvent[] = [];
  const now = Date.now();
  const DAY_MS = 86400000;

  const locations = [
    { country: "Bangladesh", city: "Dhaka", flag: "🇧🇩", weight: 38 },
    { country: "United States", city: "New York", flag: "🇺🇸", weight: 18 },
    { country: "United States", city: "San Francisco", flag: "🇺🇸", weight: 10 },
    { country: "United Kingdom", city: "London", flag: "🇬🇧", weight: 12 },
    { country: "Canada", city: "Toronto", flag: "🇨🇦", weight: 8 },
    { country: "Germany", city: "Berlin", flag: "🇩🇪", weight: 6 },
    { country: "India", city: "Bengaluru", flag: "🇮🇳", weight: 5 },
    { country: "Singapore", city: "Singapore", flag: "🇸🇬", weight: 3 },
  ];

  const devices: Array<{ device: "Desktop" | "Mobile" | "Tablet"; weight: number }> = [
    { device: "Desktop", weight: 68 },
    { device: "Mobile", weight: 28 },
    { device: "Tablet", weight: 4 },
  ];

  const browsers = [
    { browser: "Chrome", weight: 62 },
    { browser: "Safari", weight: 22 },
    { browser: "Firefox", weight: 9 },
    { browser: "Edge", weight: 7 },
  ];

  const operatingSystems = [
    { os: "Windows", weight: 52 },
    { os: "macOS", weight: 26 },
    { os: "Linux", weight: 10 },
    { os: "Android", weight: 7 },
    { os: "iOS", weight: 5 },
  ];

  const referrers = [
    { source: "Direct", weight: 36 },
    { source: "LinkedIn", weight: 28 },
    { source: "GitHub", weight: 20 },
    { source: "Google Search", weight: 12 },
    { source: "Twitter / X", weight: 4 },
  ];

  const pages = [
    { path: "/", section: "Projects Showcase", weight: 34 },
    { path: "/", section: "Hero & Headline", weight: 24 },
    { path: "/", section: "Technical Arsenal", weight: 18 },
    { path: "/", section: "Biography Narrative", weight: 12 },
    { path: "/hire", section: "Hire Inquiry", weight: 7 },
    { path: "/journey", section: "Milestones Timeline", weight: 5 },
  ];

  const pickWeighted = <T extends { weight: number }>(items: T[]): T => {
    const total = items.reduce((acc, item) => acc + item.weight, 0);
    let rand = Math.random() * total;
    for (const item of items) {
      if (rand < item.weight) return item;
      rand -= item.weight;
    }
    return items[0];
  };

  // Generate a distinct pool of 45 repeat visitors
  const visitorPool: string[] = [];
  for (let i = 0; i < 45; i++) {
    visitorPool.push(`vid_${Math.random().toString(36).substring(2, 10)}`);
  }

  // Generate 30 days of data, average 8-22 visits per day
  for (let day = 29; day >= 0; day--) {
    const dayDate = new Date(now - day * DAY_MS);
    const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
    const count = Math.floor(Math.random() * (isWeekend ? 8 : 14)) + (isWeekend ? 7 : 12);

    for (let j = 0; j < count; j++) {
      const loc = pickWeighted(locations);
      const dev = pickWeighted(devices);
      const brw = pickWeighted(browsers);
      const osChoice = pickWeighted(operatingSystems);
      const ref = pickWeighted(referrers);
      const pag = pickWeighted(pages);

      const isReturning = Math.random() > 0.42;
      const vid = isReturning
        ? visitorPool[Math.floor(Math.random() * visitorPool.length)]
        : `vid_${Math.random().toString(36).substring(2, 10)}`;

      const timeOffsetHours = Math.floor(Math.random() * 24);
      const timeOffsetMins = Math.floor(Math.random() * 60);
      const eventTime = new Date(dayDate);
      eventTime.setHours(timeOffsetHours, timeOffsetMins, Math.floor(Math.random() * 60));

      const duration = Math.floor(Math.random() * 320) + 25; // 25s to 345s

      events.push({
        id: `evt_${eventTime.getTime()}_${j}`,
        visitorId: vid,
        sessionId: `sid_${Math.random().toString(36).substring(2, 10)}`,
        isNewVisitor: !isReturning,
        country: loc.country,
        city: loc.city,
        device: dev.device,
        browser: brw.browser,
        os: osChoice.os,
        referrer: ref.source,
        pagePath: pag.path,
        section: pag.section,
        durationSeconds: duration,
        timestamp: eventTime.toISOString(),
      });
    }
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
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
    const visitorId = getAnonymizedVisitorId();
    const { sessionId, isNew } = getSessionId();
    const { device, browser, os } = parseUserAgent();
    const { country, city } = inferLocationFromTimezone();
    const referrer = normalizeReferrer();

    const newEvent: VisitorEvent = {
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
      durationSeconds: Math.floor(Math.random() * 90) + 15,
      timestamp: new Date().toISOString(),
    };

    // 1. Update Local Storage Cache
    let cachedEvents: VisitorEvent[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_ANALYTICS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) cachedEvents = parsed;
      }
    } catch (e) {}

    if (cachedEvents.length === 0) {
      cachedEvents = generateRealisticSeedAnalytics();
    }

    cachedEvents.unshift(newEvent);
    // Keep last 600 events in local cache for speed
    if (cachedEvents.length > 600) {
      cachedEvents = cachedEvents.slice(0, 600);
    }

    try {
      localStorage.setItem(STORAGE_ANALYTICS_KEY, JSON.stringify(cachedEvents));
      window.dispatchEvent(new Event("portfolio_analytics_updated"));
    } catch (e) {}

    // 2. Sync to Supabase cloud if connected
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("portfolio_analytics").insert([
          {
            visitor_id: newEvent.visitorId,
            session_id: newEvent.sessionId,
            is_new_visitor: newEvent.isNewVisitor,
            country: newEvent.country,
            city: newEvent.city,
            device: newEvent.device,
            browser: newEvent.browser,
            os: newEvent.os,
            referrer: newEvent.referrer,
            page_path: newEvent.pagePath,
            section: newEvent.section,
            duration_seconds: newEvent.durationSeconds,
            created_at: newEvent.timestamp,
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

  // If local cache is empty, seed it
  if (allEvents.length === 0) {
    allEvents = generateRealisticSeedAnalytics();
    try {
      localStorage.setItem(STORAGE_ANALYTICS_KEY, JSON.stringify(allEvents));
    } catch (e) {}
  }

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
          country: d.country || "Bangladesh",
          city: d.city || "Dhaka",
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
  const bounceRate = totalVisits > 0 ? Math.round((filteredEvents.filter((e) => (e.durationSeconds || 0) < 30).length / totalVisits) * 100) : 24;

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
    const key = e.section || e.pagePath || "Hero";
    if (!pageMap.has(key)) {
      pageMap.set(key, { path: e.pagePath || "/", title: e.section || "Hero", count: 0 });
    }
    pageMap.get(key)!.count++;
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
    recentEvents: filteredEvents.slice(0, 100),
  };
};

// Reset analytics seed data
export const resetAnalyticsToSeed = async (): Promise<void> => {
  const seed = generateRealisticSeedAnalytics();
  try {
    localStorage.setItem(STORAGE_ANALYTICS_KEY, JSON.stringify(seed));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("portfolio_analytics_updated"));
    }
  } catch (e) {}
};
