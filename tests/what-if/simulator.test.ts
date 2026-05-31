import { describe, expect, it } from "vitest";
import { simulateWhatIf } from "../../src/whatIf/simulator";

describe("WHAT-IF demo simulator", () => {
  it("creates three playable branches for a normal decision", () => {
    const result = simulateWhatIf({
      situation: "我有一个小工具，用户增长还可以，但运行成本越来越高。",
      decision: "继续免费冲规模，还是现在开始收费？",
      optionA: "继续免费",
      optionB: "小范围收费测试",
      goal: "验证这个产品能不能长期做下去",
      fear: "太早收费把用户吓走",
    });

    expect(result.mode).toBe("branches");
    if (result.mode !== "branches") {
      throw new Error("Expected branch result");
    }

    expect(result.branches).toHaveLength(3);
    expect(result.realDecisionPoint).toContain("继续免费");
    expect(result.branches[0].day7).toBeTruthy();
    expect(result.branches[0].day30).toBeTruthy();
    expect(result.branches[0].day90).toBeTruthy();
    expect(result.warningSignals.length).toBeGreaterThanOrEqual(3);
    expect(result.nextAction).toContain("48 小时");
  });

  it("downgrades high-risk professional decisions", () => {
    const result = simulateWhatIf({
      situation: "医生给了我两个治疗方案，我很焦虑。",
      decision: "我该选治疗方案 A 还是方案 B？",
      optionA: "治疗方案 A",
      optionB: "治疗方案 B",
      goal: "选一个更安全有效的方案",
      fear: "选错会影响健康",
    });

    expect(result.mode).toBe("safety");
    if (result.mode !== "safety") {
      throw new Error("Expected safety result");
    }

    expect(result.riskReason).toContain("不会替你判断");
    expect(result.prepList.length).toBeGreaterThanOrEqual(3);
    expect(result.nextAction).toContain("事实清单");
  });
});
