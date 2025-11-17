import React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q8.png";

/* ---------- Formas + Texturas (P&B) ---------- */

type Tex = "stripeA" | "dots" | "stripeB";
type Shp = "circle" | "square" | "triangle";

function texStyle(t: Tex): React.CSSProperties {
  const base = "#111";
  const pattern = "#fff";
  if (t === "stripeA") {
    return {
      background: `
        repeating-linear-gradient(45deg, ${pattern} 0 8px, transparent 8px 16px),
        ${base}
      `,
    };
  }
  if (t === "dots") {
    return {
      background: `
        radial-gradient(circle, ${pattern} 3.2px, transparent 3.3px) 0 0/14px 14px,
        ${base}
      `,
    };
  }
  // stripeB
  return {
    background: `
      repeating-linear-gradient(-45deg, ${pattern} 0 8px, transparent 8px 16px),
      ${base}
    `,
  };
}

function Shape({
  shape,
  tex,
  size = 86,
}: {
  shape: Shp;
  tex: Tex;
  size?: number;
}) {
  const common: React.CSSProperties = {
    width: size,
    height: size,
    overflow: "hidden",
    ...texStyle(tex),
  };
  if (shape === "circle") return <div style={{ ...common, borderRadius: "50%" }} aria-hidden />;

  if (shape === "square")
    return <div style={{ ...common, borderRadius: 12 }} aria-hidden />;

  // triangle
  return (
    <div
      aria-hidden
      style={{
        ...common,
        clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
      }}
    />
  );
}

/* ---------- Tabuleiro 3x3 ---------- */
const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[720px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 com a posição 9 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 720px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ---------- Alternativas (E é a correta: círculo + pontos) ---------- */
const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const mini = 62; // um pouco menor nas opções
  const opts: { key: OptionKey; content: React.ReactNode }[] = [
    { key: "A", content: <Shape shape="square"   tex="dots"    size={mini} /> },
    { key: "B", content: <Shape shape="circle"   tex="stripeA" size={mini} /> },
    { key: "C", content: <Shape shape="circle"   tex="stripeB" size={mini} /> },
    { key: "D", content: <Shape shape="triangle" tex="stripeB" size={mini} /> },
    { key: "E", content: <Shape shape="circle"   tex="dots"    size={mini} /> }, // ✔
    { key: "F", content: <Shape shape="square"   tex="stripeA" size={mini} /> },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[720px] mx-auto">
      {opts.map((o) => (
        <button
          key={o.key}
          onClick={() => onSelect(o.key)}
          className={["rv-option", selected === o.key ? "rv-option--active" : "rv-option--idle"].join(" ")}
          aria-label={`Alternativa ${o.key}`}
        >
          <span className="rv-option-label">{o.key})</span>
          <div className="rv-option-content">{o.content}</div>
        </button>
      ))}
    </div>
  );
};

const Q8: QuestionSpec = {
  id: 8,
  prompt: "Qual alternativa completa logicamente a posição 9?",
  Board,
  Options,
};

export default Q8;