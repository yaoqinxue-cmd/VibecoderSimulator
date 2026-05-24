import type { Condition, GameState, StatKey } from "./types";

export function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function describeStat(value: number): string {
  if (value <= 20) return "失控";
  if (value <= 39) return "低";
  if (value <= 62) return "中";
  if (value <= 82) return "高";
  return "爆表";
}

export function matchCondition(
  condition: Condition,
  state: GameState,
): boolean {
  switch (condition.type) {
    case "hasFlag":
      return state.flags.includes(condition.flag);
    case "statGte":
      return state.stats[condition.stat] >= condition.value;
    case "statLte":
      return state.stats[condition.stat] <= condition.value;
    case "turnGte":
      return state.turn >= condition.value;
  }
}

export function applyDelta(value: number, delta = 0): number {
  return clampStat(value + delta);
}

export function statTone(
  stat: StatKey,
  value: number,
): "low" | "mid" | "high" | "danger" {
  if (stat === "stability" && value <= 32) return "danger";
  if (stat !== "stability" && value >= 84) return "danger";
  if (value <= 35) return "low";
  if (value >= 66) return "high";
  return "mid";
}
