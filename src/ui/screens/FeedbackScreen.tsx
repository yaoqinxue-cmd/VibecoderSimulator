import { statKeys, statLabels } from "../../game/constants";
import type { Feedback, GameState } from "../../game/types";
import { StatusLights } from "../components/StatusLights";

type FeedbackScreenProps = {
  gameState: GameState;
  feedback: Feedback;
  onContinue: () => void;
};

export function FeedbackScreen({
  gameState,
  feedback,
  onContinue,
}: FeedbackScreenProps) {
  return (
    <main className="screen game-screen">
      <StatusLights gameState={gameState} />
      <section className="feedback-panel" aria-labelledby="feedback-title">
        <h2 id="feedback-title">{feedback.cardTitle}</h2>
        <p className="feedback-line">{feedback.line}</p>
        <div className="delta-grid" aria-label="指标变化">
          {statKeys.map((stat) => {
            const delta = feedback.effects[stat] ?? 0;
            return (
              <div className="delta-item" key={stat}>
                <span>{statLabels[stat]}</span>
                <strong
                  className={delta >= 0 ? "delta-positive" : "delta-negative"}
                >
                  {delta >= 0 ? "+" : ""}
                  {delta}
                </strong>
              </div>
            );
          })}
        </div>
        <button className="primary-action" type="button" onClick={onContinue}>
          继续
        </button>
      </section>
    </main>
  );
}
