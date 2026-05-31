import { useMemo, useState } from "react";
import { emptyWhatIfInput, whatIfPresets } from "../../whatIf/presets";
import { simulateWhatIf } from "../../whatIf/simulator";
import type { WhatIfBranchResult, WhatIfInput } from "../../whatIf/types";

type WhatIfDemoScreenProps = {
  onExit: () => void;
};

const stepLabels = ["处境", "选择", "目标", "结果"];

function isReadyForStep(input: WhatIfInput, step: number) {
  if (step === 0) {
    return input.situation.trim().length >= 4;
  }

  if (step === 1) {
    return (
      input.decision.trim().length >= 4 &&
      input.optionA.trim().length > 0 &&
      input.optionB.trim().length > 0
    );
  }

  if (step === 2) {
    return input.goal.trim().length >= 3 && input.fear.trim().length >= 3;
  }

  return true;
}

function updateField(
  input: WhatIfInput,
  field: keyof WhatIfInput,
  value: string,
) {
  return {
    ...input,
    [field]: value,
  };
}

type BranchResultProps = {
  result: WhatIfBranchResult;
};

function BranchResult({ result }: BranchResultProps) {
  const [activeBranchIndex, setActiveBranchIndex] = useState(0);
  const branch = result.branches[activeBranchIndex] ?? result.branches[0];

  return (
    <div className="what-if-output">
      <section className="what-if-result-main" aria-labelledby="what-if-result">
        <p className="what-if-kicker">现实预演完成</p>
        <h2 id="what-if-result">{result.title}</h2>
        <p className="what-if-decision">{result.realDecisionPoint}</p>

        <div
          className="what-if-branch-tabs"
          role="tablist"
          aria-label="未来分支"
        >
          {result.branches.map((item, index) => (
            <button
              key={item.label}
              aria-selected={index === activeBranchIndex}
              className="what-if-branch-tab"
              type="button"
              onClick={() => setActiveBranchIndex(index)}
            >
              {item.label.replace("分支 ", "")}
            </button>
          ))}
        </div>

        <article className="what-if-branch-detail">
          <h3>{branch.label}</h3>
          <p>{branch.action}</p>
          <div className="what-if-time-grid">
            <div>
              <strong>7 天</strong>
              <span>{branch.day7}</span>
            </div>
            <div>
              <strong>30 天</strong>
              <span>{branch.day30}</span>
            </div>
            <div>
              <strong>90 天</strong>
              <span>{branch.day90}</span>
            </div>
          </div>
          <p className="what-if-cost">隐藏代价：{branch.hiddenCost}</p>
          <ul className="what-if-signal-list">
            {branch.earlySignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
          <p className="what-if-state">{branch.playerState}</p>
        </article>
      </section>

      <aside className="what-if-result-side what-if-result-side--branches">
        <div className="what-if-module">
          <h3>预警信号</h3>
          <ul>
            {result.warningSignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </div>
        <div className="what-if-module">
          <h3>最小现实动作</h3>
          <p>{result.nextAction}</p>
        </div>
        <div className="what-if-card">
          <strong>{result.resultCard.label}</strong>
          <span>{result.resultCard.note}</span>
        </div>
      </aside>
    </div>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  rows?: number;
  placeholder: string;
  onChange: (value: string) => void;
};

function InputField({
  label,
  value,
  rows = 3,
  placeholder,
  onChange,
}: InputFieldProps) {
  return (
    <label className="what-if-field">
      <span>{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

export function WhatIfDemoScreen({ onExit }: WhatIfDemoScreenProps) {
  const [input, setInput] = useState<WhatIfInput>(whatIfPresets[0].input);
  const [step, setStep] = useState(0);
  const result = useMemo(() => simulateWhatIf(input), [input]);
  const canContinue = isReadyForStep(input, step);

  function restart() {
    setInput(emptyWhatIfInput);
    setStep(0);
  }

  return (
    <main className="screen what-if-screen">
      <header className="status-bar">
        <span className="status-bar__brand">WHAT-IF Game Skill</span>
        <span className="status-bar__meta">
          <span>把现实选择变成可玩的未来分支</span>
          <span className="status-light status-light--live" />
          <button className="status-action" type="button" onClick={onExit}>
            首页
          </button>
        </span>
      </header>

      <section className="what-if-shell" aria-label="WHAT-IF Game Skill Demo">
        <aside className="what-if-console">
          <div>
            <p className="what-if-kicker">Demo</p>
            <h1>试玩一个未来分支</h1>
            <p>
              输入一个正在纠结的现实选择。这个 Demo
              不会替你决定，只会把后果、代价和信号摊开给你看。
            </p>
          </div>

          <div className="what-if-step-list" aria-label="填写进度">
            {stepLabels.map((label, index) => (
              <span
                key={label}
                className={
                  index === step ? "what-if-step is-active" : "what-if-step"
                }
              >
                {index + 1}. {label}
              </span>
            ))}
          </div>

          <button className="secondary-action" type="button" onClick={onExit}>
            返回首页
          </button>
        </aside>

        <section className="what-if-stage">
          {step === 0 ? (
            <div className="what-if-form-panel">
              <p className="what-if-kicker">第 1 步 / 处境</p>
              <h2>你现在卡在哪个现实选择里？</h2>
              <InputField
                label="当前处境"
                value={input.situation}
                rows={5}
                placeholder="例如：我做了一个小工具，用户增长还可以，但运行成本越来越高。"
                onChange={(value) =>
                  setInput((current) =>
                    updateField(current, "situation", value),
                  )
                }
              />
              <div className="what-if-presets" aria-label="示例处境">
                {whatIfPresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setInput(preset.input)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="what-if-form-panel">
              <p className="what-if-kicker">第 2 步 / 选择</p>
              <h2>你正在选哪两条路？</h2>
              <InputField
                label="真正纠结的问题"
                value={input.decision}
                placeholder="例如：继续免费冲规模，还是现在开始收费？"
                onChange={(value) =>
                  setInput((current) => updateField(current, "decision", value))
                }
              />
              <div className="what-if-two-fields">
                <label className="what-if-field">
                  <span>选项 A</span>
                  <input
                    value={input.optionA}
                    placeholder="继续免费"
                    onChange={(event) =>
                      setInput((current) =>
                        updateField(current, "optionA", event.target.value),
                      )
                    }
                  />
                </label>
                <label className="what-if-field">
                  <span>选项 B</span>
                  <input
                    value={input.optionB}
                    placeholder="小范围收费测试"
                    onChange={(event) =>
                      setInput((current) =>
                        updateField(current, "optionB", event.target.value),
                      )
                    }
                  />
                </label>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="what-if-form-panel">
              <p className="what-if-kicker">第 3 步 / 目标</p>
              <h2>你想保护什么，又最怕什么？</h2>
              <InputField
                label="你的目标"
                value={input.goal}
                placeholder="例如：验证这个产品能不能长期做下去"
                onChange={(value) =>
                  setInput((current) => updateField(current, "goal", value))
                }
              />
              <InputField
                label="你最担心的坏结果"
                value={input.fear}
                placeholder="例如：太早收费把用户吓走，太晚收费又被成本追着跑"
                onChange={(value) =>
                  setInput((current) => updateField(current, "fear", value))
                }
              />
            </div>
          ) : null}

          {step === 3 && result.mode === "branches" ? (
            <BranchResult result={result} />
          ) : null}

          {step === 3 && result.mode === "safety" ? (
            <div className="what-if-output what-if-output--safety">
              <section className="what-if-result-main">
                <p className="what-if-kicker">安全降级</p>
                <h2>{result.title}</h2>
                <p className="what-if-decision">{result.realDecisionPoint}</p>
                <p className="what-if-cost">{result.riskReason}</p>
                <div className="what-if-prep-grid">
                  {result.prepList.map((group) => (
                    <div className="what-if-module" key={group.label}>
                      <h3>{group.label}</h3>
                      <ul>
                        {group.items.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
              <aside className="what-if-result-side">
                <div className="what-if-module">
                  <h3>最小现实动作</h3>
                  <p>{result.nextAction}</p>
                </div>
                <div className="what-if-card">
                  <strong>{result.resultCard.label}</strong>
                  <span>{result.resultCard.note}</span>
                </div>
              </aside>
            </div>
          ) : null}

          <footer className="what-if-actions">
            {step > 0 ? (
              <button
                className="secondary-action"
                type="button"
                onClick={() => setStep((current) => Math.max(0, current - 1))}
              >
                上一步
              </button>
            ) : (
              <button
                className="secondary-action"
                type="button"
                onClick={restart}
              >
                清空
              </button>
            )}
            {step < 2 ? (
              <button
                className="primary-action"
                type="button"
                disabled={!canContinue}
                onClick={() => setStep((current) => current + 1)}
              >
                继续
              </button>
            ) : null}
            {step === 2 ? (
              <button
                className="primary-action"
                type="button"
                disabled={!canContinue}
                onClick={() => setStep(3)}
              >
                生成未来分支
              </button>
            ) : null}
            {step === 3 ? (
              <button
                className="primary-action"
                type="button"
                onClick={restart}
              >
                再试一个选择
              </button>
            ) : null}
          </footer>
        </section>
      </section>
    </main>
  );
}
