import { describe, expect, it } from "vitest";
import { cards } from "../../src/content/cards";
import { endings } from "../../src/content/endings";
import { statKeys } from "../../src/game/constants";

describe("content integrity", () => {
  it("has unique card ids and valid choices", () => {
    const ids = new Set(cards.map((card) => card.id));
    expect(ids.size).toBe(cards.length);

    for (const card of cards) {
      expect(card.choices.length).toBeGreaterThanOrEqual(2);
      expect(card.choices.length).toBeLessThanOrEqual(3);
      expect(card.body.length).toBeLessThanOrEqual(140);

      for (const choice of card.choices) {
        expect(choice.label.length).toBeLessThanOrEqual(24);
        expect(choice.immediateLine.length).toBeLessThanOrEqual(60);
        expect(Object.keys(choice.effects).length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps each phase stocked for the first playable slice", () => {
    expect(cards.length).toBeGreaterThanOrEqual(40);
    expect(
      cards.filter((card) => card.phase === "awakening").length,
    ).toBeGreaterThanOrEqual(10);
    expect(
      cards.filter((card) => card.phase === "response").length,
    ).toBeGreaterThanOrEqual(10);
    expect(
      cards.filter((card) => card.phase === "identity").length,
    ).toBeGreaterThanOrEqual(10);
  });

  it("has unique endings with complete result page data", () => {
    const ids = new Set(endings.map((ending) => ending.id));
    expect(ids.size).toBe(endings.length);

    for (const ending of endings) {
      expect(ending.label).toBeTruthy();
      expect(ending.shortNote).toBeTruthy();
      expect(ending.description).toBeTruthy();
      expect(ending.keyChoices.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("uses only known stat keys in ending conditions", () => {
    for (const ending of endings) {
      for (const condition of ending.conditions) {
        if (condition.type === "statGte" || condition.type === "statLte") {
          expect(statKeys).toContain(condition.stat);
        }
      }
    }
  });
});
