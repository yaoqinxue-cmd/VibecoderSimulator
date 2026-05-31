import { useEffect, useMemo, useReducer, useState } from "react";
import { cards } from "../content/cards";
import { endings } from "../content/endings";
import {
  chooseOption,
  createInitialState,
  createStartState,
  getCurrentCard,
  getEnding,
} from "../game/engine";
import { gameReducer } from "../game/reducer";
import { loadGame, saveGame } from "../game/storage";
import { EventScreen } from "../ui/screens/EventScreen";
import { FeedbackScreen } from "../ui/screens/FeedbackScreen";
import { ResultScreen } from "../ui/screens/ResultScreen";
import { StartScreen } from "../ui/screens/StartScreen";
import { WhatIfDemoScreen } from "../ui/screens/WhatIfDemoScreen";

const whatIfHash = "#what-if";

export function App() {
  const savedState = useMemo(() => loadGame(), []);
  const [gameState, dispatch] = useReducer(gameReducer, createStartState());
  const [activeView, setActiveView] = useState<"game" | "what-if">(() =>
    window.location.hash === whatIfHash ? "what-if" : "game",
  );
  const currentCard = getCurrentCard(cards, gameState);
  const ending = getEnding(endings, gameState);

  useEffect(() => {
    function syncHashRoute() {
      setActiveView(window.location.hash === whatIfHash ? "what-if" : "game");
    }

    window.addEventListener("hashchange", syncHashRoute);
    return () => window.removeEventListener("hashchange", syncHashRoute);
  }, []);

  function startNewGame() {
    const nextState = createInitialState(cards);
    saveGame(nextState);
    dispatch({ type: "replace", state: nextState });
  }

  function resumeGame() {
    if (savedState) {
      dispatch({ type: "replace", state: savedState });
      return;
    }
    startNewGame();
  }

  function choose(choiceId: string) {
    const nextState = chooseOption(cards, endings, gameState, choiceId);
    saveGame(nextState);
    dispatch({ type: "replace", state: nextState });
  }

  function continueFromFeedback() {
    dispatch({ type: "continue" });
  }

  function resetGame() {
    startNewGame();
  }

  function openWhatIfDemo() {
    window.location.hash = whatIfHash;
    setActiveView("what-if");
  }

  function closeWhatIfDemo() {
    window.history.pushState(
      "",
      document.title,
      window.location.pathname + window.location.search,
    );
    setActiveView("game");
  }

  if (activeView === "what-if") {
    return <WhatIfDemoScreen onExit={closeWhatIfDemo} />;
  }

  if (gameState.screen === "start") {
    return (
      <StartScreen
        hasSavedGame={Boolean(savedState)}
        onStart={startNewGame}
        onResume={resumeGame}
        onOpenWhatIf={openWhatIfDemo}
      />
    );
  }

  if (gameState.screen === "feedback" && gameState.lastFeedback) {
    return (
      <FeedbackScreen
        gameState={gameState}
        feedback={gameState.lastFeedback}
        onContinue={continueFromFeedback}
      />
    );
  }

  if (gameState.screen === "result" && ending) {
    return (
      <ResultScreen
        ending={ending}
        gameState={gameState}
        onRestart={resetGame}
      />
    );
  }

  if (!currentCard) {
    return (
      <ResultScreen
        ending={ending ?? endings[0]}
        gameState={gameState}
        onRestart={resetGame}
      />
    );
  }

  return (
    <EventScreen card={currentCard} gameState={gameState} onChoose={choose} />
  );
}
