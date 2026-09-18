import React from "react";
import { FaCode } from "react-icons/fa";

export type AdminNavTab =
  | "overview"
  | "analytics"
  | "projects"
  | "skills"
  | "profile"
  | "education"
  | "resume"
  | "messages"
  | "reviews"
  | "setup";

export type ProjectViewMode = "list" | "editor";

export interface ProjectCategoryDef {
  id: string;
  name: string;
  desc: string;
  icon: any;
  badge: string;
  borderActive: string;
}

export interface TechSuggestion {
  name: string;
  category: "frontend" | "backend" | "db_cloud" | "ai_ml" | "mobile" | "iot" | "tools";
  popular?: boolean;
}

export interface StackPreset {
  name: string;
  desc: string;
  icon: any;
  techs: string[];
  badgeColor: string;
}

export interface PresetCover {
  name: string;
  url: string;
}

export interface AdminToast {
  message: string;
  type: "success" | "error";
}

export const renderIcon = (Icon: any, props: any = {}) => {
  return React.createElement(Icon || FaCode, props);
};

export const getFeatureList = (features: any): string[] => {
  if (!features) return [];
  if (Array.isArray(features)) {
    return features.map((f) => String(f).trim()).filter(Boolean);
  }
  if (typeof features === "string") {
    return features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);
  }
  return [];
};

export const getSelectedTechs = (techStr: any): string[] => {
  if (!techStr) return [];
  if (Array.isArray(techStr)) {
    return techStr.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof techStr === "string") {
    return techStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
};
