import type { Phase, StatKey } from "./types";

export const productName = "Vibe Coding 模拟器";

export const statLabels: Record<StatKey, string> = {
  momentum: "推进感",
  judgment: "判断力",
  agency: "主体性",
  stability: "稳定度",
};

export const phaseLabels: Record<Phase, string> = {
  awakening: "第一次开挂",
  response: "世界开始回应",
  identity: "你变成了谁",
};

export const statKeys: StatKey[] = [
  "momentum",
  "judgment",
  "agency",
  "stability",
];

export const initialStats: Record<StatKey, number> = {
  momentum: 50,
  judgment: 50,
  agency: 50,
  stability: 56,
};

export const maxTurns = 15;

export function phaseForTurn(turn: number): Phase {
  if (turn < 5) return "awakening";
  if (turn < 10) return "response";
  return "identity";
}
