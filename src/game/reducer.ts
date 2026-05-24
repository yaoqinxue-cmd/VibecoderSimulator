import { createStartState } from "./engine";
import type { GameAction, GameState } from "./types";

export function gameReducer(
  state: GameState = createStartState(),
  action: GameAction,
): GameState {
  switch (action.type) {
    case "replace":
      return action.state;
    case "continue":
      return {
        ...state,
        screen: state.endingId ? "result" : "event",
        lastFeedback: undefined,
      };
    default:
      return state;
  }
}
