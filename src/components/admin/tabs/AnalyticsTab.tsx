import React from "react";
import { motion } from "framer-motion";
import {
  FaShieldAlt,
  FaSyncAlt,
  FaTrash,
  FaCheckCircle,
  FaTimes,
  FaChartLine,
  FaUsers,
  FaClock,
  FaPercentage,
} from "react-icons/fa";
import { renderIcon, AdminToast } from "../types";
import { TimeRangeFilter, AnalyticsSummary } from "../../../lib/analyticsService";
import {
  VisitorTrendChart,
  NewVsReturningChart,
  TopLocationsChart,
  DeviceBreakdownChart,
  PageVisitsChart,
  VisitorTable,
} from "../../analytics";

interface AnalyticsTabProps {
  analyticsFilter: TimeRangeFilter;
  setAnalyticsFilter: (filter: TimeRangeFilter) => void;
  loadAnalyticsData: (filter: TimeRangeFilter) => Promise<void>;
  analyticsLoading: boolean;
  handleResetAnalytics: (confirmFirst?: boolean) => Promise<void>;
  analyticsToast: AdminToast | null;
  setAnalyticsToast: React.Dispatch<React.SetStateAction<AdminToast | null>>;
  analyticsSummary: AnalyticsSummary | null;
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  analyticsFilter,
  setAnalyticsFilter,
  loadAnalyticsData,
  analyticsLoading,
  handleResetAnalytics,
  analyticsToast,
  setAnalyticsToast,
  analyticsSummary,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner & Date Filter Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-[#111726] via-[#141c30] to-[#0c1220] border border-cyan-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-medium flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Live Traffic Telemetry</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[11px] font-mono flex items-center gap-1">
              {renderIcon(FaShieldAlt, { className: "h-2.5 w-2.5" })}
              100% Client-Side Anonymized
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Visitor Analytics &amp; Audience Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
            Interactive graph-based dashboard monitoring who is discovering your portfolio, geographic spread, hardware profiles, popular sections, and inbound referrals.
          </p>
        </div>

        {/* Toolbar Controls */}
        <div className="relative z-10 flex flex-wrap items-center gap-3">
          {/* Time Range Segmented Control */}
          <div className="flex items-center rounded-xl border border-white/10 bg-[#090d16]/90 p-1 backdrop-blur-md">
            {(["today", "7d", "30d", "all"] as TimeRangeFilter[]).map((filter) => {
              const labels: Record<TimeRangeFilter, string> = {
                today: "Today",
                "7d": "7 Days",
                "30d": "30 Days",
                all: "All Time",
              };

              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setAnalyticsFilter(filter)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                    analyticsFilter === filter
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {labels[filter]}
                </button>
              );
            })}
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => loadAnalyticsData(analyticsFilter)}
            disabled={analyticsLoading}
            title="Refresh Live Analytics"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#090d16] text-slate-300 transition-all hover:border-cyan-500/40 hover:text-cyan-400 disabled:opacity-50 active:scale-95 cursor-pointer"
          >
            {renderIcon(FaSyncAlt, { className: `h-3.5 w-3.5 ${analyticsLoading ? "animate-spin text-cyan-400" : ""}` })}
          </button>

          {/* 100% Real-Time Indicator Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/10 text-[11px] font-semibold text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>100% Dynamic Traffic</span>
          </div>

          {/* Clear History Button */}
          <button
            type="button"
            onClick={() => handleResetAnalytics(false)}
            title="Clear visitor analytics logs (keep only genuine dynamic data)"
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 transition-all hover:bg-rose-500/20 active:scale-95 cursor-pointer"
          >
            {renderIcon(FaTrash, { className: "h-3 w-3" })}
            <span>Clear History</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {analyticsToast && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-lg ${
            analyticsToast.type === "success"
              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-300"
              : "bg-red-500/15 border border-red-500/30 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {renderIcon(FaCheckCircle, { className: "h-4 w-4" })}
            <span>{analyticsToast.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setAnalyticsToast(null)}
            className="text-slate-400 hover:text-white"
          >
            {renderIcon(FaTimes, { className: "h-3 w-3" })}
          </button>
        </motion.div>
      )}

      {/* 4 Top KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Visitors */}
        <div className="p-5 rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#111726]/80 to-[#090d16] hover:border-cyan-500/40 transition-all shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Visits</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              {renderIcon(FaChartLine, { className: "h-4 w-4" })}
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 font-mono">
            {analyticsSummary?.totalVisits ?? 0}
          </p>
          <div className="flex items-center justify-between text-[11px] text-cyan-400 font-medium mt-2 pt-2 border-t border-white/5">
            <span>In current window</span>
            <span className="font-semibold">
              {analyticsSummary && analyticsSummary.totalVisits > 0 ? "Real-time" : "Awaiting hits"}
            </span>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="p-5 rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#111726]/80 to-[#090d16] hover:border-purple-500/40 transition-all shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Unique Visitors</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              {renderIcon(FaUsers, { className: "h-4 w-4" })}
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 font-mono">
            {analyticsSummary?.uniqueVisitors ?? 0}
          </p>
          <div className="flex items-center justify-between text-[11px] text-purple-400 font-medium mt-2 pt-2 border-t border-white/5">
            <span>Verified reach</span>
            <span className="font-semibold">
              {analyticsSummary && analyticsSummary.totalVisits > 0
                ? `${Math.round((analyticsSummary.uniqueVisitors / analyticsSummary.totalVisits) * 100)}% unique`
                : "0%"}
            </span>
          </div>
        </div>

        {/* Avg Session Duration */}
        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#111726]/80 to-[#090d16] hover:border-emerald-500/40 transition-all shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Avg. Session Time</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              {renderIcon(FaClock, { className: "h-4 w-4" })}
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 font-mono">
            {analyticsSummary
              ? analyticsSummary.avgDurationSeconds < 60
                ? `${analyticsSummary.avgDurationSeconds}s`
                : `${Math.floor(analyticsSummary.avgDurationSeconds / 60)}m ${
                    analyticsSummary.avgDurationSeconds % 60
                  }s`
              : "0s"}
          </p>
          <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium mt-2 pt-2 border-t border-white/5">
            <span>Engaged attention</span>
            <span className="font-semibold">
              {analyticsSummary && analyticsSummary.totalVisits > 0
                ? analyticsSummary.avgDurationSeconds > 30
                  ? "Engaged"
                  : "Active"
                : "No activity"}
            </span>
          </div>
        </div>

        {/* Bounce / Retention Rate */}
        <div className="p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-b from-[#111726]/80 to-[#090d16] hover:border-amber-500/40 transition-all shadow-xl group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Bounce Rate</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              {renderIcon(FaPercentage, { className: "h-4 w-4" })}
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-2 font-mono">
            {analyticsSummary && analyticsSummary.totalVisits > 0 ? `${analyticsSummary.bounceRate}%` : "0%"}
          </p>
          <div className="flex items-center justify-between text-[11px] text-amber-400 font-medium mt-2 pt-2 border-t border-white/5">
            <span>
              {analyticsSummary && analyticsSummary.totalVisits > 0
                ? `${100 - analyticsSummary.bounceRate}% Multi-section Read`
                : "No visits recorded"}
            </span>
            <span className="font-semibold">
              {analyticsSummary && analyticsSummary.totalVisits > 0 ? "Dynamic" : "No Data"}
            </span>
          </div>
        </div>
      </div>

      {/* 1. Main Visitor Trend Chart */}
      {analyticsSummary && (
        <VisitorTrendChart
          data={analyticsSummary.dailyTrends}
          title={`Visitor Traffic Dynamics (${
            analyticsFilter === "today"
              ? "Today"
              : analyticsFilter === "7d"
              ? "Last 7 Days"
              : analyticsFilter === "30d"
              ? "Last 30 Days"
              : "All Time"
          })`}
        />
      )}

      {/* 2 & 3. Donut & Top Locations Grid */}
      {analyticsSummary && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 flex flex-col">
            <NewVsReturningChart
              newVisitors={analyticsSummary.newVisitors}
              returningVisitors={analyticsSummary.returningVisitors}
            />
          </div>
          <div className="lg:col-span-7 flex flex-col">
            <TopLocationsChart locations={analyticsSummary.topLocations} />
          </div>
        </div>
      )}

      {/* 4. Hardware & OS Matrix */}
      {analyticsSummary && (
        <DeviceBreakdownChart
          deviceBreakdown={analyticsSummary.deviceBreakdown}
          osBreakdown={analyticsSummary.osBreakdown}
        />
      )}

      {/* 5. Most Visited Pages & Referral Sources */}
      {analyticsSummary && (
        <PageVisitsChart
          topPages={analyticsSummary.topPages}
          topReferrers={analyticsSummary.topReferrers}
        />
      )}

      {/* 6. Detailed Visitor Activity Table */}
      {analyticsSummary && (
        <VisitorTable
          events={analyticsSummary.recentEvents}
          onRefresh={() => loadAnalyticsData(analyticsFilter)}
          onClearAll={() => handleResetAnalytics(true)}
        />
      )}
    </div>
  );
};
