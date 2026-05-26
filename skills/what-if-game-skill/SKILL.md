---
name: what-if-game-skill
description: Use when the user wants to rehearse a real-world decision by turning their situation into playable future branches with consequences, hidden costs, early signals, and a small reversible next action. Useful for product, creator, career, management, team, and project decisions where the user needs scenario simulation rather than a single recommendation.
---

# WHAT-IF Game Skill

Turn real decisions into playable future branches.

把现实选择，变成可玩的未来分支。

## Purpose

Use this skill to help a user rehearse a real decision before acting. The skill does not predict the future or decide for the user. It turns a current situation into several plausible future branches so the user can see consequences, hidden costs, early signals, and one small next action.

## When To Use

Use this skill when the user asks things like:

- "帮我模拟一下如果我选 A 或 B 会怎样。"
- "我现在纠结要不要做这件事。"
- "如果继续这样走，后面可能会发生什么？"
- "帮我做一个现实决策预演。"
- "我想看看这个选择的几种后果。"

Good fit:

- Product, creator, career, team, management, and project decisions.
- Medium-stakes uncertainty where the user needs clarity, not a single answer.
- Decisions where human state matters: energy, judgment, agency, stability, trust.

Do not use as a deterministic advisor for medical, legal, financial trading, personal safety, or crisis decisions. See `references/safety-boundaries.md` when risk is high.

## Core Workflow

1. Identify the situation.
2. Extract or ask for the real decision, goal, fear, constraints, and time horizon.
3. Reframe the decision into the underlying tradeoff.
4. Generate three playable future branches.
5. For each branch, describe consequences at 7 days, 30 days, and 90 days.
6. Surface hidden costs and observable early signals.
7. Give one small reversible next action.
8. End with a result-card style label and short note.

If the user already gave enough information, do not ask follow-up questions. If key context is missing, ask at most three short questions:

1. What are the actual options you are choosing between?
2. What are you most trying to protect?
3. If this goes badly, what failure mode worries you most?

## Output Contract

Default output has seven sections:

1. `局面标题`
2. `真正的决策点`
3. `未来分支`
4. `人的状态变化`
5. `预警信号`
6. `最小现实动作`
7. `结果页式总结`

Read `references/output-format.md` when producing a full response, building UI, writing tests, or adapting the output to a structured API.

## Branch Rules

Create exactly three branches unless the user explicitly asks for a different count.

Default branch roles:

- Direct branch: what the user is most tempted to do.
- Conservative branch: keeps risk lower and reversibility higher.
- Counterintuitive branch: tests a neglected variable before committing.

Each branch must include:

- Branch label.
- Action.
- 7-day consequence.
- 30-day consequence.
- 90-day consequence.
- Hidden cost.
- Early signals.
- Player state.
- Best fit.

## Tone

Be clear, vivid, and grounded. A little humor is welcome, but do not turn the user's life into a joke.

Use:

- "这条路短期会更爽，但代价会晚一点出现。"
- "这个选择不是错，只是会把压力转移到另一个地方。"
- "如果你走这条路，第一个该盯的信号不是热度，而是谁愿意重复使用。"

Avoid:

- "你必须..."
- "最佳选择是..."
- "这一定会..."
- "从战略上讲..."
- Empty consulting phrases like "综合考虑" without concrete consequences.

## Reality Constraints

The skill must produce useful reality-facing outputs:

- Observable signals, not abstract virtues.
- One next action that can be done in 24-72 hours.
- A clear note that this is a rehearsal, not a prediction.
- No hidden assumption that one branch is morally superior.

## References

Use these as needed:

- `references/output-format.md`: full Markdown and structured output templates.
- `references/scenario-patterns.md`: common decision patterns and branch ideas.
- `references/safety-boundaries.md`: high-risk domains and downgrade behavior.
- `references/examples.md`: example inputs and outputs.
- `goldens/`: complete sample outputs used for regression checks.

## Quality Checklist

Before finalizing, check:

- Did I identify the real tradeoff behind the user's surface question?
- Do the branches feel meaningfully different?
- Does every branch show 7/30/90-day consequences?
- Are the warning signals observable?
- Is the next action small, reversible, and information-producing?
- Did I avoid pretending this is a prediction?
- Did I avoid giving high-risk professional advice?
