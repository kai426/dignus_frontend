import React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q13.png";
import optA from "@/assets/retencao-visual/q13-opt-a.png";
import optB from "@/assets/retencao-visual/q13-opt-b.png";
import optC from "@/assets/retencao-visual/q13-opt-c.png";
import optD from "@/assets/retencao-visual/q13-opt-d.png";
import optE from "@/assets/retencao-visual/q13-opt-e.png";
import optF from "@/assets/retencao-visual/q13-opt-f.png";

/* ---------- Board ---------- */
type BoardProps = { selected?: OptionKey | null };

const Board: React.FC<BoardProps> = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[920px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 com a posição 6 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 920px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ---------- Options ---------- */
const CORRECT: OptionKey = "C";

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const items: { key: OptionKey; aria: string; src: string }[] = [
    { key: "A", aria: "A: seta 300°, cunha 120°, 1 ponto", src: optA },
    { key: "B", aria: "B: seta 150°, cunha 150°, 3 pontos", src: optB },
    { key: "C", aria: "C: seta 150°, cunha 30°, 3 pontos (correta)", src: optC }, // ✔
    { key: "D", aria: "D: seta 90°, cunha 90°, 3 pontos", src: optD },
    { key: "E", aria: "E: seta 150°, cunha 30°, 2 pontos", src: optE },
    { key: "F", aria: "F: seta 180°, cunha 0°, 3 pontos", src: optF },
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[920px] mx-auto">
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
                  className="w-full h-auto max-w-[132px] mx-auto transition-transform duration-200 select-none"
                  sizes="(max-width: 640px) 45vw, 132px"
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

/* ---------- Spec export ---------- */
const Q13: QuestionSpec = {
  id: 13,
  prompt: "Qual alternativa completa logicamente a posição 6?",
  Board,   // não inclui Options (evita duplicação)
  Options, // OptionKey | null compatível
};

export default Q13;