import { readdir, readFile } from "node:fs/promises";

const skillRoot = new URL("..", import.meta.url);
const fixturesDir = new URL("fixtures/", skillRoot);
const goldensDir = new URL("goldens/", skillRoot);
const scenarioPatternsUrl = new URL(
  "references/scenario-patterns.md",
  skillRoot,
);

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function assertStringArray(value, fieldName, { min = 1, max } = {}) {
  assert(
    Array.isArray(value) && value.every(isNonEmptyString),
    `${fieldName} must be non-empty strings`,
  );
  assert(value.length >= min, `${fieldName} needs at least ${min} items`);
  if (max !== undefined) {
    assert(value.length <= max, `${fieldName} must have at most ${max} items`);
  }
}

function assertNoForbiddenPhrases(value, filename) {
  const text = JSON.stringify(value);
  for (const phrase of ["你必须", "最佳选择是", "这一定会", "唯一正确"]) {
    assert(!text.includes(phrase), `${filename}: contains "${phrase}"`);
  }
}

function validateInput(input, filename) {
  assert(input && typeof input === "object", `${filename}: missing input`);
  assert(
    isNonEmptyString(input.situation),
    `${filename}: missing input.situation`,
  );
  assert(
    isNonEmptyString(input.decision),
    `${filename}: missing input.decision`,
  );
  assert(
    Array.isArray(input.options),
    `${filename}: input.options must be an array`,
  );
  assert(
    input.options.length >= 2,
    `${filename}: input.options needs at least 2 items`,
  );
  assert(isNonEmptyString(input.goal), `${filename}: missing input.goal`);
}

function validateFixture(fixture, filename) {
  assert(isNonEmptyString(fixture.id), `${filename}: missing id`);
  validateInput(fixture.input, filename);
  assert(
    fixture.expected && typeof fixture.expected === "object",
    `${filename}: missing expected`,
  );
  assert(
    Number.isInteger(fixture.expected.minBranches) &&
      fixture.expected.minBranches >= 0,
    `${filename}: expected.minBranches must be a non-negative integer`,
  );
  if (!fixture.expected.safetyDowngrade) {
    assert(
      fixture.expected.minBranches >= 3,
      `${filename}: non-safety fixtures need at least 3 branches`,
    );
  }
  assert(
    Array.isArray(fixture.expected.requiredSignals) &&
      fixture.expected.requiredSignals.every(isNonEmptyString),
    `${filename}: expected.requiredSignals must be non-empty strings`,
  );
  assert(
    isNonEmptyString(fixture.expected.forbiddenNextAction),
    `${filename}: missing expected.forbiddenNextAction`,
  );
  if (fixture.expected.safetyDowngrade) {
    assert(
      isNonEmptyString(fixture.expected.requiredSafetyNote),
      `${filename}: safety fixtures need expected.requiredSafetyNote`,
    );
  }
}

function validateResultCard(resultCard, filename) {
  assert(
    resultCard && typeof resultCard === "object",
    `${filename}: missing output.resultCard`,
  );
  assert(
    isNonEmptyString(resultCard.label),
    `${filename}: missing output.resultCard.label`,
  );
  assert(
    isNonEmptyString(resultCard.note),
    `${filename}: missing output.resultCard.note`,
  );
}

function validateNormalGolden(output, filename) {
  assert(
    isNonEmptyString(output.situationTitle),
    `${filename}: missing output.situationTitle`,
  );
  assert(
    isNonEmptyString(output.realDecisionPoint),
    `${filename}: missing output.realDecisionPoint`,
  );
  assert(
    Array.isArray(output.branches) && output.branches.length === 3,
    `${filename}: normal golden outputs need exactly 3 branches`,
  );

  for (const [index, branch] of output.branches.entries()) {
    const prefix = `${filename}: output.branches[${index}]`;
    for (const field of [
      "label",
      "action",
      "hiddenCost",
      "playerState",
      "bestFit",
    ]) {
      assert(isNonEmptyString(branch[field]), `${prefix}: missing ${field}`);
    }
    assert(
      branch.consequences && typeof branch.consequences === "object",
      `${prefix}: missing consequences`,
    );
    for (const field of ["day7", "day30", "day90"]) {
      assert(
        isNonEmptyString(branch.consequences[field]),
        `${prefix}: missing consequences.${field}`,
      );
    }
    assertStringArray(branch.earlySignals, `${prefix}.earlySignals`, {
      min: 2,
    });
  }

  assertStringArray(output.humanStateChange, `${filename}: humanStateChange`, {
    min: 2,
  });
  assertStringArray(output.warningSignals, `${filename}: warningSignals`, {
    min: 3,
    max: 5,
  });
  assert(
    isNonEmptyString(output.nextAction),
    `${filename}: missing output.nextAction`,
  );
  validateResultCard(output.resultCard, filename);
  assert(
    isNonEmptyString(output.closingNote) &&
      output.closingNote.includes("不是预测"),
    `${filename}: closingNote must say this is not a prediction`,
  );
}

