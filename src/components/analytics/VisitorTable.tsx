import React, { useState, useMemo } from "react";
import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaCopy,
  FaCheck,
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaShieldAlt,
} from "react-icons/fa";
import { VisitorEvent } from "../../lib/analyticsService";

interface VisitorTableProps {
  events: VisitorEvent[];
}

const renderIcon = (Icon: any, props: any = {}) => {
  const Comp: any = Icon;
  return <Comp {...props} />;
};

export const VisitorTable: React.FC<VisitorTableProps> = ({ events }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceFilter, setDeviceFilter] = useState<string>("all");
  const [visitorTypeFilter, setVisitorTypeFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [copiedVid, setCopiedVid] = useState<string | null>(null);
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({});

  const toggleExpandPages = (id: string) => {
    setExpandedRowIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy helper
  const handleCopy = (vid: string) => {
    navigator.clipboard.writeText(vid);
    setCopiedVid(vid);
    setTimeout(() => setCopiedVid(null), 2000);
  };

  // Format Duration seconds to human readable
  const formatDuration = (seconds: number): string => {
    if (!seconds || seconds <= 0) return "10s";
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const rem = seconds % 60;
    return rem > 0 ? `${mins}m ${rem}s` : `${mins}m`;
  };

  // Format timestamp
  const formatTime = (isoString: string): { date: string; time: string } => {
    try {
      const d = new Date(isoString);
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        time: d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      };
    } catch {
      return { date: isoString, time: "" };
    }
  };

  // Filtered dataset
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      // Search matches
      const term = searchTerm.toLowerCase();
      const eventPages = e.visitedPages && e.visitedPages.length > 0 ? e.visitedPages : [e.pagePath];
      const matchesSearch =
        !term ||
        e.visitorId.toLowerCase().includes(term) ||
        e.country.toLowerCase().includes(term) ||
        e.city.toLowerCase().includes(term) ||
        e.browser.toLowerCase().includes(term) ||
        e.os.toLowerCase().includes(term) ||
        e.pagePath.toLowerCase().includes(term) ||
        eventPages.some((p) => p.toLowerCase().includes(term)) ||
        e.referrer.toLowerCase().includes(term);

      // Device filter
      const matchesDevice = deviceFilter === "all" || e.device.toLowerCase() === deviceFilter.toLowerCase();

      // Visitor type filter
      const matchesType =
        visitorTypeFilter === "all" ||
        (visitorTypeFilter === "new" && e.isNewVisitor) ||
        (visitorTypeFilter === "returning" && !e.isNewVisitor);

      return matchesSearch && matchesDevice && matchesType;
    });
  }, [events, searchTerm, deviceFilter, visitorTypeFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / rowsPerPage));
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredEvents.slice(start, start + rowsPerPage);
  }, [filteredEvents, currentPage, rowsPerPage]);

  // Export to CSV function
  const handleExportCSV = () => {
    const headers = [
      "Visitor ID",
      "Timestamp",
      "Country",
      "City",
      "Device",
      "Browser",
      "OS",
      "Referrer",
      "Pages Visited",
      "Duration (s)",
      "Visitor Type",
    ];

    const rows = filteredEvents.map((e) => {
      const pages = (e.visitedPages && e.visitedPages.length > 0 ? e.visitedPages : [e.pagePath]).join(" -> ");
      return [
        `"${e.visitorId}"`,
        `"${e.timestamp}"`,
        `"${e.country}"`,
        `"${e.city}"`,
        `"${e.device}"`,
        `"${e.browser}"`,
        `"${e.os}"`,
        `"${e.referrer}"`,
        `"${pages}"`,
        e.durationSeconds,
        e.isNewVisitor ? "First-time" : "Returning",
      ];
    });

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `portfolio_analytics_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getDeviceIcon = (dev: string) => {
    switch (dev.toLowerCase()) {
      case "desktop":
        return renderIcon(FaDesktop, { className: "h-3 w-3 text-cyan-400" });
      case "mobile":
        return renderIcon(FaMobileAlt, { className: "h-3 w-3 text-amber-400" });
      case "tablet":
        return renderIcon(FaTabletAlt, { className: "h-3 w-3 text-emerald-400" });
      default:
        return renderIcon(FaDesktop, { className: "h-3 w-3 text-slate-400" });
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#111726]/90 via-[#0e1422]/90 to-[#090d16] p-5 shadow-2xl backdrop-blur-xl">
      {/* Table Header & Toolbar */}
      <div className="mb-5 flex flex-col gap-4 border-b border-white/5 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide">Visitor Activity Logs</h3>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              {renderIcon(FaShieldAlt, { className: "h-2.5 w-2.5" })}
              100% Anonymized & GDPR-Safe
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Detailed chronological record of incoming portfolio interactions
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Box */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">
              {renderIcon(FaSearch, { className: "h-3 w-3" })}
            </span>
            <input
              type="text"
              placeholder="Search visitor ID, location, page..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-white/10 bg-[#090d16] py-1.5 pl-9 pr-3 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30"
            />
          </div>

          {/* Device Filter */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-[#090d16] px-2 py-1">
            <span className="text-[10px] text-slate-500">
              {renderIcon(FaFilter, { className: "h-2.5 w-2.5" })}
            </span>
            <select
              value={deviceFilter}
              onChange={(e) => {
                setDeviceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0c101d] text-white">All Devices</option>
              <option value="desktop" className="bg-[#0c101d] text-white">Desktop</option>
              <option value="mobile" className="bg-[#0c101d] text-white">Mobile</option>
              <option value="tablet" className="bg-[#0c101d] text-white">Tablet</option>
            </select>
          </div>

          {/* Visitor Type Filter */}
          <div className="rounded-xl border border-white/10 bg-[#090d16] px-2 py-1">
            <select
              value={visitorTypeFilter}
              onChange={(e) => {
                setVisitorTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs text-slate-300 outline-none cursor-pointer"
            >
              <option value="all" className="bg-[#0c101d] text-white">All Visitors</option>
              <option value="new" className="bg-[#0c101d] text-white">First-time</option>
              <option value="returning" className="bg-[#0c101d] text-white">Returning</option>
            </select>
          </div>

          {/* Export CSV Button */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20 active:scale-95 cursor-pointer"
          >
            {renderIcon(FaDownload, { className: "h-3 w-3" })}
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto rounded-xl border border-white/5 bg-[#090d16]/70">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-white/10 bg-[#0c1220] text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3">Visitor ID</th>
              <th scope="col" className="px-4 py-3">Date & Time</th>
              <th scope="col" className="px-4 py-3">Location</th>
              <th scope="col" className="px-4 py-3">Device & OS</th>
              <th scope="col" className="px-4 py-3">Browser</th>
              <th scope="col" className="px-4 py-3">Referrer</th>
              <th scope="col" className="px-4 py-3">Pages Visited</th>
              <th scope="col" className="px-4 py-3 text-right">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {paginatedEvents.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500 text-xs">
                  No visitor records matched your criteria.
                </td>
              </tr>
            ) : (
              paginatedEvents.map((event) => {
                const { date, time } = formatTime(event.timestamp);

                return (
                  <tr
                    key={event.id}
                    className="transition-colors hover:bg-white/[0.03] group"
                  >
                    {/* Visitor ID */}
                    <td className="px-4 py-3 font-mono">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-white/5 px-2 py-0.5 text-[11px] font-semibold text-cyan-300 border border-cyan-500/20">
                          {event.visitorId}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(event.visitorId)}
                          title="Copy Anonymized ID"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-white"
                        >
                          {copiedVid === event.visitorId ? (
                            renderIcon(FaCheck, { className: "h-2.5 w-2.5 text-emerald-400" })
                          ) : (
                            renderIcon(FaCopy, { className: "h-2.5 w-2.5" })
                          )}
                        </button>
                        {event.isNewVisitor ? (
                          <span className="rounded bg-blue-500/10 px-1.5 py-0.2 text-[9px] font-medium text-blue-400 border border-blue-500/20">
                            New
                          </span>
                        ) : (
                          <span className="rounded bg-purple-500/10 px-1.5 py-0.2 text-[9px] font-medium text-purple-400 border border-purple-500/20">
                            Return
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-slate-200 font-medium">{date}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{time}</div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm">
                          {event.country === "Bangladesh"
                            ? "🇧🇩"
                            : event.country === "United States"
                            ? "🇺🇸"
                            : event.country === "United Kingdom"
                            ? "🇬🇧"
                            : event.country === "Germany"
                            ? "🇩🇪"
                            : event.country === "Canada"
                            ? "🇨🇦"
                            : event.country === "Singapore"
                            ? "🇸🇬"
                            : event.country === "India"
                            ? "🇮🇳"
                            : "🌐"}
                        </span>
                        <div>
                          <div className="font-semibold text-slate-200">{event.city}</div>
                          <div className="text-[10px] text-slate-500">{event.country}</div>
                        </div>
                      </div>
                    </td>

                    {/* Device & OS */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(event.device)}
                        <div>
                          <div className="font-medium text-slate-200">{event.device}</div>
                          <div className="text-[10px] text-slate-500">{event.os}</div>
                        </div>
                      </div>
                    </td>

                    {/* Browser */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                        {event.browser}
                      </span>
                    </td>

                    {/* Referrer */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          event.referrer === "Direct"
                            ? "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                            : event.referrer === "LinkedIn"
                            ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                            : event.referrer === "GitHub"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : event.referrer === "Google"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        }`}
                      >
                        {event.referrer}
                      </span>
                    </td>

                    {/* Pages Visited */}
                    <td className="px-4 py-3">
                      {(() => {
                        const pages: string[] =
                          event.visitedPages && event.visitedPages.length > 0
                            ? event.visitedPages
                            : [event.pagePath ? event.pagePath.replace(/^\/+/, "") : "Home"];
                        const isExpanded = Boolean(expandedRowIds[event.id]);
                        const hasMoreThanTwo = pages.length > 2;
                        const visiblePages = hasMoreThanTwo && !isExpanded ? pages.slice(0, 2) : pages;

                        return (
                          <div className="flex flex-wrap items-center gap-1.5 min-w-[170px] max-w-[320px]">
                            {visiblePages.map((page, pIdx) => (
                              <React.Fragment key={pIdx}>
                                {pIdx > 0 && (
                                  <span className="text-slate-600 text-[10px] select-none">→</span>
                                )}
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 whitespace-nowrap">
                                  /{page}
                                </span>
                              </React.Fragment>
                            ))}

                            {hasMoreThanTwo && !isExpanded && (
                              <button
                                type="button"
                                onClick={() => toggleExpandPages(event.id)}
                                title={`Click to show all ${pages.length} visited pages`}
                                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 hover:bg-purple-500/30 hover:border-purple-400 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
                              >
                                <span>...</span>
                                <span className="text-[9px] opacity-80">(+{pages.length - 2})</span>
                              </button>
                            )}

                            {hasMoreThanTwo && isExpanded && (
                              <button
                                type="button"
                                onClick={() => toggleExpandPages(event.id)}
                                title="Click to collapse"
                                className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer ml-1"
                              >
                                Hide
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </td>

                    {/* Session Duration */}
                    <td className="px-4 py-3 text-right whitespace-nowrap font-mono">
                      <span className="flex items-center justify-end gap-1 text-slate-300 font-semibold">
                        {renderIcon(FaClock, { className: "h-2.5 w-2.5 text-slate-500" })}
                        {formatDuration(event.durationSeconds)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>Showing</span>
          <span className="font-bold text-white">
            {filteredEvents.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0}
          </span>
          <span>to</span>
          <span className="font-bold text-white">
            {Math.min(currentPage * rowsPerPage, filteredEvents.length)}
          </span>
          <span>of</span>
          <span className="font-bold text-white">{filteredEvents.length}</span>
          <span>records</span>

          <div className="ml-4 flex items-center gap-1.5">
            <span className="text-slate-500 text-[11px]">Rows:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="rounded bg-[#090d16] border border-white/10 px-1.5 py-0.5 text-slate-300 outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-[#090d16] text-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 cursor-pointer"
          >
            {renderIcon(FaChevronLeft, { className: "h-2.5 w-2.5" })}
          </button>
          <span className="px-2 text-xs font-mono font-medium text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-[#090d16] text-slate-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5 cursor-pointer"
          >
            {renderIcon(FaChevronRight, { className: "h-2.5 w-2.5" })}
          </button>
        </div>
      </div>
    </div>
  );
};
