import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  FaSave,
  FaCheckCircle,
  FaSpinner,
  FaCamera,
  FaUpload,
  FaUndo,
  FaVideo,
  FaEye,
  FaEyeSlash,
  FaPlay,
  FaCode,
  FaClock,
  FaMapMarkerAlt,
  FaCrosshairs,
  FaCheck,
  FaExternalLinkAlt,
  FaTimes,
} from "react-icons/fa";
import {
  calculateWorkStatus,
  getVideoEmbedUrl,
} from "../../../lib/portfolioService";
import { PORTFOLIO_INFO } from "../../../data/portfolioData";
import { toProxyImageUrl } from "../../../data/projectsData";
import { renderIcon, getFeatureList } from "../types";
import { StorageRlsBanner } from "../StorageRlsBanner";

interface ProfileTabProps {
  profileForm: any;
  setProfileForm: React.Dispatch<React.SetStateAction<any>>;
  handleFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    destination: "profile" | "resume" | "project"
  ) => Promise<void>;
  profileImageUploading: boolean;
  profileSaving: boolean;
  profileMessage: string;
  uploadStatus: string;
  storageRlsError: string | null;
  setStorageRlsError: (err: string | null) => void;
  handleSaveProfile: (e: React.FormEvent) => Promise<void>;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  profileForm,
  setProfileForm,
  handleFileUpload,
  profileImageUploading,
  profileSaving,
  profileMessage,
  uploadStatus,
  storageRlsError,
  setStorageRlsError,
  handleSaveProfile,
}) => {
  const [adminVideoPreviewOpen, setAdminVideoPreviewOpen] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  // Quick Location Presets
  const LOCATION_PRESETS = [
    {
      label: "Rupnagar, Mirpur 2, Dhaka",
      shortLabel: "Rupnagar, Mirpur 2",
      tag: "My Home",
      isRecommended: true,
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Rupnagar,+Mirpur+2,+Dhaka,+Bangladesh",
    },
    {
      label: "Mirpur 2, Dhaka, Bangladesh",
      shortLabel: "Mirpur 2, Dhaka",
      tag: "Mirpur 2",
      isRecommended: false,
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Mirpur+2,+Dhaka,+Bangladesh",
    },
    {
      label: "Rupnagar R/A, Mirpur, Dhaka",
      shortLabel: "Rupnagar R/A",
      tag: "Rupnagar",
      isRecommended: false,
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Rupnagar+Residential+Area,+Mirpur,+Dhaka",
    },
    {
      label: "Mirpur, Dhaka, Bangladesh",
      shortLabel: "Mirpur, Dhaka",
      tag: "Mirpur",
      isRecommended: false,
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Mirpur,+Dhaka,+Bangladesh",
    },
    {
      label: "Dhaka, Bangladesh",
      shortLabel: "Dhaka",
      tag: "City",
      isRecommended: false,
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Dhaka,+Bangladesh",
    },
  ];

  const handleSelectLocationPreset = (preset: (typeof LOCATION_PRESETS)[0]) => {
    setProfileForm((prev: any) => ({
      ...prev,
      location: preset.label,
      maps_url: preset.mapsUrl,
    }));
    setLocationStatus(`Set location to "${preset.label}" with direct Google Maps link.`);
    setTimeout(() => setLocationStatus(null), 4000);
  };

  // Auto-detect GPS Current Location
  const handleDetectLocation = async () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation is not supported by your browser.");
      setTimeout(() => setLocationStatus(null), 4000);
      return;
    }

    setDetectingLocation(true);
    setLocationStatus("Getting GPS coordinates...");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setLocationStatus("Resolving address details...");

        let resolvedLocation = "";
        const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

        try {
          // OpenStreetMap Nominatim reverse geocode
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 6000);
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            {
              headers: { "Accept-Language": "en" },
              signal: controller.signal,
            }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const neighborhood =
              addr.suburb ||
              addr.neighbourhood ||
              addr.residential ||
              addr.subdistrict ||
              addr.quarter;
            const city =
              addr.city ||
              addr.town ||
              addr.municipality ||
              addr.county ||
              addr.state_district;
            const country = addr.country;

            const parts = [neighborhood, city, country].filter(Boolean);
            if (parts.length >= 2) {
              resolvedLocation = parts.join(", ");
            } else if (data.display_name) {
              resolvedLocation = data.display_name
                .split(",")
                .slice(0, 3)
                .map((s: string) => s.trim())
                .join(", ");
            }
          }
        } catch (e) {
          console.warn("Reverse geocoding error, applying fallback", e);
        }

        // Fallback if reverse geocode didn't return a name
        if (!resolvedLocation) {
          try {
            const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (tz && tz.includes("/")) {
              const [region, city] = tz.split("/");
              resolvedLocation = `${city.replace(/_/g, " ")}, ${region.replace(/_/g, " ")}`;
            } else {
              resolvedLocation = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
            }
          } catch (e) {
            resolvedLocation = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
          }
        }

        // Check if detected location is in Mirpur/Dhaka or near Borobag (Broadband/Wi-Fi gateway)
        const isNearMirpurOrBorobag =
          resolvedLocation.toLowerCase().includes("borobag") ||
          resolvedLocation.toLowerCase().includes("mirpur") ||
          (latitude > 23.75 && latitude < 23.85 && longitude > 90.33 && longitude < 90.4);

        setProfileForm((prev: any) => ({
          ...prev,
          location: resolvedLocation,
          maps_url: mapsLink,
        }));

        setDetectingLocation(false);
        if (isNearMirpurOrBorobag) {
          setLocationStatus(
            `GPS detected ISP hub (${resolvedLocation}). Wi-Fi/broadband often routes through Borobag. If you live in Rupnagar, Mirpur 2, click the preset below.`
          );
          setTimeout(() => setLocationStatus(null), 8000);
        } else {
          setLocationStatus(`Current location detected: ${resolvedLocation}`);
          setTimeout(() => setLocationStatus(null), 4500);
        }
      },
      (err) => {
        setDetectingLocation(false);
        let msg = "Could not get current location.";
        if (err.code === 1) {
          msg = "Location permission denied in browser.";
        } else if (err.code === 2) {
          msg = "GPS position unavailable.";
        } else if (err.code === 3) {
          msg = "Location request timed out.";
        }
        setLocationStatus(msg);
        setTimeout(() => setLocationStatus(null), 4500);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Profile &amp; Biography Settings
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Customize your avatar photo, professional headline, bio narrative, video controls, and contact channels
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveProfile}
          disabled={profileSaving}
          className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
        >
          {renderIcon(FaSave, { size: 12 })}
          <span>{profileSaving ? "Saving..." : "Save Profile Settings"}</span>
        </button>
      </div>

      {profileMessage && (
        <div className="p-3.5 text-xs text-emerald-300 border rounded-2xl bg-emerald-500/10 border-emerald-500/30 flex items-center gap-2.5">
          {renderIcon(FaCheckCircle, { size: 15, className: "text-emerald-400 shrink-0" })}
          <span className="font-medium">{profileMessage}</span>
        </div>
      )}

      {uploadStatus && (
        <div className="p-3.5 text-xs text-cyan-300 border rounded-2xl bg-cyan-500/10 border-cyan-500/30 flex items-center gap-2.5">
          {renderIcon(FaSpinner, { size: 14, className: "animate-spin shrink-0" })}
          <span className="font-medium">{uploadStatus}</span>
        </div>
      )}

      <StorageRlsBanner
        storageRlsError={storageRlsError}
        onDismiss={() => setStorageRlsError(null)}
      />

      <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
        {/* Profile Photo & Avatar Upload Card */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {renderIcon(FaCamera, { size: 14, className: "text-indigo-400" })}
                <span>Profile Photo &amp; Avatar Studio</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Upload or customize your official avatar image shown across the entire portfolio (Hero, About, Navigation, Footer).
              </p>
            </div>
            {/* Source Status Pill */}
            <span className="self-start sm:self-auto px-3 py-1 text-[10px] font-mono font-semibold rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span>
                {profileForm.profile_image?.startsWith("data:")
                  ? "Local Data URL"
                  : profileForm.profile_image?.includes("supabase.co")
                  ? "Supabase Cloud Stored"
                  : profileForm.profile_image === PORTFOLIO_INFO.profileImage
                  ? "Default Portfolio Photo"
                  : "Custom Image URL"}
              </span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-5 rounded-2xl bg-[#0c101d] border border-white/[0.06]">
            {/* Left: Avatar Display Card with Glowing Gradient Ring */}
            <div className="relative group shrink-0">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl p-1 bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 shadow-xl shadow-indigo-500/15 relative overflow-hidden transition-transform duration-300 group-hover:scale-105">
                <img
                  src={toProxyImageUrl(profileForm.profile_image || PORTFOLIO_INFO.profileImage)}
                  alt="Profile Avatar"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/img.jpg";
                  }}
                  className="w-full h-full object-cover rounded-xl bg-slate-900"
                />
                <label
                  htmlFor="profile-photo-input"
                  className="absolute inset-1 rounded-xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 text-white cursor-pointer transition-opacity duration-200 backdrop-blur-xs"
                >
                  {renderIcon(FaCamera, { size: 20 })}
                  <span className="text-[10px] font-semibold tracking-wide">Upload Photo</span>
                </label>
              </div>
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 text-[9px] font-bold rounded-md bg-indigo-600 text-white shadow-md border border-indigo-400/30">
                1:1 Square
              </span>
            </div>

            {/* Right: Upload controls & Direct URL */}
            <div className="flex-1 w-full space-y-3.5">
              <div className="flex flex-wrap items-center gap-3">
                <label
                  htmlFor="profile-photo-input"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  {profileImageUploading ? (
                    <>
                      {renderIcon(FaSpinner, { className: "animate-spin", size: 12 })}
                      <span>Uploading to Cloud...</span>
                    </>
                  ) : (
                    <>
                      {renderIcon(FaUpload, { size: 12 })}
                      <span>Upload New Photo</span>
                    </>
                  )}
                </label>
                <input
                  id="profile-photo-input"
                  type="file"
                  accept="image/*"
                  disabled={profileImageUploading}
                  onChange={(e) => handleFileUpload(e, "profile")}
                  className="hidden"
                />

                {profileForm.profile_image !== PORTFOLIO_INFO.profileImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileForm((prev: any) => ({
                        ...prev,
                        profile_image: PORTFOLIO_INFO.profileImage,
                      }));
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer"
                  >
                    {renderIcon(FaUndo, { size: 11 })}
                    <span>Reset to Default Photo</span>
                  </button>
                )}
              </div>

              {/* Direct Image URL input */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-semibold text-slate-300">
                  Or enter Direct Image URL:
                </label>
                <input
                  type="text"
                  value={profileForm.profile_image || ""}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, profile_image: e.target.value })
                  }
                  placeholder="https://images.unsplash.com/... or upload directly from file above"
                  className="w-full px-3.5 py-2 text-xs text-white bg-[#090d16] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 font-mono transition-all"
                />
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Supports PNG, JPG, JPEG, WEBP, or GIF. Uploads directly to Supabase Storage bucket (
                <code className="text-cyan-300 font-mono">portfolio-assets/profile/</code>) with instantaneous local fallback.
              </p>
            </div>
          </div>
        </div>

        {/* Introduction Video & "Watch Intro" Button Controls */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {renderIcon(FaVideo, { size: 14, className: "text-cyan-400" })}
                <span>"Watch Intro" Video &amp; Visibility Controls</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Control whether the "Watch Intro" button appears in the About section, and provide your custom video link or ID.
              </p>
            </div>

            {/* Visibility Pill Badge */}
            <span
              className={`self-start sm:self-auto px-3 py-1 text-[10px] font-semibold rounded-full border flex items-center gap-1.5 transition-all ${
                profileForm.show_intro_video
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-slate-600/30 bg-slate-800/40 text-slate-400"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  profileForm.show_intro_video
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-slate-500"
                }`}
              />
              <span>
                {profileForm.show_intro_video
                  ? "Visible on Website"
                  : "Hidden from Website"}
              </span>
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#0c101d] border border-white/[0.06] space-y-5">
            {/* Toggle Control Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.08]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {renderIcon(profileForm.show_intro_video ? FaEye : FaEyeSlash, {
                    size: 13,
                    className: profileForm.show_intro_video ? "text-emerald-400" : "text-slate-400",
                  })}
                  <span className="text-xs font-bold text-white">
                    Show "Watch Intro" Button on Website
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  When turned <span className="text-emerald-400 font-semibold">ON</span>, visitors can click "Watch Intro" next to your resume in the About section. When turned <span className="text-rose-400 font-semibold">OFF</span>, it is completely hidden.
                </p>
              </div>

              {/* Interactive Toggle Switch */}
              <button
                type="button"
                onClick={() =>
                  setProfileForm((prev: any) => ({
                    ...prev,
                    show_intro_video: !prev.show_intro_video,
                  }))
                }
                className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  profileForm.show_intro_video
                    ? "bg-gradient-to-r from-indigo-600 to-cyan-500 shadow-md shadow-indigo-500/20"
                    : "bg-slate-800"
                }`}
                aria-label="Toggle Watch Intro visibility"
              >
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    profileForm.show_intro_video ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Video URL or ID Input */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-slate-300">
                Introduction Video Link or ID:
              </label>
              <div className="flex flex-col sm:flex-row gap-2.5">
                <input
                  type="text"
                  value={profileForm.intro_video_url}
                  onChange={(e) =>
                    setProfileForm({
                      ...profileForm,
                      intro_video_url: e.target.value,
                    })
                  }
                  placeholder="e.g. https://drive.google.com/file/d/1BzSWgFEBgruUq-3wkTWfEiip3Rzxr-Pm/view or YouTube URL"
                  className="flex-1 px-3.5 py-2.5 text-xs text-white bg-[#090d16] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 font-mono transition-all"
                />

                {profileForm.intro_video_url && (
                  <button
                    type="button"
                    onClick={() => setAdminVideoPreviewOpen(true)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white rounded-xl bg-indigo-600/80 hover:bg-indigo-500 border border-indigo-400/30 transition-all cursor-pointer shrink-0 active:scale-95"
                  >
                    {renderIcon(FaPlay, { size: 10 })}
                    <span>Preview Video</span>
                  </button>
                )}

                {profileForm.intro_video_url !== PORTFOLIO_INFO.introVideoUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      setProfileForm((prev: any) => ({
                        ...prev,
                        intro_video_url: PORTFOLIO_INFO.introVideoUrl || PORTFOLIO_INFO.introVideoId,
                      }))
                    }
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer shrink-0"
                    title="Reset to default intro video"
                  >
                    {renderIcon(FaUndo, { size: 10 })}
                    <span>Reset Default</span>
                  </button>
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Supports <span className="text-cyan-300">Google Drive share links</span>,{" "}
                <span className="text-cyan-300">YouTube URLs</span> (watch or shorts),{" "}
                <span className="text-cyan-300">Loom videos</span>, direct MP4 video URLs, or Google Drive File IDs.
              </p>
            </div>
          </div>
        </div>

        {/* Hero Animated Headline & Typewriter Studio */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-4 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Hero Typewriter Headline Studio</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                  {renderIcon(FaCode, { size: 9 })}
                  100% Dynamic
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Customize the animated typing headline rendered on your Hero section. No static text — control the intro prefix and all cycling phrases.
              </p>
            </div>

            {/* Reset to Default Headlines Button */}
            <button
              type="button"
              onClick={() =>
                setProfileForm((prev: any) => ({
                  ...prev,
                  typewriter_prefix: PORTFOLIO_INFO.typewriterPrefix,
                  typewriter_phrases: PORTFOLIO_INFO.typewriterPhrases.join("\n"),
                }))
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-xl transition-all cursor-pointer"
              title="Reset headline and phrases to default"
            >
              {renderIcon(FaUndo, { size: 10 })}
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column: Prefix and Phrases Input */}
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                  Headline Prefix (Intro Word / Phrase)
                </label>
                <input
                  type="text"
                  value={profileForm.typewriter_prefix}
                  onChange={(e) => setProfileForm({ ...profileForm, typewriter_prefix: e.target.value })}
                  placeholder="e.g. I engineer, I build, Specialist in"
                  className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 font-medium"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Appears static right before the animated typewriter text.
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                    Animated Roles / Phrases
                  </label>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    {getFeatureList(profileForm.typewriter_phrases).length} Phrases Active
                  </span>
                </div>
                <textarea
                  rows={5}
                  value={profileForm.typewriter_phrases}
                  onChange={(e) => setProfileForm({ ...profileForm, typewriter_phrases: e.target.value })}
                  placeholder="1 phrase per line...&#10;Scalable Full-Stack Web Apps&#10;Cross-Platform Mobile Experiences&#10;High-Throughput REST & GraphQL APIs"
                  className="w-full px-3.5 py-2.5 text-xs font-mono text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 placeholder:text-slate-600 leading-relaxed resize-y"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter 1 phrase per line. Each will type smoothly, pause for 2.4s, and loop continuously.
                </p>
              </div>
            </div>

            {/* Right Column: Real-time Live Animation Preview */}
            <div className="flex flex-col">
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Live Animation Preview (Real-Time)
              </label>
              <div className="flex-1 min-h-[160px] p-4 rounded-xl border border-white/10 bg-[#090d16] flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Interactive Preview</span>
                </div>

                <div className="space-y-1.5 text-left">
                  <p className="font-mono text-[11px] text-slate-400 tracking-wider">
                    &lt;Hero Headline /&gt;
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-base sm:text-lg font-medium text-slate-400">
                    {profileForm.typewriter_prefix && (
                      <span className="text-white/80 font-normal">
                        {profileForm.typewriter_prefix}
                      </span>
                    )}
                    <div className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                      {(() => {
                        const phrases = getFeatureList(profileForm.typewriter_phrases);
                        if (phrases.length === 0) {
                          return <span className="text-slate-600 italic">No phrases specified</span>;
                        }
                        const seq: (string | number)[] = [];
                        phrases.forEach((p: string) => {
                          seq.push(p, 2000);
                        });
                        return (
                          <TypeAnimation
                            key={phrases.join("|")}
                            sequence={seq}
                            wrapper="span"
                            speed={50}
                            repeat={Infinity}
                          />
                        );
                      })()}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between text-[11px] text-slate-400">
                  <span>Typing Speed: ~45ms</span>
                  <span>Cycle Delay: 2.4s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Personal Info */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-4 shadow-xl">
          <div className="pb-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white">Personal Identity</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Your official name, professional tagline, and narrative biography
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Display Short Name
              </label>
              <input
                type="text"
                value={profileForm.short_name}
                onChange={(e) => setProfileForm({ ...profileForm, short_name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
              Professional Title / Role
            </label>
            <input
              type="text"
              value={profileForm.title}
              onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                Hero Subtitle Tagline (Hero Section Under Name)
              </label>
              <span className="text-[10px] text-indigo-400/90 font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                Live Dynamic Hero Subtitle
              </span>
            </div>
            <textarea
              rows={3}
              value={profileForm.tagline}
              onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
              placeholder="e.g. Software Engineering student at BUBT. I bridge architectural discipline with human-centered product design to build scalable digital systems."
              className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 leading-relaxed placeholder:text-slate-600 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Controls the introductory statement beneath your name in the Hero section without any static fallback text.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                About Me Story Narrative (About Section)
              </label>
              <span className="text-[10px] text-purple-400/90 font-medium px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                About Section Narrative
              </span>
            </div>
            <textarea
              rows={4}
              value={profileForm.bio}
              onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
              placeholder="e.g. Passionate Software Engineering student at BUBT. I bridge technical rigor with modern user experience..."
              className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 leading-relaxed"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Controls the personal story paragraph displayed in the About Me section of the portfolio.
            </p>
          </div>

          {/* About Section Stats & Highlight Badges (Admin Controlled) */}
          <div className="p-4 sm:p-5 rounded-2xl border border-white/[0.08] bg-[#0c101d]/60 space-y-4 shadow-lg">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                    About Section Stats &amp; Highlights Badges
                  </h4>
                  <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    Live Badges
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure the 4 stat counters and highlight badges displayed directly below your About narrative
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Stat 1 */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">Badge #1</span>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium mb-1">Value (e.g. 2+ Years)</label>
                  <input
                    type="text"
                    value={profileForm.about_stat1_val}
                    onChange={(e) => setProfileForm({ ...profileForm, about_stat1_val: e.target.value })}
                    placeholder="2+ Years"
                    className="w-full px-3 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-purple-400 font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium mb-1">Label (e.g. Project Experience)</label>
                  <input
                    type="text"
                    value={profileForm.about_stat1_lbl}
                    onChange={(e) => setProfileForm({ ...profileForm, about_stat1_lbl: e.target.value })}
                    placeholder="Project Experience"
                    className="w-full px-3 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <span className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">Badge #2</span>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium mb-1">Value (e.g. 15+)</label>
                  <input
                    type="text"
                    value={profileForm.about_stat2_val}
                    onChange={(e) => setProfileForm({ ...profileForm, about_stat2_val: e.target.value })}
                    placeholder="15+"
                    className="w-full px-3 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-pink-400 font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium mb-1">Label (e.g. Projects)</label>
                  <input
                    type="text"
                    value={profileForm.about_stat2_lbl}
                    onChange={(e) => setProfileForm({ ...profileForm, about_stat2_lbl: e.target.value })}
                    placeholder="Projects"
                    className="w-full px-3 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Badge #3</span>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium mb-1">Value (e.g. 10+)</label>
                  <input
                    type="text"
                    value={profileForm.about_stat3_val}
                    onChange={(e) => setProfileForm({ ...profileForm, about_stat3_val: e.target.value })}
                    placeholder="10+"
                    className="w-full px-3 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400 font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium mb-1">Label (e.g. Technologies)</label>
                  <input
                    type="text"
                    value={profileForm.about_stat3_lbl}
                    onChange={(e) => setProfileForm({ ...profileForm, about_stat3_lbl: e.target.value })}
                    placeholder="Technologies"
                    className="w-full px-3 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">Badge #4</span>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium mb-1">Value (e.g. CSE)</label>
                  <input
                    type="text"
                    value={profileForm.about_stat4_val}
                    onChange={(e) => setProfileForm({ ...profileForm, about_stat4_val: e.target.value })}
                    placeholder="CSE"
                    className="w-full px-3 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-amber-400 font-semibold font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 font-medium mb-1">Label (e.g. Academic Background)</label>
                  <input
                    type="text"
                    value={profileForm.about_stat4_lbl}
                    onChange={(e) => setProfileForm({ ...profileForm, about_stat4_lbl: e.target.value })}
                    placeholder="Academic Background"
                    className="w-full px-3 py-1.5 text-xs text-white bg-[#0c101d] border border-white/10 rounded-lg focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                Footer Brand Narrative / Short Bio (Footer Section)
              </label>
              <span className="text-[10px] text-cyan-400/90 font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                Footer Section Narrative
              </span>
            </div>
            <textarea
              rows={3}
              value={profileForm.footer_bio}
              onChange={(e) => setProfileForm({ ...profileForm, footer_bio: e.target.value })}
              placeholder="e.g. Full-Stack Software Engineer & Mobile Developer dedicated to creating scalable, resilient digital experiences with thoughtful design."
              className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 leading-relaxed placeholder:text-slate-600 transition-all"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Controls the brief summary narrative displayed under your profile avatar and name in the website Footer.
            </p>
          </div>
        </div>

        {/* Live Work Schedule & Radial Status Studio */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-5 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {renderIcon(FaClock, { size: 14, className: "text-emerald-400" })}
                <span>Live Work Schedule &amp; Radial Status Studio</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Configure your shift hours and timezone. When active, a glowing green radial light blinks beside your name in the Navbar; outside hours, it automatically turns to a blinking red light.
              </p>
            </div>

            {/* Enable Toggle Switch */}
            <label className="inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto px-3 py-1.5 rounded-xl bg-[#0c101d] border border-white/10 hover:border-white/20 transition-all">
              <input
                type="checkbox"
                checked={profileForm.work_hours_enabled}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, work_hours_enabled: e.target.checked })
                }
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
              />
              <span className="text-xs font-semibold text-slate-200">
                {profileForm.work_hours_enabled ? "Status Light Enabled" : "Status Light Disabled"}
              </span>
            </label>
          </div>

          {/* Interactive Live Status Preview Box */}
          {(() => {
            const preview = calculateWorkStatus({
              enabled: profileForm.work_hours_enabled,
              mode: profileForm.work_hours_mode as any,
              startTime: profileForm.work_start_time,
              endTime: profileForm.work_end_time,
              timezone: profileForm.work_timezone,
              onlineLabel: profileForm.work_online_label,
              offlineLabel: profileForm.work_offline_label,
            });

            return (
              <div className="p-4 rounded-2xl bg-[#0c101d] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Live Navbar Simulation
                  </span>
                  <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.03] border border-white/10 w-fit">
                    <div className="w-7 h-7 rounded-lg overflow-hidden border border-white/20 shrink-0">
                      <img
                        src={toProxyImageUrl(profileForm.profile_image || PORTFOLIO_INFO.profileImage)}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">
                        {profileForm.short_name || profileForm.name || "Maharab"}
                      </span>
                      {profileForm.work_hours_enabled && (
                        <div className="relative flex items-center justify-center shrink-0">
                          <span
                            className={`animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full opacity-75 ${
                              preview.isOnline ? "bg-emerald-400" : "bg-rose-500"
                            }`}
                          />
                          <span
                            className={`relative inline-flex rounded-full h-2 w-2 ${
                              preview.isOnline
                                ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                                : "bg-rose-500 shadow-[0_0_8px_#f43f5e]"
                            }`}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Diagnostics */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div
                    className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
                      preview.isOnline
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        preview.isOnline ? "bg-emerald-400 animate-pulse" : "bg-rose-400 animate-pulse"
                      }`}
                    />
                    <span>{preview.isOnline ? "🟢 CURRENT STATUS: ONLINE" : "🔴 CURRENT STATUS: OFFLINE"}</span>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400">
                    <span>Timezone: </span>
                    <span className="text-slate-200 font-semibold">{profileForm.work_timezone}</span>
                    {preview.timeString && (
                      <span className="ml-1 text-cyan-400 font-bold">({preview.timeString})</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
              Status Calculation Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setProfileForm({ ...profileForm, work_hours_mode: "auto" })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  profileForm.work_hours_mode === "auto"
                    ? "bg-indigo-600/20 border-indigo-500/50 text-white shadow-lg shadow-indigo-500/10"
                    : "bg-[#0c101d] border-white/10 text-slate-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white">Auto (Schedule-Based)</span>
                  {profileForm.work_hours_mode === "auto" && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Switches automatically between Green &amp; Red based on your shift hours &amp; timezone.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setProfileForm({ ...profileForm, work_hours_mode: "online" })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  profileForm.work_hours_mode === "online"
                    ? "bg-emerald-600/20 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10"
                    : "bg-[#0c101d] border-white/10 text-slate-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Always Online
                  </span>
                  {profileForm.work_hours_mode === "online" && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Manual override: Always displays glowing Green radial light.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setProfileForm({ ...profileForm, work_hours_mode: "offline" })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  profileForm.work_hours_mode === "offline"
                    ? "bg-rose-600/20 border-rose-500/50 text-white shadow-lg shadow-rose-500/10"
                    : "bg-[#0c101d] border-white/10 text-slate-400 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Always Offline
                  </span>
                  {profileForm.work_hours_mode === "offline" && (
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                  )}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Manual override: Always displays glowing Red radial light (e.g. vacation).
                </p>
              </button>
            </div>
          </div>

          {/* Shift Hours & Timezone Configuration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Shift Start Time
              </label>
              <input
                type="time"
                value={profileForm.work_start_time}
                onChange={(e) => setProfileForm({ ...profileForm, work_start_time: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">When green light begins</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Shift End Time
              </label>
              <input
                type="time"
                value={profileForm.work_end_time}
                onChange={(e) => setProfileForm({ ...profileForm, work_end_time: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400 font-mono"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">When red light begins</span>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Timezone
              </label>
              <select
                value={profileForm.work_timezone}
                onChange={(e) => setProfileForm({ ...profileForm, work_timezone: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
              >
                <option value="Asia/Dhaka">🇧🇩 Bangladesh Time (Asia/Dhaka — GMT+6)</option>
                <option value="America/New_York">🇺🇸 US Eastern (New York — GMT-4)</option>
                <option value="America/Los_Angeles">🇺🇸 US Pacific (Los Angeles — GMT-7)</option>
                <option value="Europe/London">🇬🇧 UK Time (London — GMT+1)</option>
                <option value="Asia/Dubai">🇦🇪 Gulf Time (Dubai — GMT+4)</option>
                <option value="Asia/Kolkata">🇮🇳 India Time (Kolkata — GMT+5:30)</option>
                <option value="Asia/Singapore">🇸🇬 Singapore Time (GMT+8)</option>
                <option value="Europe/Berlin">🇩🇪 Central Europe (Berlin — GMT+2)</option>
                <option value="UTC">🌐 UTC (Universal Coordinated Time)</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">Target reference timezone</span>
            </div>
          </div>

          {/* Status Tooltip / Badge Labels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Online Status Label
              </label>
              <input
                type="text"
                value={profileForm.work_online_label}
                onChange={(e) => setProfileForm({ ...profileForm, work_online_label: e.target.value })}
                placeholder="Available for Work"
                className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Offline Status Label
              </label>
              <input
                type="text"
                value={profileForm.work_offline_label}
                onChange={(e) => setProfileForm({ ...profileForm, work_offline_label: e.target.value })}
                placeholder="Currently Away / Offline"
                className="w-full px-3.5 py-2.5 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-rose-400"
              />
            </div>
          </div>
        </div>

        {/* Metrics & Experience Counters */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-4 shadow-xl">
          <div className="pb-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white">Display Statistics</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Quantifiable counters rendered on the home page</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Years Experience
              </label>
              <input
                type="text"
                value={profileForm.years_experience}
                onChange={(e) => setProfileForm({ ...profileForm, years_experience: e.target.value })}
                className="w-full px-3.5 py-2 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Projects Completed
              </label>
              <input
                type="text"
                value={profileForm.projects_completed}
                onChange={(e) => setProfileForm({ ...profileForm, projects_completed: e.target.value })}
                className="w-full px-3.5 py-2 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Satisfaction / Quality
              </label>
              <input
                type="text"
                value={profileForm.satisfaction_rate}
                onChange={(e) => setProfileForm({ ...profileForm, satisfaction_rate: e.target.value })}
                className="w-full px-3.5 py-2 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>
        </div>

        {/* Contact Info & Socials */}
        <div className="p-6 rounded-2xl border border-white/[0.08] bg-[#111726]/75 space-y-4 shadow-xl">
          <div className="pb-3 border-b border-white/[0.06]">
            <h3 className="text-sm font-bold text-white">Contact &amp; Social Links</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Reach channels and external developer profiles</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="text"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">Phone</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                  Current Location
                </label>
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detectingLocation}
                  className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 px-2 py-0.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                  title="Click to auto-detect current location via GPS"
                >
                  {detectingLocation ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      <span>Detecting GPS...</span>
                    </>
                  ) : (
                    <>
                      {renderIcon(FaMapMarkerAlt, { size: 10 })}
                      <span>Auto Detect</span>
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={profileForm.location}
                  onChange={(e) => {
                    const val = e.target.value;
                    setProfileForm((prev: any) => ({
                      ...prev,
                      location: val,
                      maps_url:
                        !prev.maps_url ||
                        prev.maps_url.includes("google.com/maps/search/?api=1&query=")
                          ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(val)}`
                          : prev.maps_url,
                    }));
                  }}
                  onClick={() => {
                    if (!profileForm.location.trim() && !detectingLocation) {
                      handleDetectLocation();
                    }
                  }}
                  placeholder="e.g. Rupnagar, Mirpur 2, Dhaka"
                  className="w-full pl-3.5 pr-10 py-2 text-sm text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 hover:border-cyan-500/40 transition-colors"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDetectLocation();
                  }}
                  disabled={detectingLocation}
                  title="Click to auto-detect GPS location"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  {renderIcon(FaCrosshairs, {
                    size: 14,
                    className: detectingLocation ? "animate-spin text-cyan-400" : "text-cyan-400",
                  })}
                </button>
              </div>

              {/* Quick Location Presets */}
              <div className="mt-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Quick Presets (1-Click Apply)
                  </span>
                  <span className="text-[10px] text-amber-400/90 font-medium">
                    💡 Wi-Fi/ISP GPS may approximate to Borobag
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {LOCATION_PRESETS.map((preset) => {
                    const isSelected =
                      profileForm.location.trim().toLowerCase() === preset.label.toLowerCase();
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleSelectLocationPreset(preset)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/20"
                            : preset.isRecommended
                            ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-white/[0.04] text-slate-300 border border-white/10 hover:bg-white/[0.08] hover:text-white"
                        }`}
                      >
                        {preset.isRecommended ? (
                          <span className="text-emerald-400 font-bold text-xs">⭐</span>
                        ) : (
                          renderIcon(FaMapMarkerAlt, {
                            size: 9,
                            className: isSelected ? "text-cyan-400" : "text-slate-400",
                          })
                        )}
                        <span>{preset.label}</span>
                        {preset.tag && (
                          <span className="ml-0.5 text-[9px] px-1 py-0.2 bg-emerald-500/25 text-emerald-300 rounded font-bold uppercase tracking-wider">
                            {preset.tag}
                          </span>
                        )}
                        {isSelected && (
                          renderIcon(FaCheck, { size: 9, className: "text-cyan-400 ml-0.5" })
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status / Alert */}
              {locationStatus && (
                <div
                  className={`mt-2 p-2.5 rounded-xl border text-xs font-medium transition-all flex items-center justify-between gap-3 ${
                    locationStatus.includes("ISP") || locationStatus.includes("Borobag")
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                      : locationStatus.includes("detected") || locationStatus.includes("Set location")
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                      : locationStatus.includes("denied") || locationStatus.includes("timed out")
                      ? "bg-rose-500/10 border-rose-500/20 text-rose-300"
                      : "bg-cyan-500/10 border-cyan-500/20 text-cyan-300"
                  }`}
                >
                  <span className="leading-relaxed">{locationStatus}</span>
                  {(locationStatus.includes("ISP") || locationStatus.includes("Borobag")) && (
                    <button
                      type="button"
                      onClick={() => handleSelectLocationPreset(LOCATION_PRESETS[0])}
                      className="px-2.5 py-1 bg-emerald-500/25 hover:bg-emerald-500/35 text-emerald-200 border border-emerald-500/40 rounded-lg text-xs font-bold shrink-0 transition-colors cursor-pointer"
                    >
                      ⭐ Set Rupnagar, Mirpur 2
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider">
                Google Maps URL (Auto-Generated)
              </label>
              {profileForm.maps_url && (
                <a
                  href={profileForm.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors cursor-pointer"
                  title="Click to preview this pin on Google Maps in a new tab"
                >
                  {renderIcon(FaExternalLinkAlt, { size: 9 })}
                  <span>Preview Pin on Map</span>
                </a>
              )}
            </div>
            <input
              type="text"
              value={profileForm.maps_url}
              onChange={(e) => setProfileForm({ ...profileForm, maps_url: e.target.value })}
              placeholder="e.g. https://www.google.com/maps/search/?api=1&query=Rupnagar,+Mirpur+2,+Dhaka"
              className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              When visitors click Location in your portfolio, this exact Google Maps link opens in a new tab.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                GitHub Profile URL
              </label>
              <input
                type="text"
                value={profileForm.github}
                onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="text"
                value={profileForm.linkedin}
                onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 text-[11px] uppercase tracking-wider mb-1.5">
                Twitter / X URL
              </label>
              <input
                type="text"
                value={profileForm.twitter}
                onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })}
                className="w-full px-3.5 py-2 text-xs text-white bg-[#0c101d] border border-white/10 rounded-xl focus:outline-none focus:border-indigo-400"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={profileSaving}
            className="px-8 py-3 text-xs font-semibold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-500/25 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {profileSaving ? "Saving..." : "Save All Profile Settings"}
          </button>
        </div>
      </form>

      {/* Admin Intro Video Test Modal */}
      <AnimatePresence>
        {adminVideoPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setAdminVideoPreviewOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl p-3 border shadow-2xl rounded-2xl bg-[#111726] border-white/15 backdrop-blur-xl space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2">
                  {renderIcon(FaPlay, { size: 12, className: "text-indigo-400" })}
                  <h4 className="text-xs font-bold text-white">Introduction Video Test Preview</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setAdminVideoPreviewOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {renderIcon(FaTimes, { size: 14 })}
                </button>
              </div>

              <div className="relative overflow-hidden rounded-xl aspect-video bg-black">
                <iframe
                  src={getVideoEmbedUrl(profileForm.intro_video_url)}
                  title="Admin Preview Video"
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ProfileTab;
