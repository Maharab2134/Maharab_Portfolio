import React, { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChartLine, FaCalendarAlt } from "react-icons/fa";
import { DailyVisitorTrend } from "../../lib/analyticsService";

interface VisitorTrendChartProps {
  data: DailyVisitorTrend[];
  title?: string;
}

// Generate smooth SVG cubic Bézier path from points
const createSmoothPath = (points: { x: number; y: number }[]): string => {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const current = points[i];
    const next = points[i + 1];
    const prev = points[i - 1] || current;
    const nextNext = points[i + 2] || next;

    const cp1x = current.x + (next.x - prev.x) / 6;
    const cp1y = current.y + (next.y - prev.y) / 6;
    const cp2x = next.x - (nextNext.x - current.x) / 6;
    const cp2y = next.y - (nextNext.y - current.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
  }
  return path;
};

const renderIcon = (Icon: any, props: any = {}) => {
  const Comp: any = Icon;
  return <Comp {...props} />;
};

export const VisitorTrendChart: React.FC<VisitorTrendChartProps> = ({
  data,
  title = "Visitor Traffic Dynamics",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [activeSeries, setActiveSeries] = useState<"both" | "total" | "unique">("both");

  // Chart dimensions
  const width = 860;
  const height = 300;
  const padding = { top: 30, right: 30, bottom: 45, left: 45 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // Compute scale boundaries
  const { maxVal, peakPoint } = useMemo<{
    maxVal: number;
    peakPoint: { label: string; value: number } | null;
  }>(() => {
    if (!data || data.length === 0) return { maxVal: 10, peakPoint: null };
    let highest = 0;
    let peak: { label: string; value: number } | null = null;
    data.forEach((d) => {
      const top = Math.max(d.totalVisits, d.uniqueVisitors);
      if (top > highest) {
        highest = top;
        peak = { label: d.label, value: d.totalVisits };
      }
    });
    // Add margin for visual headroom
    const roundedMax = Math.ceil((highest * 1.18 || 10) / 10) * 10;
    return { maxVal: Math.max(roundedMax, 10), peakPoint: peak };
  }, [data]);

  // Compute coordinates for data points
  const { totalPoints, uniquePoints } = useMemo(() => {
    if (!data || data.length === 0) return { totalPoints: [], uniquePoints: [] };
    const step = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth / 2;

    const tPts = data.map((d, i) => {
      const x = padding.left + (data.length > 1 ? i * step : innerWidth / 2);
      const y = padding.top + innerHeight - (d.totalVisits / maxVal) * innerHeight;
      return { x, y, raw: d };
    });

    const uPts = data.map((d, i) => {
      const x = padding.left + (data.length > 1 ? i * step : innerWidth / 2);
      const y = padding.top + innerHeight - (d.uniqueVisitors / maxVal) * innerHeight;
      return { x, y, raw: d };
    });

    return { totalPoints: tPts, uniquePoints: uPts };
  }, [data, innerWidth, innerHeight, maxVal, padding.left, padding.top]);

  // Paths
  const totalLinePath = useMemo(() => createSmoothPath(totalPoints), [totalPoints]);
  const uniqueLinePath = useMemo(() => createSmoothPath(uniquePoints), [uniquePoints]);

  const totalAreaPath = useMemo(() => {
    if (totalPoints.length === 0) return "";
    const bottomY = padding.top + innerHeight;
    const first = totalPoints[0];
    const last = totalPoints[totalPoints.length - 1];
    return `${totalLinePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [totalLinePath, totalPoints, innerHeight, padding.top]);

  const uniqueAreaPath = useMemo(() => {
    if (uniquePoints.length === 0) return "";
    const bottomY = padding.top + innerHeight;
    const first = uniquePoints[0];
    const last = uniquePoints[uniquePoints.length - 1];
    return `${uniqueLinePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  }, [uniqueLinePath, uniquePoints, innerHeight, padding.top]);

  // Gridlines
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((factor) => ({
    val: Math.round(maxVal * factor),
    y: padding.top + innerHeight - factor * innerHeight,
  }));

  // Handle pointer tracking
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!data || data.length === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const relativeX = (clientX / rect.width) * width - padding.left;
    const step = innerWidth / (data.length - 1 || 1);
    const index = Math.round(relativeX / step);
    const clampedIndex = Math.max(0, Math.min(data.length - 1, index));
    setHoverIndex(clampedIndex);
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  const activeDataPoint = hoverIndex !== null && data[hoverIndex] ? data[hoverIndex] : null;
  const activeTotalPoint = hoverIndex !== null && totalPoints[hoverIndex] ? totalPoints[hoverIndex] : null;
  const activeUniquePoint = hoverIndex !== null && uniquePoints[hoverIndex] ? uniquePoints[hoverIndex] : null;

  return (
    <div className="relative rounded-2xl border border-cyan-500/20 bg-gradient-to-b from-[#111726]/90 via-[#0e1422]/90 to-[#090d16] p-5 shadow-2xl backdrop-blur-xl">
      {/* Header & Controls */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            {renderIcon(FaChartLine, { className: "h-5 w-5" })}
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              {title}
              {peakPoint && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Peak: {peakPoint.value} on {peakPoint.label}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Interactive timeline visualizing visits & verified unique reach
            </p>
          </div>
        </div>

        {/* Series Filter Tabs */}
        <div className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#090d16]/80 p-1">
          <button
            type="button"
            onClick={() => setActiveSeries("both")}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeSeries === "both"
                ? "bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            All Series
          </button>
          <button
            type="button"
            onClick={() => setActiveSeries("total")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeSeries === "total"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Total Visits
          </button>
          <button
            type="button"
            onClick={() => setActiveSeries("unique")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeSeries === "unique"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-purple-400" />
            Unique
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div ref={containerRef} className="relative w-full overflow-hidden select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair overflow-visible"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {/* Cyan Gradient for Total Visits */}
            <linearGradient id="cyanAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
              <stop offset="60%" stopColor="#0284c7" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0" />
            </linearGradient>

            {/* Purple Gradient for Unique Visitors */}
            <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.40" />
              <stop offset="60%" stopColor="#7e22ce" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#581c87" stopOpacity="0" />
            </linearGradient>

            {/* Glowing Line Filters */}
            <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#06b6d4" floodOpacity="0.8" />
            </filter>
            <filter id="glowPurple" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#a855f7" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Horizontal Gridlines & Y-Axis values */}
          {yTicks.map((tick, idx) => (
            <g key={idx}>
              <line
                x1={padding.left}
                y1={tick.y}
                x2={width - padding.right}
                y2={tick.y}
                stroke="rgba(255,255,255,0.06)"
                strokeDasharray="4 4"
              />
              <text
                x={padding.left - 10}
                y={tick.y + 4}
                textAnchor="end"
                fontSize="11"
                fill="#64748b"
                fontWeight="500"
                fontFamily="inherit"
              >
                {tick.val}
              </text>
            </g>
          ))}

          {/* Area Fills */}
          {(activeSeries === "both" || activeSeries === "total") && (
            <path d={totalAreaPath} fill="url(#cyanAreaGrad)" />
          )}
          {(activeSeries === "both" || activeSeries === "unique") && (
            <path d={uniqueAreaPath} fill="url(#purpleAreaGrad)" />
          )}

          {/* Stroke Lines */}
          {(activeSeries === "both" || activeSeries === "total") && (
            <path
              d={totalLinePath}
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glowCyan)"
            />
          )}

          {(activeSeries === "both" || activeSeries === "unique") && (
            <path
              d={uniqueLinePath}
              fill="none"
              stroke="#c084fc"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glowPurple)"
            />
          )}

          {/* Static small point markers when fewer data points */}
          {data.length <= 15 &&
            (activeSeries === "both" || activeSeries === "total") &&
            totalPoints.map((pt, i) => (
              <circle
                key={`t-${i}`}
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#06b6d4"
                stroke="#090d16"
                strokeWidth="2"
              />
            ))}

          {data.length <= 15 &&
            (activeSeries === "both" || activeSeries === "unique") &&
            uniquePoints.map((pt, i) => (
              <circle
                key={`u-${i}`}
                cx={pt.x}
                cy={pt.y}
                r="3.5"
                fill="#c084fc"
                stroke="#090d16"
                strokeWidth="2"
              />
            ))}

          {/* X-Axis Date Labels */}
          {data.map((d, i) => {
            const step = data.length > 1 ? innerWidth / (data.length - 1) : innerWidth / 2;
            const x = padding.left + (data.length > 1 ? i * step : innerWidth / 2);
            // Skip labels if there are many days
            const skipInterval = data.length > 20 ? 4 : data.length > 10 ? 2 : 1;
            if (i % skipInterval !== 0 && i !== data.length - 1) return null;

            return (
              <text
                key={`x-${i}`}
                x={x}
                y={height - 12}
                textAnchor="middle"
                fontSize="11"
                fill={hoverIndex === i ? "#38bdf8" : "#64748b"}
                fontWeight={hoverIndex === i ? "700" : "500"}
                fontFamily="inherit"
              >
                {d.label}
              </text>
            );
          })}

          {/* Interactive Hover Crosshair & Dots */}
          {activeTotalPoint && (
            <g>
              <line
                x1={activeTotalPoint.x}
                y1={padding.top}
                x2={activeTotalPoint.x}
                y2={padding.top + innerHeight}
                stroke="#38bdf8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.8"
              />
              {(activeSeries === "both" || activeSeries === "total") && (
                <g>
                  <circle
                    cx={activeTotalPoint.x}
                    cy={activeTotalPoint.y}
                    r="8"
                    fill="#06b6d4"
                    fillOpacity="0.3"
                  />
                  <circle
                    cx={activeTotalPoint.x}
                    cy={activeTotalPoint.y}
                    r="4.5"
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}
              {activeUniquePoint && (activeSeries === "both" || activeSeries === "unique") && (
                <g>
                  <circle
                    cx={activeUniquePoint.x}
                    cy={activeUniquePoint.y}
                    r="8"
                    fill="#c084fc"
                    fillOpacity="0.3"
                  />
                  <circle
                    cx={activeUniquePoint.x}
                    cy={activeUniquePoint.y}
                    r="4.5"
                    fill="#c084fc"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                </g>
              )}
            </g>
          )}
        </svg>

        {/* Floating Glassmorphic Tooltip */}
        <AnimatePresence>
          {activeDataPoint && activeTotalPoint && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              style={{
                left: `${Math.min(
                  Math.max((activeTotalPoint.x / width) * 100, 14),
                  86
                )}%`,
                top: "16px",
              }}
              className="pointer-events-none absolute -translate-x-1/2 z-20 rounded-xl border border-white/20 bg-[#0c1220]/95 px-3.5 py-2.5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md"
            >
              <div className="flex items-center gap-1.5 border-b border-white/10 pb-1.5 mb-1.5 text-[11px] font-semibold text-slate-300">
                {renderIcon(FaCalendarAlt, { className: "h-3 w-3 text-cyan-400" })}
                <span>{activeDataPoint.label}</span>
                <span className="text-[10px] text-slate-500">({activeDataPoint.date})</span>
              </div>

              <div className="space-y-1 text-xs">
                {(activeSeries === "both" || activeSeries === "total") && (
                  <div className="flex items-center justify-between gap-4 font-mono">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
                      Total Visits:
                    </span>
                    <span className="font-bold text-cyan-300">{activeDataPoint.totalVisits}</span>
                  </div>
                )}

                {(activeSeries === "both" || activeSeries === "unique") && (
                  <div className="flex items-center justify-between gap-4 font-mono">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc]" />
                      Unique Reach:
                    </span>
                    <span className="font-bold text-purple-300">{activeDataPoint.uniqueVisitors}</span>
                  </div>
                )}

                <div className="pt-1 border-t border-white/5 text-[10px] text-slate-400 flex justify-between">
                  <span>Unique Ratio:</span>
                  <span className="text-emerald-400 font-semibold">
                    {activeDataPoint.totalVisits > 0
                      ? `${Math.round((activeDataPoint.uniqueVisitors / activeDataPoint.totalVisits) * 100)}%`
                      : "0%"}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 border-t border-white/5 pt-3">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            <span className="text-slate-200 font-medium">Total Hits</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-400 shadow-[0_0_8px_#c084fc]" />
            <span className="text-slate-200 font-medium">Unique Visitors</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-500">
          Tip: Hover over data points for high-precision timeline readings
        </div>
      </div>
    </div>
  );
};