function validateSafetyGolden(output, filename) {
  assert(
    output.safetyMode === "professional-downgrade" ||
      output.safetyMode === "immediate-safety",
    `${filename}: invalid output.safetyMode`,
  );
  assert(
    !Array.isArray(output.branches) || output.branches.length === 0,
    `${filename}: safety golden must not include playable branches`,
  );
  for (const field of [
    "situationTitle",
    "riskReason",
    "realDecisionPoint",
    "nextAction",
    "closingNote",
  ]) {
    assert(isNonEmptyString(output[field]), `${filename}: missing ${field}`);
  }
  assert(
    output.decisionPrep && typeof output.decisionPrep === "object",
    `${filename}: missing output.decisionPrep`,
  );
  for (const field of [
    "needToClarify",
    "missingFacts",
    "professionalQuestions",
    "reversiblePrepActions",
    "avoidForNow",
  ]) {
    assertStringArray(
      output.decisionPrep[field],
      `${filename}: decisionPrep.${field}`,
      { min: 2 },
    );
  }
  validateResultCard(output.resultCard, filename);
}

function validateGolden(golden, filename) {
  assert(isNonEmptyString(golden.id), `${filename}: missing id`);
  validateInput(golden.input, filename);
  assert(
    golden.output && typeof golden.output === "object",
    `${filename}: missing output`,
  );
  assertNoForbiddenPhrases(golden.output, filename);

  if (golden.output.safetyMode) {
    validateSafetyGolden(golden.output, filename);
    return "safety";
  }

  validateNormalGolden(golden.output, filename);
  return "normal";
}

const filenames = (await readdir(fixturesDir)).filter((file) =>
  file.endsWith(".json"),
);
assert(filenames.length > 0, "No fixture files found.");

for (const filename of filenames) {
  const raw = await readFile(new URL(filename, fixturesDir), "utf8");
  validateFixture(JSON.parse(raw), filename);
}

const goldenFilenames = (await readdir(goldensDir)).filter((file) =>
  file.endsWith(".json"),
);
assert(goldenFilenames.length >= 4, "Expected at least 4 golden outputs.");

let normalGoldenCount = 0;
let safetyGoldenCount = 0;

for (const filename of goldenFilenames) {
  const raw = await readFile(new URL(filename, goldensDir), "utf8");
  const goldenType = validateGolden(JSON.parse(raw), filename);
  if (goldenType === "safety") {
    safetyGoldenCount += 1;
  } else {
    normalGoldenCount += 1;
  }
}

assert(
  normalGoldenCount >= 3,
  `expected at least 3 normal golden outputs, found ${normalGoldenCount}`,
);
assert(
  safetyGoldenCount >= 1,
  `expected at least 1 safety golden output, found ${safetyGoldenCount}`,
);

const scenarioPatterns = await readFile(scenarioPatternsUrl, "utf8");
const patternSections = scenarioPatterns
  .split(/^## /m)
  .slice(1)
  .map((section) => section.trim());

assert(
  patternSections.length >= 8,
  `scenario-patterns.md: expected at least 8 patterns, found ${patternSections.length}`,
);

for (const section of patternSections) {
  const title = section.split("\n")[0];
  for (const requiredHeading of [
    "Common illusion:",
    "Hidden costs:",
    "Early signals:",
    "Useful branch set:",
  ]) {
    assert(
      section.includes(requiredHeading),
      `scenario-patterns.md: pattern "${title}" missing "${requiredHeading}"`,
    );
  }
}

const safetyFixtureCount = filenames.filter((filename) =>
  filename.startsWith("safety-"),
).length;
assert(
  safetyFixtureCount >= 3,
  `expected at least 3 safety fixtures, found ${safetyFixtureCount}`,
);

console.log(
  `Validated ${filenames.length} fixtures (${safetyFixtureCount} safety), ${goldenFilenames.length} golden outputs (${safetyGoldenCount} safety), and ${patternSections.length} scenario patterns.`,
);
