import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const skillRoot = new URL("..", import.meta.url);
const fixturesDir = new URL("fixtures/", skillRoot);
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

function validateFixture(fixture, filename) {
  assert(isNonEmptyString(fixture.id), `${filename}: missing id`);
  assert(
    fixture.input && typeof fixture.input === "object",
    `${filename}: missing input`,
  );
  assert(
    isNonEmptyString(fixture.input.situation),
    `${filename}: missing input.situation`,
  );
  assert(
    isNonEmptyString(fixture.input.decision),
    `${filename}: missing input.decision`,
  );
  assert(
    Array.isArray(fixture.input.options),
    `${filename}: input.options must be an array`,
  );
  assert(
    fixture.input.options.length >= 2,
    `${filename}: input.options needs at least 2 items`,
  );
  assert(
    isNonEmptyString(fixture.input.goal),
    `${filename}: missing input.goal`,
  );
  assert(
    fixture.expected && typeof fixture.expected === "object",
    `${filename}: missing expected`,
  );
  assert(
    Number.isInteger(fixture.expected.minBranches) &&
      fixture.expected.minBranches >= 3,
    `${filename}: expected.minBranches must be at least 3`,
  );
  assert(
    Array.isArray(fixture.expected.requiredSignals) &&
      fixture.expected.requiredSignals.every(isNonEmptyString),
    `${filename}: expected.requiredSignals must be non-empty strings`,
  );
  assert(
    isNonEmptyString(fixture.expected.forbiddenNextAction),
    `${filename}: missing expected.forbiddenNextAction`,
  );
}

const filenames = (await readdir(fixturesDir)).filter((file) =>
  file.endsWith(".json"),
);
assert(filenames.length > 0, "No fixture files found.");

for (const filename of filenames) {
  const raw = await readFile(join(fixturesDir.pathname, filename), "utf8");
  validateFixture(JSON.parse(raw), filename);
}

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

console.log(
  `Validated ${filenames.length} WHAT-IF Game Skill fixtures and ${patternSections.length} scenario patterns.`,
);
