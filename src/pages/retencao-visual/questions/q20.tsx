import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q20.1.png";
import optA from "@/assets/retencao-visual/q20-opt-a.png";
import optB from "@/assets/retencao-visual/q20-opt-b.png";
import optC from "@/assets/retencao-visual/q20-opt-c.png";
import optD from "@/assets/retencao-visual/q20-opt-d.png";
import optE from "@/assets/retencao-visual/q20-opt-e.png";
import optF from "@/assets/retencao-visual/q20-opt-f.png";

const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[860px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 de dominós com a célula 5 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 860px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

const CORRECT: OptionKey = "D";

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const items: { key: OptionKey; aria: string; src: string }[] = [
    { key: "A", aria: "A: dominó 4-4 com pinos preenchidos", src: optA },
    { key: "B", aria: "B: dominó 6-2 com pinos preenchidos", src: optB },
    { key: "C", aria: "C: dominó 3-5 com pinos preenchidos", src: optC },
    { key: "D", aria: "D: dominó 5-3 com pinos preenchidos (correta)", src: optD }, // ✔
    { key: "E", aria: "E: dominó 5-3 com pinos vazados", src: optE },
    { key: "F", aria: "F: dominó 5-2 com pinos preenchidos", src: optF },
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[860px] mx-auto">
        {items.map(({ key, aria, src }) => {
          const isSel = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              aria-label={aria}
              className={[
                "rv-option group",
                isSel ? "rv-option--active" : "rv-option--idle",
              ].join(" ")}
            >
              <span className="rv-option-label">{key})</span>
              <div className="rv-option-content">
                <img
                  src={src}
                  alt={aria}
                  className="w-full h-auto max-w-[180px] mx-auto transition-transform duration-200 select-none"
                  sizes="(max-width: 640px) 45vw, 180px"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="sr-only">
                {key === CORRECT ? "Resposta correta" : "Resposta incorreta"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
/* ------------------- SPEC ------------------- */
const Q20: QuestionSpec = {
  id: 20,
  prompt: "Qual dominó deve ocupar a célula 5?",
  Board,
  Options,
};

export default Q20;
