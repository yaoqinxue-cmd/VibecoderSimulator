import { describe, expect, it } from "vitest";
import { cards } from "../../src/content/cards";
import { endings } from "../../src/content/endings";
import {
  chooseOption,
  createInitialState,
  resolveEnding,
} from "../../src/game/engine";
import { gameReducer } from "../../src/game/reducer";

describe("game engine", () => {
  it("creates a playable initial state", () => {
    const state = createInitialState(cards, "test-seed");

    expect(state.screen).toBe("event");
    expect(state.phase).toBe("awakening");
    expect(state.currentCardId).toBe("awakening-first-night");
    expect(state.stats.momentum).toBe(50);
  });

  it("applies choice effects and creates feedback", () => {
    const state = createInitialState(cards, "test-seed");
    const nextState = chooseOption(cards, endings, state, "read-code");

    expect(nextState.screen).toBe("feedback");
    expect(nextState.stats.judgment).toBe(59);
    expect(nextState.flags).toContain("read-first-code");
    expect(nextState.lastFeedback?.line).toContain("final_final_reallyFinal");
  });

  it("continues from feedback into the next event", () => {
    const state = createInitialState(cards, "test-seed");
    const feedbackState = chooseOption(cards, endings, state, "read-code");
    const eventState = gameReducer(feedbackState, { type: "continue" });

    expect(eventState.screen).toBe("event");
    expect(eventState.lastFeedback).toBeUndefined();
  });

  it("can reach a result without deadlocking", () => {
    let state = createInitialState(cards, "deadlock-check");

    for (let index = 0; index < 15; index += 1) {
      const card = cards.find((item) => item.id === state.currentCardId);
      expect(card).toBeTruthy();
      state = chooseOption(cards, endings, state, card!.choices[0].id);
      state = gameReducer(state, { type: "continue" });
    }

    expect(state.screen).toBe("result");
    expect(resolveEnding(endings, state).label).toBeTruthy();
  });
});
