import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaUserPlus, FaUserCheck, FaChartPie, FaPercentage } from "react-icons/fa";

interface NewVsReturningChartProps {
  newVisitors: number;
  returningVisitors: number;
}

const renderIcon = (Icon: any, props: any = {}) => {
  const Comp: any = Icon;
  return <Comp {...props} />;
};

export const NewVsReturningChart: React.FC<NewVsReturningChartProps> = ({
  newVisitors,
  returningVisitors,
}) => {
  const [hoveredSlice, setHoveredSlice] = useState<"new" | "returning" | null>(null);

  const total = newVisitors + returningVisitors;
  const newPct = total > 0 ? Math.round((newVisitors / total) * 100) : 0;
  const returnPct = total > 0 ? 100 - newPct : 0;

  // Donut geometry
  const size = 220;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculations for strokes
  const newDash = (newPct / 100) * circumference;
  const returnDash = (returnPct / 100) * circumference;
  const gap = total > 0 ? 3 : 0;

  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-purple-500/20 bg-gradient-to-b from-[#111726]/90 via-[#0e1422]/90 to-[#090d16] p-5 shadow-2xl backdrop-blur-xl">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            {renderIcon(FaChartPie, { className: "h-5 w-5" })}
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Audience Loyalty</h3>
            <p className="text-xs text-slate-400">New vs Returning visitor breakdown</p>
          </div>
        </div>

        <div className="rounded-lg border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-[11px] font-semibold text-purple-300">
          {returnPct >= 30 ? "High Retention" : "Discovery Stage"}
        </div>
      </div>

      {/* SVG Donut Graphic with center stat */}
      <div className="relative my-6 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          className="rotate-[-90deg] overflow-visible"
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            <linearGradient id="newVisitorGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <linearGradient id="returnVisitorGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <filter id="glowSlice" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />

          {/* New Visitors Slice */}
          {total > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#newVisitorGrad)"
              strokeWidth={hoveredSlice === "new" ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${Math.max(newDash - gap, 0)} ${circumference}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredSlice("new")}
              onMouseLeave={() => setHoveredSlice(null)}
              style={{
                filter: hoveredSlice === "new" ? "url(#glowSlice)" : "none",
                opacity: hoveredSlice && hoveredSlice !== "new" ? 0.4 : 1,
              }}
            />
          )}

          {/* Returning Visitors Slice */}
          {total > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="url(#returnVisitorGrad)"
              strokeWidth={hoveredSlice === "returning" ? strokeWidth + 4 : strokeWidth}
              strokeDasharray={`${Math.max(returnDash - gap, 0)} ${circumference}`}
              strokeDashoffset={-newDash}
              strokeLinecap="round"
              className="cursor-pointer transition-all duration-300"
              onMouseEnter={() => setHoveredSlice("returning")}
              onMouseLeave={() => setHoveredSlice(null)}
              style={{
                filter: hoveredSlice === "returning" ? "url(#glowSlice)" : "none",
                opacity: hoveredSlice && hoveredSlice !== "returning" ? 0.4 : 1,
              }}
            />
          )}
        </svg>

        {/* Central Display Metric */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {hoveredSlice === "new" ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="space-y-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-400">
                New Visitors
              </span>
              <p className="text-2xl font-extrabold text-white">{newVisitors}</p>
              <span className="text-xs font-medium text-cyan-300">{newPct}% of total</span>
            </motion.div>
          ) : hoveredSlice === "returning" ? (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="space-y-0.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">
                Returning
              </span>
              <p className="text-2xl font-extrabold text-white">{returningVisitors}</p>
              <span className="text-xs font-medium text-purple-300">{returnPct}% of total</span>
            </motion.div>
          ) : (
            <div className="space-y-0.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Total Reach
              </span>
              <p className="text-3xl font-extrabold text-white">{total}</p>
              <span className="text-[11px] font-medium text-emerald-400 flex items-center justify-center gap-1">
                {renderIcon(FaPercentage, { className: "h-2.5 w-2.5" })}
                {returnPct}% Retention
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Legend Cards */}
      <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
        {/* New Visitors Legend */}
        <div
          onMouseEnter={() => setHoveredSlice("new")}
          onMouseLeave={() => setHoveredSlice(null)}
          className={`cursor-pointer rounded-xl border p-3 transition-all ${
            hoveredSlice === "new"
              ? "border-cyan-500/50 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
              : "border-white/5 bg-[#090d16]/70 hover:border-cyan-500/30"
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/20 text-cyan-400">
              {renderIcon(FaUserPlus, { className: "h-3 w-3" })}
            </span>
            <span className="text-xs font-semibold text-slate-300">First-time</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-white font-mono">{newVisitors}</span>
            <span className="text-xs font-semibold text-cyan-400">{newPct}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${newPct}%` }}
            />
          </div>
        </div>

        {/* Returning Visitors Legend */}
        <div
          onMouseEnter={() => setHoveredSlice("returning")}
          onMouseLeave={() => setHoveredSlice(null)}
          className={`cursor-pointer rounded-xl border p-3 transition-all ${
            hoveredSlice === "returning"
              ? "border-purple-500/50 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
              : "border-white/5 bg-[#090d16]/70 hover:border-purple-500/30"
          }`}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/20 text-purple-400">
              {renderIcon(FaUserCheck, { className: "h-3 w-3" })}
            </span>
            <span className="text-xs font-semibold text-slate-300">Returning</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-white font-mono">{returningVisitors}</span>
            <span className="text-xs font-semibold text-purple-400">{returnPct}%</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500"
              style={{ width: `${returnPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
