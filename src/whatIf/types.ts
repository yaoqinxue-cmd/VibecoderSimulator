export type WhatIfInput = {
  situation: string;
  decision: string;
  optionA: string;
  optionB: string;
  goal: string;
  fear: string;
};

export type WhatIfBranch = {
  label: string;
  action: string;
  day7: string;
  day30: string;
  day90: string;
  hiddenCost: string;
  earlySignals: string[];
  playerState: string;
};

export type WhatIfResultCard = {
  label: string;
  note: string;
};

export type WhatIfBranchResult = {
  mode: "branches";
  title: string;
  realDecisionPoint: string;
  branches: WhatIfBranch[];
  warningSignals: string[];
  nextAction: string;
  resultCard: WhatIfResultCard;
};

export type WhatIfSafetyResult = {
  mode: "safety";
  title: string;
  realDecisionPoint: string;
  riskReason: string;
  prepList: {
    label: string;
    items: string[];
  }[];
  nextAction: string;
  resultCard: WhatIfResultCard;
};

export type WhatIfResult = WhatIfBranchResult | WhatIfSafetyResult;

export type WhatIfPreset = {
  id: string;
  label: string;
  input: WhatIfInput;
};
