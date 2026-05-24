import { statKeys } from "../../game/constants";
import type { Card, GameState } from "../../game/types";
import { ChoiceButton } from "../components/ChoiceButton";
import { StatMeter } from "../components/StatMeter";
import { StatusLights } from "../components/StatusLights";

type EventScreenProps = {
  card: Card;
  gameState: GameState;
  onChoose: (choiceId: string) => void;
};

export function EventScreen({ card, gameState, onChoose }: EventScreenProps) {
  return (
    <main className="screen game-screen">
      <StatusLights gameState={gameState} />
      <section className="event-layout" aria-labelledby="event-title">
        <aside className="stat-panel" aria-label="四个指标">
          {statKeys.map((stat) => (
            <StatMeter
              key={stat}
              stat={stat}
              value={gameState.stats[stat]}
              compact
            />
          ))}
        </aside>

        <article className="event-card">
          <h2 id="event-title">{card.title}</h2>
          <p>{card.body}</p>
        </article>

        <nav className="choice-stack" aria-label="选择">
          {card.choices.map((choice, index) => (
            <ChoiceButton
              key={choice.id}
              choice={choice}
              index={index}
              onChoose={onChoose}
            />
          ))}
        </nav>
      </section>
    </main>
  );
}
