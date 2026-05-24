import { phaseLabels, productName } from "../../game/constants";
import type { GameState } from "../../game/types";

type StatusLightsProps = {
  gameState: GameState;
};

export function StatusLights({ gameState }: StatusLightsProps) {
  return (
    <header className="status-bar" aria-label="当前状态">
      <div className="status-bar__brand">{productName}</div>
      <div className="status-bar__meta">
        <span className="status-light status-light--live" />
        <span>{phaseLabels[gameState.phase]}</span>
        <span>回合 {String(gameState.turn + 1).padStart(2, "0")}</span>
      </div>
    </header>
  );
}
