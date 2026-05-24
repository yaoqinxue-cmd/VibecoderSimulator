export type Phase = "awakening" | "response" | "identity";

export type StatKey = "momentum" | "judgment" | "agency" | "stability";

export type StatEffect = Partial<Record<StatKey, number>>;

export type Condition =
  | { type: "hasFlag"; flag: string }
  | { type: "statGte"; stat: StatKey; value: number }
  | { type: "statLte"; stat: StatKey; value: number }
  | { type: "turnGte"; value: number };

export type Trace = {
  type: "work" | "habit" | "relation" | "reputation" | "cost";
  text: string;
};

export type Choice = {
  id: string;
  label: string;
  effects: StatEffect;
  immediateLine: string;
  addFlags?: string[];
  addTraces?: Trace[];
  nextCardId?: string;
};

export type Card = {
  id: string;
  phase: Phase;
  title: string;
  body: string;
  choices: Choice[];
  conditions?: Condition[];
  weight?: number;
  start?: boolean;
};

export type Feedback = {
  cardTitle: string;
  line: string;
  effects: StatEffect;
  tracesAdded: Trace[];
};

export type GameScreen = "start" | "event" | "feedback" | "result";

export type GameState = {
  screen: GameScreen;
  currentCardId: string | null;
  phase: Phase;
  turn: number;
  stats: Record<StatKey, number>;
  flags: string[];
  traces: Trace[];
  history: Array<{
    cardId: string;
    choiceId: string;
  }>;
  visitedCardIds: string[];
  seed: string;
  lastFeedback?: Feedback;
  endingId?: string;
};

export type Ending = {
  id: string;
  label: string;
  shortNote: string;
  stateLine: string;
  description: string;
  keyChoices: string[];
  conditions: Condition[];
  priority?: number;
};

export type GameAction =
  | { type: "replace"; state: GameState }
  | { type: "continue" };
