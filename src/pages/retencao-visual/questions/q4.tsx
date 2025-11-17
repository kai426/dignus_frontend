import React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q4.png"

/* Ícones no tamanho pequeno do seu CSS */
const Tri = ({ dir }: { dir: "up" | "right" | "down" | "left" }) => {
  const rot =
    dir === "up" ? 0 : dir === "right" ? 90 : dir === "down" ? 180 : 270;
  return (
    <span
      style={{
        width: 0,
        height: 0,
        borderLeft: "24px solid transparent",
        borderRight: "24px solid transparent",
        borderBottom: "42px solid #111",
        display: "inline-block",
        transform: `rotate(${rot}deg)`,
      }}
    />
  );
};

const Square = () => (
  <span
    style={{
      width: 48,
      height: 48,
      border: "4px solid #111",
      borderRadius: 4,
      display: "inline-block",
    }}
  />
);

const Diamond = () => (
  <span
    style={{
      width: 48,
      height: 48,
      border: "4px solid #111",
      display: "inline-block",
      transform: "rotate(45deg)",
    }}
  />
);

/* Board 3x3 exatamente como a imagem */
const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[720px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 com a posição 8 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 720px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* Opções exatamente como na figura (A..F) */
const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const opts: { key: OptionKey; content: React.ReactNode }[] = [
    { key: "A", content: <Square /> },
    { key: "B", content: <Tri dir="up" /> },     // ✔ correta
    { key: "C", content: <Diamond /> },
    { key: "D", content: <Tri dir="left" /> },
    { key: "E", content: <Tri dir="down" /> },
    { key: "F", content: <Tri dir="right" /> },
  ];
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[720px] mx-auto">
      {opts.map(o => (
        <button
          key={o.key}
          onClick={() => onSelect(o.key)}
          className={[
            "rv-option",
            selected===o.key ? "rv-option--active" : "rv-option--idle"
          ].join(" ")}
          aria-label={`Alternativa ${o.key}`}
        >
          <span className="rv-option-label">{o.key})</span>
          <div className="rv-option-content">{o.content}</div>
        </button>
      ))}
    </div>
  );
};

const Q4: QuestionSpec = {
  id: 4,
  prompt: "Qual alternativa completa logicamente a posição 8?",
  Board,
  Options,
};

export default Q4;