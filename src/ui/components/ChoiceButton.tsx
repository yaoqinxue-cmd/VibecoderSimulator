import type { Choice } from "../../game/types";

type ChoiceButtonProps = {
  choice: Choice;
  index: number;
  onChoose: (choiceId: string) => void;
};

export function ChoiceButton({ choice, index, onChoose }: ChoiceButtonProps) {
  return (
    <button
      className="choice-button"
      type="button"
      onClick={() => onChoose(choice.id)}
    >
      <span className="choice-button__index">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span>{choice.label}</span>
    </button>
  );
}
