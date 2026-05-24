import { initialStats, maxTurns, phaseForTurn } from "./constants";
import { applyDelta, matchCondition } from "./scoring";
import type { Card, Choice, Ending, GameState, Phase, StatKey } from "./types";

const statKeys: StatKey[] = ["momentum", "judgment", "agency", "stability"];

export function createStartState(): GameState {
  return {
    screen: "start",
    currentCardId: null,
    phase: "awakening",
    turn: 0,
    stats: { ...initialStats },
    flags: [],
    traces: [],
    history: [],
    visitedCardIds: [],
    seed: createSeed(),
  };
}

export function createInitialState(
  cards: Card[],
  seed = createSeed(),
): GameState {
  const firstCard =
    cards.find((card) => card.start) ??
    cards.find((card) => card.phase === "awakening");

  if (!firstCard) {
    throw new Error("At least one awakening card is required.");
  }

  return {
    screen: "event",
    currentCardId: firstCard.id,
    phase: firstCard.phase,
    turn: 0,
    stats: { ...initialStats },
    flags: [],
    traces: [],
    history: [],
    visitedCardIds: [firstCard.id],
    seed,
  };
}

export function getCurrentCard(cards: Card[], state: GameState): Card | null {
  if (!state.currentCardId) return null;
  return cards.find((card) => card.id === state.currentCardId) ?? null;
}

export function chooseOption(
  cards: Card[],
  endings: Ending[],
  state: GameState,
  choiceId: string,
): GameState {
  const card = getCurrentCard(cards, state);
  if (!card) return state;

  const choice = card.choices.find((item) => item.id === choiceId);
  if (!choice) return state;

  const stats = applyEffects(state.stats, choice);
  const flags = unique([...state.flags, ...(choice.addFlags ?? [])]);
  const traces = [...state.traces, ...(choice.addTraces ?? [])].slice(-8);
  const turn = state.turn + 1;
  const history = [...state.history, { cardId: card.id, choiceId: choice.id }];
  const nextPhase = phaseForTurn(turn);
  const baseState: GameState = {
    ...state,
    screen: "feedback",
    stats,
    flags,
    traces,
    turn,
    phase: nextPhase,
    history,
    lastFeedback: {
      cardTitle: card.title,
      line: choice.immediateLine,
      effects: choice.effects,
      tracesAdded: choice.addTraces ?? [],
    },
  };

  if (turn >= maxTurns) {
    const ending = resolveEnding(endings, baseState);
    return {
      ...baseState,
      currentCardId: null,
      endingId: ending.id,
    };
  }

  const nextCard = choice.nextCardId
    ? cards.find((item) => item.id === choice.nextCardId)
    : selectNextCard(cards, baseState, nextPhase);

  if (!nextCard) {
    const ending = resolveEnding(endings, baseState);
    return {
      ...baseState,
      currentCardId: null,
      endingId: ending.id,
    };
  }

  return {
    ...baseState,
    currentCardId: nextCard.id,
    visitedCardIds: unique([...state.visitedCardIds, nextCard.id]),
  };
}

export function getEnding(endings: Ending[], state: GameState): Ending | null {
  if (state.endingId) {
    return endings.find((ending) => ending.id === state.endingId) ?? null;
  }

  if (state.screen !== "result") return null;
  return resolveEnding(endings, state);
}

export function resolveEnding(endings: Ending[], state: GameState): Ending {
  const matched = endings
    .filter((ending) =>
      ending.conditions.every((condition) => matchCondition(condition, state)),
    )
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));

  return matched[0] ?? endings[0];
}

function selectNextCard(
  cards: Card[],
  state: GameState,
  phase: Phase,
): Card | null {
  const candidates = cards.filter((card) => {
    if (card.phase !== phase) return false;
    if (state.visitedCardIds.includes(card.id)) return false;
    return (card.conditions ?? []).every((condition) =>
      matchCondition(condition, state),
    );
  });

  const fallbackCandidates = candidates.length
    ? candidates
    : cards.filter(
        (card) =>
          card.phase === phase &&
          (card.conditions ?? []).every((condition) =>
            matchCondition(condition, state),
          ),
      );

  if (!fallbackCandidates.length) return null;

  const totalWeight = fallbackCandidates.reduce(
    (sum, card) => sum + (card.weight ?? 1),
    0,
  );
  let cursor =
    hashToNumber(`${state.seed}:${state.turn}:${phase}`) % totalWeight;

  for (const card of fallbackCandidates) {
    cursor -= card.weight ?? 1;
    if (cursor < 0) return card;
  }

  return fallbackCandidates[0];
}

function applyEffects(
  stats: GameState["stats"],
  choice: Choice,
): GameState["stats"] {
  return statKeys.reduce(
    (nextStats, key) => ({
      ...nextStats,
      [key]: applyDelta(stats[key], choice.effects[key]),
    }),
    {} as GameState["stats"],
  );
}

function createSeed(): string {
  return Math.random().toString(36).slice(2, 10);
}

function hashToNumber(input: string): number {
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = (hash * 31 + input.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}
