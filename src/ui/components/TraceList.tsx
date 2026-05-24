import type { Trace } from "../../game/types";

type TraceListProps = {
  traces: Trace[];
};

export function TraceList({ traces }: TraceListProps) {
  const visibleTraces = traces.slice(-3);

  if (!visibleTraces.length) {
    return <p className="trace-list__empty">尚未留下明显痕迹。</p>;
  }

  return (
    <ul className="trace-list">
      {visibleTraces.map((trace, index) => (
        <li key={`${trace.type}-${trace.text}-${index}`}>
          <span className="trace-list__type">{trace.type}</span>
          <span>{trace.text}</span>
        </li>
      ))}
    </ul>
  );
}
