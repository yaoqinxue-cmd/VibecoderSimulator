import { gamePromise } from "../../content/constants";

type StartScreenProps = {
  hasSavedGame: boolean;
  onStart: () => void;
  onResume: () => void;
};

export function StartScreen({
  hasSavedGame,
  onStart,
  onResume,
}: StartScreenProps) {
  return (
    <main className="screen start-screen">
      <section className="start-panel" aria-labelledby="start-title">
        <h1 id="start-title">
          <span className="title-nowrap">Vibe Coding</span> 模拟器
        </h1>
        <p>{gamePromise}</p>
        <div className="start-actions">
          <button className="primary-action" type="button" onClick={onStart}>
            开始模拟
          </button>
          {hasSavedGame ? (
            <button
              className="secondary-action"
              type="button"
              onClick={onResume}
            >
              继续上一局
            </button>
          ) : null}
        </div>
      </section>
    </main>
  );
}
