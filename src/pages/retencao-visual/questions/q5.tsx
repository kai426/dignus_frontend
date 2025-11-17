import React, { useId } from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q5.png"

/* --- ícones P&B (SVG pequeno) --- */
type PatternKind = "stripes" | "dots" | "grid";
type ShapeKind = "triangle" | "square" | "star";

function Shape({
  shape,
  pattern,
  size,
}: {
  shape: ShapeKind;
  pattern: PatternKind;
  size?: number; // passe nas opções; omita no board
}) {
  const pid = useId();
  const patternId = `${pattern}-${pid}`;

  // Wrapper só para isolar o caso de tamanho fixo nas opções
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    size ? (
      <div style={{ width: size, height: size }}>{children}</div>
    ) : (
      <div className="w-full h-full">{children}</div>
    );

  return (
    <Wrapper>
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        aria-hidden
        focusable="false"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }} // evita desalinhamento por baseline
      >
        <defs>
          {pattern === "stripes" && (
            <pattern id={patternId} patternUnits="userSpaceOnUse" width="6" height="6">
              <rect width="6" height="6" fill="#fff" />
              <path d="M0,6 L6,0" stroke="#111" strokeWidth="1" />
            </pattern>
          )}
          {pattern === "dots" && (
            <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8">
              <rect width="8" height="8" fill="#fff" />
              <circle cx="2.5" cy="2.5" r="1.2" fill="#111" />
            </pattern>
          )}
          {pattern === "grid" && (
            <pattern id={patternId} patternUnits="userSpaceOnUse" width="8" height="8">
              <rect width="8" height="8" fill="#fff" />
              <path d="M0,0 L0,8 M0,0 L8,0" stroke="#111" strokeWidth="1" />
            </pattern>
          )}
        </defs>

        {shape === "triangle" && (
          <polygon
            points="50,18 82,78 18,78"
            fill={`url(#${patternId})`}
            stroke="#111"
            strokeWidth="2"
          />
        )}

        {shape === "square" && (
          <rect
            x="22"
            y="22"
            width="56"
            height="56"
            rx="10"
            fill={`url(#${patternId})`}
            stroke="#111"
            strokeWidth="2"
          />
        )}

        {shape === "star" && (
          <polygon
            points="50,15 61,38 87,38 66,55 74,82 50,67 26,82 34,55 13,38 39,38"
            fill={`url(#${patternId})`}
            stroke="#111"
            strokeWidth="2"
          />
        )}
      </svg>
    </Wrapper>
  );
};

/* --- tabuleiro 3x3 (conteúdo apenas) --- */
const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[720px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 com a posição 6 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 720px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);


/* --- alternativas (A é a correta: ★ com listras) --- */
const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const opts: { key: OptionKey; content: React.ReactNode }[] = [
    { key: "A", content: <Shape shape="star"     pattern="stripes" size={56} /> }, // ✔
    { key: "B", content: <Shape shape="triangle" pattern="dots"    size={56} /> },
    { key: "C", content: <Shape shape="square"   pattern="grid"    size={56} /> },
    { key: "D", content: <Shape shape="star"     pattern="dots"    size={56} /> },
    { key: "E", content: <Shape shape="triangle" pattern="stripes" size={56} /> },
    { key: "F", content: <Shape shape="square"   pattern="dots"    size={56} /> },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[720px] mx-auto">
      {opts.map(o => (
        <button
          key={o.key}
          onClick={() => onSelect(o.key)}
          className={["rv-option", selected===o.key ? "rv-option--active" : "rv-option--idle"].join(" ")}
          aria-label={`Alternativa ${o.key}`}
        >
          <span className="rv-option-label">{o.key})</span>
          <div className="rv-option-content">{o.content}</div>
        </button>
      ))}
    </div>
  );
};

const Q5: QuestionSpec = {
  id: 5,
  prompt: "Qual alternativa completa logicamente a posição 6?",
  Board,
  Options,
};
export default Q5;