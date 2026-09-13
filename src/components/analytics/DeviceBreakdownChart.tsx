import React from "react";
import {
  FaDesktop,
  FaMobileAlt,
  FaTabletAlt,
  FaLaptopCode,
  FaApple,
  FaWindows,
  FaLinux,
  FaAndroid,
} from "react-icons/fa";
import { DeviceStat, OsStat } from "../../lib/analyticsService";

interface DeviceBreakdownChartProps {
  deviceBreakdown: DeviceStat[];
  osBreakdown: OsStat[];
}

const renderIcon = (Icon: any, props: any = {}) => {
  const Comp: any = Icon;
  return <Comp {...props} />;
};

export const DeviceBreakdownChart: React.FC<DeviceBreakdownChartProps> = ({
  deviceBreakdown,
  osBreakdown,
}) => {
  // Helper to pick device icon
  const getDeviceIcon = (device: "Desktop" | "Mobile" | "Tablet") => {
    switch (device) {
      case "Desktop":
        return renderIcon(FaDesktop, { className: "h-5 w-5" });
      case "Mobile":
        return renderIcon(FaMobileAlt, { className: "h-5 w-5" });
      case "Tablet":
        return renderIcon(FaTabletAlt, { className: "h-5 w-5" });
      default:
        return renderIcon(FaLaptopCode, { className: "h-5 w-5" });
    }
  };

  const getDeviceGradient = (device: "Desktop" | "Mobile" | "Tablet") => {
    switch (device) {
      case "Desktop":
        return "from-blue-500 to-cyan-400 border-cyan-500/40 text-cyan-400";
      case "Mobile":
        return "from-amber-500 to-rose-400 border-amber-500/40 text-amber-400";
      case "Tablet":
        return "from-emerald-500 to-teal-400 border-teal-500/40 text-teal-400";
      default:
        return "from-purple-500 to-indigo-400 border-purple-500/40 text-purple-400";
    }
  };

  const getOsIcon = (os: string) => {
    const lower = os.toLowerCase();
    if (lower.includes("mac") || lower.includes("ios")) return renderIcon(FaApple, { className: "h-3 w-3 text-slate-300" });
    if (lower.includes("win")) return renderIcon(FaWindows, { className: "h-3 w-3 text-cyan-400" });
    if (lower.includes("linux")) return renderIcon(FaLinux, { className: "h-3 w-3 text-amber-400" });
    if (lower.includes("android")) return renderIcon(FaAndroid, { className: "h-3 w-3 text-emerald-400" });
    return renderIcon(FaLaptopCode, { className: "h-3 w-3 text-slate-400" });
  };

  return (
    <div className="relative flex flex-col justify-between rounded-2xl border border-blue-500/20 bg-gradient-to-b from-[#111726]/90 via-[#0e1422]/90 to-[#090d16] p-5 shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
            {renderIcon(FaLaptopCode, { className: "h-5 w-5" })}
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">Hardware & OS Matrix</h3>
            <p className="text-xs text-slate-400">Device profiles and runtime environments</p>
          </div>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="my-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {deviceBreakdown.map((item) => {
          const colors = getDeviceGradient(item.device);

          return (
            <div
              key={item.device}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-[#090d16]/80 p-4 transition-all duration-300 hover:border-white/20 hover:bg-[#0c1220]"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border ${colors}`}
                >
                  {getDeviceIcon(item.device)}
                </div>
                <span className="text-sm font-bold font-mono text-white group-hover:scale-105 transition-transform">
                  {item.percentage}%
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-semibold text-slate-300">{item.device}</h4>
                <p className="text-[11px] text-slate-500 font-mono">{item.count} sessions</p>
              </div>

              {/* Progress Bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${colors}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* OS Distribution Chips */}
      <div className="border-t border-white/5 pt-4">
        <div className="mb-2.5 flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">Operating Systems</span>
          <span className="text-[11px] text-slate-500 font-mono">Platform Distribution</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {osBreakdown.map((os) => (
            <div
              key={os.os}
              className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#090d16]/70 px-2.5 py-1.5 transition-colors hover:border-white/25 hover:bg-[#0c1220]"
            >
              {getOsIcon(os.os)}
              <span className="text-xs font-medium text-slate-300">{os.os}</span>
              <span className="rounded bg-white/10 px-1.5 py-0.2 text-[10px] font-bold font-mono text-cyan-300">
                {os.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
