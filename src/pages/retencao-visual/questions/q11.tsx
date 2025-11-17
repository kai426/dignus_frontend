import React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q11.png";

/* ===== SVGs (mesmos desenhos do HTML) ===== */
const Mini: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ width: 72, height: 72 }}>{children}</div>
);

/** 2 células conectadas (com “ponte”), opcional rotação e com/sem núcleos */
const ConnectedPair: React.FC<{ rotate?: number; showNuclei?: boolean }> = ({
  rotate = 0,
  showNuclei = true,
}) => (
  <svg viewBox="0 0 120 120">
    <g transform={`translate(60,60) rotate(${rotate})`}>
      <ellipse fill="none" stroke="#111" strokeWidth="2.6" cx="-8" cy="0" rx="22" ry="18" />
      <ellipse fill="none" stroke="#111" strokeWidth="2.6" cx="18" cy="4" rx="16" ry="13" />
      <path fill="none" stroke="#111" strokeWidth="2.2" d="M 0 -6 C 6 -2 7 2 4 7" />
      {showNuclei && (
        <>
          <circle cx="-10" cy="-2" r="3" fill="none" stroke="#111" strokeWidth="1.7" />
          <circle cx="19" cy="5" r="2.6" fill="none" stroke="#111" strokeWidth="1.7" />
        </>
      )}
    </g>
  </svg>
);

/** 2 células separadas (sem ponte), opcional rotação; normalmente com núcleos */
const SeparatedPair: React.FC<{ rotate?: number; showNuclei?: boolean }> = ({
  rotate = 0,
  showNuclei = true,
}) => (
  <svg viewBox="0 0 120 120">
    <g transform={`translate(60,60) rotate(${rotate})`}>
      <ellipse fill="none" stroke="#111" strokeWidth="2.6" cx="-18" cy="0" rx="16" ry="13" />
      <ellipse fill="none" stroke="#111" strokeWidth="2.6" cx="22" cy="2" rx="14" ry="11" />
      {showNuclei && (
        <>
          <circle cx="-18" cy="-2" r="2.6" fill="none" stroke="#111" strokeWidth="1.7" />
          <circle cx="22" cy="3" r="2.2" fill="none" stroke="#111" strokeWidth="1.7" />
        </>
      )}
    </g>
  </svg>
);

/* ===== Tabuleiro 3×3 (posição 8 faltando) ===== */
const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[880px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 com a posição 8 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 880px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ===== Alternativas (F é a correta) ===== */
const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const opts: { key: OptionKey; node: React.ReactNode }[] = [
    // A) única com 3 núcleos pequenos (distrator)
    {
      key: "A",
      node: (
        <Mini>
          <svg viewBox="0 0 120 120">
            <g transform="translate(60,60)">
              <ellipse fill="none" stroke="#111" strokeWidth="2.6" cx="0" cy="0" rx="28" ry="20" />
              <circle cx="-8" cy="-3" r="2.6" fill="none" stroke="#111" strokeWidth="1.7" />
              <circle cx="2" cy="2" r="2.6" fill="none" stroke="#111" strokeWidth="1.7" />
              <circle cx="10" cy="6" r="2.6" fill="none" stroke="#111" strokeWidth="1.7" />
            </g>
          </svg>
        </Mini>
      ),
    },
    // B) par separado (90°), sem núcleos
    { key: "B", node: <Mini><SeparatedPair rotate={90} showNuclei={false} /></Mini> },
    // C) única (90°) sem detalhes
    {
      key: "C",
      node: (
        <Mini>
          <svg viewBox="0 0 120 120">
            <g transform="translate(60,60) rotate(90)">
              <ellipse fill="none" stroke="#111" strokeWidth="2.6" cx="0" cy="0" rx="30" ry="22" />
            </g>
          </svg>
        </Mini>
      ),
    },
    // D) conectado (0°) sem núcleos
    { key: "D", node: <Mini><ConnectedPair showNuclei={false} /></Mini> },
    // E) três células pequenas (distrator)
    {
      key: "E",
      node: (
        <Mini>
          <svg viewBox="0 0 120 120">
            <g transform="translate(60,60)">
              <ellipse fill="none" stroke="#111" strokeWidth="2.6" cx="-22" cy="-6" rx="10" ry="8" />
              <ellipse fill="none" stroke="#111" strokeWidth="2.6" cx="0" cy="0" rx="10" ry="8" />
              <ellipse fill="none" stroke="#111" strokeWidth="2.6" cx="22" cy="6" rx="10" ry="8" />
            </g>
          </svg>
        </Mini>
      ),
    },
    // F) ✔ conectado (90°) com núcleos — SOLUÇÃO
    { key: "F", node: <Mini><ConnectedPair rotate={90} showNuclei /></Mini> },
  ];

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[880px] mx-auto">
      {opts.map((o) => (
        <button
          key={o.key}
          onClick={() => onSelect(o.key)}
          className={[
            "rv-option",
            selected === o.key ? "rv-option--active" : "rv-option--idle",
          ].join(" ")}
          aria-label={`Alternativa ${o.key}`}
        >
          <span className="rv-option-label">{o.key})</span>
          <div className="rv-option-content">{o.node}</div>
        </button>
      ))}
    </div>
  );
};

const Q11: QuestionSpec = {
  id: 11,
  prompt: "Qual alternativa completa logicamente a posição 8?",
  Board,
  Options,
};

export default Q11;