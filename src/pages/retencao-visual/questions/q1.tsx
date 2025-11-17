// questions/q1.tsx
import * as React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import { OddToken, EvenToken, RingToken } from "@/components/tokens";
import boardImg from "@/assets/retencao-visual/q1.png"

/* =========================
   Board (2×2 — célula 4 faltando)
   ========================= */
const Board: React.FC = () => {
  return (
    <div className="flex justify-center my-6">
      <figure className="w-full max-w-[720px]">
        <img
          src={boardImg}
          alt="Matriz 2x2 do teste de padrões, com a quarta célula faltando"
          className="w-full h-auto"
          sizes="(max-width: 640px) 100vw, 720px"
          loading="eager"
          decoding="async"
        />
      </figure>
    </div>
  );
};

/* =========================
   Opções (3 colunas × 2 linhas)
   ========================= */
const CORRECT: OptionKey = "E";

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const items: { key: OptionKey; content: React.ReactNode }[] = [
    { key: "A", content: <><EvenToken/><EvenToken/></> },                                       // dois pares (quantidade errada)
    { key: "B", content: <><OddToken/><OddToken/><OddToken/><OddToken/></> },                   // quatro ímpares (paridade errada)
    { key: "C", content: <><OddToken/><OddToken/><OddToken/></> },                              // três ímpares (quantidade errada)
    { key: "D", content: <><OddToken/><OddToken/><OddToken/><OddToken/><OddToken/></> },        // cinco ímpares (quantidade errada)
    { key: "E", content: <><EvenToken/><EvenToken/><EvenToken/><EvenToken/></> },               // ✅ quatro pares (correta)
    { key: "F", content: <><RingToken/><RingToken/><RingToken/><RingToken/></> },               // quatro anéis sem listras (padrão errado)
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[720px] mx-auto">
        {items.map(({ key, content }) => {
          const isSel = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              aria-label={`Alternativa ${key}`}
              className={[
                "rv-option",
                isSel ? "rv-option--active" : "rv-option--idle",
              ].join(" ")}
            >
              <span className="rv-option-label">{key})</span>
              <div className="rv-option-content flex flex-wrap justify-center gap-2">
                {content}
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

/* =========================
   Spec
   ========================= */
const Q1: QuestionSpec = {
  id: 1,
  prompt: "Qual alternativa completa logicamente a matriz?",
  Board,
  Options,
};

export default Q1;
