import React, { useState } from "react";
import { FaGlobeAmericas, FaMapMarkerAlt, FaCity, FaFlag } from "react-icons/fa";
import { LocationStat } from "../../lib/analyticsService";

interface TopLocationsChartProps {
  locations: LocationStat[];
}

const renderIcon = (Icon: any, props: any = {}) => {
  const Comp: any = Icon;
  return <Comp {...props} />;
};

export const TopLocationsChart: React.FC<TopLocationsChartProps> = ({ locations }) => {
  const [viewMode, setViewMode] = useState<"city" | "country">("city");

  // Aggregate by country if selected
  const displayItems = React.useMemo(() => {
    if (viewMode === "city") {
      return locations.slice(0, 7);
    }
    const countryMap = new Map<string, { country: string; flag: string; visits: number }>();
    locations.forEach((loc) => {
      const existing = countryMap.get(loc.country);
      if (existing) {
        existing.visits += loc.visits;
      } else {
        countryMap.set(loc.country, {
          country: loc.country,
          flag: loc.flag,
          visits: loc.visits,
        });
      }
    });

    const totalCountryVisits = Array.from(countryMap.values()).reduce((acc, c) => acc + c.visits, 0);
    return Array.from(countryMap.values())
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 7)
      .map((c) => ({
        country: c.country,
        city: "All Regions",
        flag: c.flag,
        visits: c.visits,
        percentage: totalCountryVisits > 0 ? Math.round((c.visits / totalCountryVisits) * 100) : 0,
      }));
  }, [locations, viewMode]);

  const maxVisits = Math.max(...displayItems.map((l) => l.visits), 1);

  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-emerald-500/20 bg-gradient-to-b from-[#111726]/90 via-[#0e1422]/90 to-[#090d16] p-5 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            {renderIcon(FaGlobeAmericas, { className: "h-5 w-5" })}
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Top Geographies</h3>
            <p className="text-xs text-slate-400">Visitor distribution by country & metropolitan</p>
          </div>
        </div>

        {/* City vs Country Filter */}
        <div className="flex items-center rounded-xl border border-white/10 bg-[#090d16]/80 p-1">
          <button
            type="button"
            onClick={() => setViewMode("city")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === "city"
                ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {renderIcon(FaCity, { className: "h-3 w-3" })}
            Cities
          </button>
          <button
            type="button"
            onClick={() => setViewMode("country")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              viewMode === "country"
                ? "bg-emerald-500 text-black shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {renderIcon(FaFlag, { className: "h-3 w-3" })}
            Countries
          </button>
        </div>
      </div>

      {/* Ranked Location List */}
      <div className="my-4 space-y-3">
        {displayItems.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No geographic data captured yet
          </div>
        ) : (
          displayItems.map((loc, idx) => {
            const barWidth = Math.round((loc.visits / maxVisits) * 100);

            return (
              <div
                key={`${loc.country}-${loc.city}-${idx}`}
                className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#090d16]/60 p-2.5 transition-all duration-300 hover:border-emerald-500/40 hover:bg-[#0c1220]"
              >
                {/* Background Progress Fill Bar */}
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent transition-all duration-500 group-hover:from-emerald-500/20"
                  style={{ width: `${barWidth}%` }}
                />

                <div className="relative flex items-center justify-between gap-3">
                  {/* Flag & Names */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xl select-none" role="img" aria-label={loc.country}>
                      {loc.flag || "🌐"}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="truncate text-xs font-bold text-slate-200 group-hover:text-white">
                          {loc.country}
                        </span>
                        {viewMode === "city" && (
                          <span className="flex items-center gap-1 rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                            {renderIcon(FaMapMarkerAlt, { className: "h-2.5 w-2.5 text-emerald-400" })}
                            {loc.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Visit metrics */}
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-white group-hover:text-emerald-300">
                      {loc.visits}
                      <span className="ml-1 text-[10px] text-slate-500 font-normal">hits</span>
                    </span>
                    <span className="w-11 text-right text-xs font-semibold text-emerald-400">
                      {loc.percentage}%
                    </span>
                  </div>
                </div>

                {/* Sub Micro-meter */}
                <div className="relative mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${loc.percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Summary */}
      <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[11px] text-slate-400">
        <span>Global reach across 10+ tech clusters</span>
        <span className="text-emerald-400 font-medium">Privacy-safe zone mapping</span>
      </div>
    </div>
  );
};
