/**
 * Google Translate Real-Time Website Translation Engine
 *
 * Provides seamless, zero-manual-JSON real-time DOM translation
 * using the official Google Translate Website Widget.
 * Includes React DOM reconciliation safeguards to prevent removeChild crashes.
 */

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇧🇩" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "中文 (简体)", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "中文 (繁體)", flag: "🇹🇼" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "th", name: "Thai", nativeName: "ภาษาไทย", flag: "🇹🇭" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷" },
  { code: "tl", name: "Filipino", nativeName: "Tagalog", flag: "🇵🇭" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
];

/**
 * Installs prototype safeguards for Node.prototype.removeChild and insertBefore.
 * Google Translate wraps DOM text nodes with <font> tags. When React performs DOM
 * reconciliation on components that have been modified by Google Translate, it can
 * throw `NotFoundError: Failed to execute 'removeChild' on 'Node'`. This patch
 * catches and safely handles those mismatched parent node calls.
 */
export function applyGoogleTranslateReactSafeguard() {
  if (typeof window === "undefined" || (window as any).__gt_safeguard_installed) return;
  (window as any).__gt_safeguard_installed = true;

  // Intercept & swallow third-party Google Translate errors from triggering CRA overlay
  const isTranslationError = (msg?: string, filename?: string, stack?: string) => {
    const text = `${msg || ""} ${filename || ""} ${stack || ""}`.toLowerCase();
    return (
      text.includes("translate.googleapis.com") ||
      text.includes("translate.google.com") ||
      text.includes("translate_http") ||
      text.includes("ka`prod") ||
      text.includes("goog-te") ||
      text.includes("element.js")
    );
  };

  window.addEventListener(
    "error",
    (e: ErrorEvent) => {
      const msg = e.message || (e.error && e.error.message) || "";
      const filename = e.filename || "";
      const stack = (e.error && e.error.stack) || "";
      if (isTranslationError(msg, filename, stack)) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return true;
      }
    },
    true
  );

  window.addEventListener(
    "unhandledrejection",
    (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      const msg = String(reason || "");
      const stack = reason && reason.stack ? String(reason.stack) : "";
      if (isTranslationError(msg, "", stack)) {
        e.stopImmediatePropagation();
        e.preventDefault();
        return true;
      }
    },
    true
  );

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };

  const originalReplaceChild = Node.prototype.replaceChild;
  Node.prototype.replaceChild = function <T extends Node>(newChild: Node, oldChild: T): T {
    if (oldChild.parentNode !== this) {
      return oldChild;
    }
    return originalReplaceChild.call(this, newChild, oldChild) as T;
  };

  // Prevent Google Translate from shifting body top position by 40px
  if (typeof MutationObserver !== "undefined") {
    const observer = new MutationObserver(() => {
      if (document.body.style.top && document.body.style.top !== "0px") {
        document.body.style.top = "0px";
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
  }
}

/**
 * Retrieves the currently active language code from googtrans cookie or localStorage
 */
export function getCurrentLanguage(): string {
  if (typeof document === "undefined") return "en";
  try {
    const match = document.cookie.match(/(^|;)\s*googtrans=([^;]+)/);
    if (match) {
      const val = decodeURIComponent(match[2]);
      const parts = val.split("/");
      if (parts.length >= 3 && parts[2]) {
        return parts[2];
      }
    }
  } catch (err) {
    // Ignore cookie read error
  }
  return localStorage.getItem("preferred_language") || "en";
}

/**
 * Changes page language dynamically using the Google Translate Website Widget.
 */
export function changeLanguage(langCode: string) {
  if (typeof window === "undefined") return;

  const currentLang = getCurrentLanguage();
  if (currentLang === langCode && langCode !== "en") return;

  try {
    localStorage.setItem("preferred_language", langCode);
  } catch (e) {
    // Ignore storage quota error
  }

  const hostname = window.location.hostname;
  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  const domainPart = !isLocal && hostname.includes(".") ? `; domain=.${hostname}` : "";

  if (langCode === "en") {
    // Clear Google Translate cookie to reset to original English
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;${domainPart}`;
    document.cookie = `googtrans=/en/en; path=/;`;
    document.cookie = `googtrans=/en/en; path=/;${domainPart}`;

    const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
    if (select) {
      select.value = "";
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    // Clean reload ensures pristine original text without font tags
    if (typeof window !== "undefined" && typeof window.location?.reload === "function" && process.env.NODE_ENV !== "test") {
      window.location.reload();
    }
    return;
  }

  // Set translation cookie for Google Translate
  document.cookie = `googtrans=/en/${langCode}; path=/;`;
  document.cookie = `googtrans=/en/${langCode}; path=/;${domainPart}`;

  // Try to dispatch change directly on Google's combo select
  const select = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
  if (select) {
    select.value = langCode;
    select.dispatchEvent(new Event("change", { bubbles: true }));
    select.dispatchEvent(new Event("input", { bubbles: true }));
  } else {
    // If widget combo element is not ready yet, reloading will apply cookie immediately
    if (typeof window !== "undefined" && typeof window.location?.reload === "function" && process.env.NODE_ENV !== "test") {
      window.location.reload();
    }
  }
}

/**
 * Initializes Google Translate Script and mounting element
 */
export function initGoogleTranslateScript() {
  if (typeof window === "undefined") return;

  applyGoogleTranslateReactSafeguard();

  // Create mount element if it doesn't exist
  if (!document.getElementById("google_translate_element")) {
    const el = document.createElement("div");
    el.id = "google_translate_element";
    el.style.position = "absolute";
    el.style.left = "-9999px";
    el.style.top = "-9999px";
    el.style.width = "0";
    el.style.height = "0";
    el.style.overflow = "hidden";
    el.setAttribute("aria-hidden", "true");
    document.body.appendChild(el);
  }

  // Define Google Translate element initialization callback
  (window as any).googleTranslateElementInit = () => {
    if ((window as any).google && (window as any).google.translate) {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          layout: (window as any).google.translate?.TranslateElement?.InlineLayout?.SIMPLE || 0,
        },
        "google_translate_element"
      );
    }
  };

  // Inject Google Translate script if not yet loaded
  if (!document.getElementById("google-translate-script")) {
    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.type = "text/javascript";
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }
}
