import { PortfolioChatbotEngine } from "../chatbotService";
import { ActiveContext } from "../chatbotKnowledge";

describe("PortfolioChatbotEngine - Gratitude & Auto-Close Intent", () => {
  const defaultContext: ActiveContext = {
    view: "home",
    project: null,
    section: "hero",
  };

  test("returns autoCloseAfterSeconds: 20 for English thank you", () => {
    const queries = [
      "thank you",
      "thank you!",
      "thanks",
      "thanks a lot",
      "many thanks",
      "ty",
      "tysm",
      "thx",
    ];

    for (const q of queries) {
      const res = PortfolioChatbotEngine.processQuery(q, defaultContext);
      expect(res.contextTag).toBe("gratitude");
      expect(res.autoCloseAfterSeconds).toBe(20);
      expect(res.text).toContain("very welcome");
    }
  });

  test("returns autoCloseAfterSeconds: 20 for Bengali / Banglish gratitude", () => {
    const queries = [
      "dhonnobad",
      "onek dhonnobad",
      "dhonnobad apnake",
      "ধন্যবাদ",
      "থ্যাংকস",
      "থ্যাংক ইউ",
      "শুকরিয়া",
    ];

    for (const q of queries) {
      const res = PortfolioChatbotEngine.processQuery(q, defaultContext);
      expect(res.contextTag).toBe("gratitude");
      expect(res.autoCloseAfterSeconds).toBe(20);
    }
  });

  test("does NOT trigger auto-close for normal questions", () => {
    const normalQueries = [
      "what projects do you have?",
      "tell me about your flutter experience",
      "how to contact maharab",
      "show me skills",
    ];

    for (const q of normalQueries) {
      const res = PortfolioChatbotEngine.processQuery(q, defaultContext);
      expect(res.contextTag).not.toBe("gratitude");
      expect(res.autoCloseAfterSeconds).toBeUndefined();
    }
  });
});
