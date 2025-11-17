import React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q9.png";
import optA from "@/assets/retencao-visual/q9-opt-a.png";
import optB from "@/assets/retencao-visual/q9-opt-b.png";
import optC from "@/assets/retencao-visual/q9-opt-c.png";
import optD from "@/assets/retencao-visual/q9-opt-d.png";
import optE from "@/assets/retencao-visual/q9-opt-e.png";
import optF from "@/assets/retencao-visual/q9-opt-f.png";

const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[720px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 do teste de padrões, posição 6 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 720px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ======== Alternativas (D é a correta) ======== */
const CORRECT: OptionKey = "D";

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const items: { key: OptionKey; aria: string; src: string }[] = [
    { key: "A", aria: "A: 5 pontos", src: optA },
    { key: "B", aria: "B: 6 pontos (ordem incorreta)", src: optB },
    { key: "C", aria: "C: 4 pontos na mesma posição", src: optC },
    { key: "D", aria: "D: 6 pontos corretos", src: optD }, // ✅ correta
    { key: "E", aria: "E: 6 pontos com salto indevido", src: optE },
    { key: "F", aria: "F: 6 pontos azuis", src: optF },
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

const Q9: QuestionSpec = {
  id: 9,
  prompt: "Qual alternativa completa logicamente a posição 6?",
  Board,
  Options,
};

export default Q9;