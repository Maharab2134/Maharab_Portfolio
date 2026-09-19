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

describe("PortfolioChatbotEngine - Dynamic Project Matching & Clarification", () => {
  const defaultContext: ActiveContext = {
    view: "home",
    project: null,
    section: "hero",
  };

  test("matches 'nlp' to NLP Sentiment Analyzer and asks 'Apni ki eta khujchen naki onno kichu?'", () => {
    const res = PortfolioChatbotEngine.processQuery("nlp", defaultContext);
    expect(res.text).toContain("NLP Sentiment Analyzer");
    expect(res.text).toContain("Apni ki eta khujchen naki onno kichu?");
    expect(res.projectsList).toBeDefined();
    expect(res.projectsList?.length).toBe(1);
    expect(res.projectsList?.[0].id).toBe("sentiment-analyzer");
    expect(res.actions?.some((a) => a.label.includes("GitHub"))).toBe(true);
  });

  test("matches 'ami nlp likhe msg dichi' to NLP Sentiment Analyzer", () => {
    const res = PortfolioChatbotEngine.processQuery("ami nlp likhe msg dichi", defaultContext);
    expect(res.text).toContain("NLP Sentiment Analyzer");
    expect(res.text).toContain("Apni ki eta khujchen naki onno kichu?");
    expect(res.projectsList?.[0].id).toBe("sentiment-analyzer");
  });

  test("matches partial title 'sentiment' to NLP Sentiment Analyzer", () => {
    const res = PortfolioChatbotEngine.processQuery("sentiment", defaultContext);
    expect(res.text).toContain("NLP Sentiment Analyzer");
    expect(res.projectsList?.[0].id).toBe("sentiment-analyzer");
  });

  test("matches 'iot' to multiple IoT projects and prompts for clarification", () => {
    const res = PortfolioChatbotEngine.processQuery("iot", defaultContext);
    expect(res.text).toContain("Apni ki egulor moddhe konta khujchen naki onno kichu?");
    expect(res.projectsList).toBeDefined();
    expect(res.projectsList!.length).toBeGreaterThanOrEqual(2);
    const ids = res.projectsList!.map((p) => p.id);
    expect(ids).toContain("smart-home-iot");
    expect(ids).toContain("agricultural-monitoring");
  });

  test("matches 'purchify' to PurchifyShop", () => {
    const res = PortfolioChatbotEngine.processQuery("purchify", defaultContext);
    expect(res.text).toContain("PurchifyShop");
    expect(res.text).toContain("Apni ki eta khujchen naki onno kichu?");
    expect(res.projectsList?.[0].id).toBe("purchifyshop");
  });

  test("matches 'bachlife' to BachLife", () => {
    const res = PortfolioChatbotEngine.processQuery("bachlife", defaultContext);
    expect(res.text).toContain("BachLife");
    expect(res.text).toContain("Apni ki eta khujchen naki onno kichu?");
    expect(res.projectsList?.[0].id).toBe("bachlife");
  });

  test("matches 'lstm' to Predictive Time-Series Forecaster", () => {
    const res = PortfolioChatbotEngine.processQuery("lstm", defaultContext);
    expect(res.text).toContain("Predictive Time-Series Forecaster");
    expect(res.text).toContain("Apni ki eta khujchen naki onno kichu?");
    expect(res.projectsList?.[0].id).toBe("time-series-forecasting");
  });

  test("returns zero-hallucination fallback for completely unrelated query", () => {
    const res = PortfolioChatbotEngine.processQuery("what is the capital of France?", defaultContext);
    expect(res.text).toContain("I couldn't find that information in the portfolio.");
    expect(res.text).toContain("I only answer using verified content from this website");
    expect(res.projectsList).toBeUndefined();
  });
});

