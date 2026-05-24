import { statLabels } from "../../game/constants";
import { describeStat, statTone } from "../../game/scoring";
import type { StatKey } from "../../game/types";

type StatMeterProps = {
  stat: StatKey;
  value: number;
  compact?: boolean;
};

export function StatMeter({ stat, value, compact = false }: StatMeterProps) {
  const tone = statTone(stat, value);

  return (
    <div
      className={`stat-meter stat-meter--${tone} ${compact ? "stat-meter--compact" : ""}`}
    >
      <div className="stat-meter__label">
        <span>{statLabels[stat]}</span>
        <span>{describeStat(value)}</span>
      </div>
      <div className="stat-meter__track" aria-hidden="true">
        <div className="stat-meter__fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
