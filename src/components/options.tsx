import { EvenToken, OddToken, RingToken } from "./tokens";

export type OptionKey = "A" | "B" | "C" | "D" | "E" | "F";
type Option = { key: OptionKey; content: React.ReactNode; correct?: boolean };

export const OPTIONS: Option[] = [
  { key: "A", content: <><EvenToken/><EvenToken/></> },
  { key: "B", content: <><OddToken/><OddToken/><OddToken/><OddToken/></> },
  { key: "C", content: <><OddToken/><OddToken/><OddToken/></> },
  { key: "D", content: <><OddToken/><OddToken/><OddToken/><OddToken/><OddToken/></> },
  { key: "E", content: <><EvenToken/><EvenToken/><EvenToken/><EvenToken/></>, correct: true },
  { key: "F", content: <><RingToken/><RingToken/><RingToken/><RingToken/></> },
];

interface OptionsProps {
  selected?: OptionKey | null;
  onSelect: (k: OptionKey) => void;
}

export function Options({ selected, onSelect }: OptionsProps) {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[720px] mx-auto">
        {OPTIONS.map((opt) => {
          const isSel = selected === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onSelect(opt.key)}
              role="button"
              aria-label={`Alternativa ${opt.key}`}
              className={[
                "rv-option group",
                isSel ? "rv-option--active" : "rv-option--idle",
              ].join(" ")}
            >
              <span className="rv-option-label">{opt.key})</span>
              <div className="rv-option-content">{opt.content}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}