import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q18.png";
import optA from "@/assets/retencao-visual/q18-opt-a.png";
import optB from "@/assets/retencao-visual/q18-opt-b.png";
import optC from "@/assets/retencao-visual/q18-opt-c.png";
import optD from "@/assets/retencao-visual/q18-opt-d.png";
import optE from "@/assets/retencao-visual/q18-opt-e.png";
import optF from "@/assets/retencao-visual/q18-opt-f.png";

/* ================== BOARD ================== */
const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[920px]">
      <img
        src={boardImg}
        alt="Linha de formas e símbolos com a posição 5 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 920px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

const CORRECT: OptionKey = "E";

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const items: { key: OptionKey; aria: string; src: string }[] = [
    { key: "A", aria: "A: símbolos no sentido errado", src: optA },
    { key: "B", aria: "B: deslocamento de dois passos (B3)", src: optB },
    { key: "C", aria: "C: formas não movidas", src: optC },
    { key: "D", aria: "D: símbolos não movidos", src: optD },
    { key: "E", aria: "E: formas +1 e símbolos −1 (correta)", src: optE }, // ✔
    { key: "F", aria: "F: formas no sentido errado", src: optF },
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[720px] mx-auto">
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
                  className="w-full h-auto max-w-[220px] mx-auto transition-transform duration-200 select-none"
                  sizes="(max-width: 640px) 45vw, 220px"
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

const Q18: QuestionSpec = {
  id: 18,
  prompt: "Qual alternativa completa logicamente a posição 5?",
  Board,
  Options,
};

export default Q18;
