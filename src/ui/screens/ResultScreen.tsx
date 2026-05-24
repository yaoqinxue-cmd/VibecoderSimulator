import { statKeys } from "../../game/constants";
import type { Ending, GameState } from "../../game/types";
import { StatMeter } from "../components/StatMeter";
import { TraceList } from "../components/TraceList";

type ResultScreenProps = {
  ending: Ending;
  gameState: GameState;
  onRestart: () => void;
};

export function ResultScreen({
  ending,
  gameState,
  onRestart,
}: ResultScreenProps) {
  return (
    <main className="screen result-screen">
      <section className="result-shell" aria-labelledby="result-title">
        <div className="result-main">
          <h1 id="result-title">{ending.label}</h1>
          <p className="result-note">{ending.shortNote}</p>
          <p className="result-state">{ending.stateLine}</p>
          <p className="result-description">{ending.description}</p>
        </div>

        <aside className="result-side">
          <div className="result-module">
            <h2>核心指标</h2>
            {statKeys.map((stat) => (
              <StatMeter key={stat} stat={stat} value={gameState.stats[stat]} />
            ))}
          </div>
          <div className="result-module">
            <h2>关键选择</h2>
            <ul className="key-choice-list">
              {ending.keyChoices.map((choice) => (
                <li key={choice}>{choice}</li>
              ))}
            </ul>
          </div>
          <div className="result-module result-module--traces">
            <h2>最近痕迹</h2>
            <TraceList traces={gameState.traces} />
          </div>
          <button
            className="secondary-action"
            type="button"
            onClick={onRestart}
          >
            重新开始
          </button>
        </aside>
      </section>
    </main>
  );
}
