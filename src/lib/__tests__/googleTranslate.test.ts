import {
  SUPPORTED_LANGUAGES,
  getCurrentLanguage,
  changeLanguage,
  applyGoogleTranslateReactSafeguard,
} from "../googleTranslate";

describe("googleTranslate engine", () => {
  beforeEach(() => {
    // Clear cookies and localStorage
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.clear();
  });

  test("SUPPORTED_LANGUAGES contains English, Bengali, and top international languages", () => {
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain("en");
    expect(codes).toContain("bn");
    expect(codes).toContain("ar");
    expect(codes).toContain("es");
    expect(codes).toContain("fr");
    expect(codes).toContain("de");
    expect(codes).toContain("hi");
    expect(codes).toContain("zh-CN");
    expect(codes).toContain("ja");
  });

  test("getCurrentLanguage defaults to en when no cookie or storage is set", () => {
    expect(getCurrentLanguage()).toBe("en");
  });

  test("getCurrentLanguage extracts target language from googtrans cookie", () => {
    document.cookie = "googtrans=/en/bn; path=/;";
    expect(getCurrentLanguage()).toBe("bn");

    document.cookie = "googtrans=/en/es; path=/;";
    expect(getCurrentLanguage()).toBe("es");
  });

  test("applyGoogleTranslateReactSafeguard patches Node removeChild and insertBefore safely", () => {
    applyGoogleTranslateReactSafeguard();
    expect((window as any).__gt_safeguard_installed).toBe(true);

    // Verify calling removeChild with mismatched parent does not throw
    const parent = document.createElement("div");
    const foreignChild = document.createElement("span");
    expect(() => {
      parent.removeChild(foreignChild);
    }).not.toThrow();
  });

  test("changeLanguage stores preferred language in localStorage", () => {
    changeLanguage("bn");
    expect(localStorage.getItem("preferred_language")).toBe("bn");
  });
});
