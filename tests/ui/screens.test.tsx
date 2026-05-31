import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "../../src/app/App";
import { cards } from "../../src/content/cards";
import { endings } from "../../src/content/endings";
import { createInitialState } from "../../src/game/engine";
import { saveGame } from "../../src/game/storage";
import { EventScreen } from "../../src/ui/screens/EventScreen";
import { FeedbackScreen } from "../../src/ui/screens/FeedbackScreen";
import { ResultScreen } from "../../src/ui/screens/ResultScreen";
import { StartScreen } from "../../src/ui/screens/StartScreen";

describe("main screens", () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.history.pushState("", document.title, "/");
  });

  it("always opens on the start screen even when a saved game exists", () => {
    saveGame({
      ...createInitialState(cards, "saved-game-test"),
      screen: "result",
      endingId: endings[0].id,
    });

    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Vibe Coding 模拟器" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "继续上一局" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: endings[0].label }),
    ).not.toBeInTheDocument();
  });

  it("renders the start screen with the product name", () => {
    render(
      <StartScreen hasSavedGame={false} onResume={vi.fn()} onStart={vi.fn()} />,
    );

    expect(
      screen.getByRole("heading", { name: "Vibe Coding 模拟器" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "开始模拟" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("如果你从今天开始 Vibe Coding..."),
    ).toBeInTheDocument();
  });

  it("opens the WHAT-IF demo from the start screen", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "WHAT-IF Demo" }));

    expect(
      screen.getByRole("heading", { name: "试玩一个未来分支" }),
    ).toBeInTheDocument();
    expect(window.location.hash).toBe("#what-if");
  });

  it("renders an event screen as a choice round", () => {
    const state = createInitialState(cards, "ui-test");
    render(
      <EventScreen card={cards[0]} gameState={state} onChoose={vi.fn()} />,
    );

    expect(screen.getByRole("heading", { name: "第一夜" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /立刻发给朋友/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /先看一遍代码/ }),
    ).toBeInTheDocument();
  });

  it("renders a concise feedback continue action", () => {
    const state = createInitialState(cards, "feedback-test");
    render(
      <FeedbackScreen
        gameState={state}
        feedback={{
          cardTitle: "客服邮件",
          line: "这个用户的问题解决了，下一个人还会遇到同一个保存按钮。",
          effects: { momentum: 4, stability: -4 },
          tracesAdded: [],
        }}
        onContinue={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "客服邮件" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "继续" })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "进入下一屏" }),
    ).not.toBeInTheDocument();
  });

  it("renders the result page essentials", () => {
    const state = {
      ...createInitialState(cards, "result-test"),
      screen: "result" as const,
      endingId: endings[0].id,
    };

    render(
      <ResultScreen
        ending={endings[0]}
        gameState={state}
        onRestart={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "无聊但OK" }),
    ).toBeInTheDocument();
    expect(screen.getByText("核心指标")).toBeInTheDocument();
    expect(screen.queryByText("你成为了")).not.toBeInTheDocument();
    expect(screen.queryByText("代表作品")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "重新开始" }),
    ).toBeInTheDocument();
  });
});
