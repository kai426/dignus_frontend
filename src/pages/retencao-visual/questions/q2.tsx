import * as React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q2.png"

/* =====================================================
   SVG helpers
   ===================================================== */
type Mirror = "none" | "h" | "v";
type Stripe = "slash" | "backslash";

/** Bandeira listrada com ponto — usada no par de baixo */
const Flag: React.FC<{
  mirror?: Mirror;
  rotate?: 0 | 90 | 180;
  stripe?: Stripe; // orientação das listras
  size?: number;
}> = ({ mirror = "none", rotate = 0, stripe = "slash", size = 92 }) => {
  const uid = React.useId().replace(/:/g, "");
  const patId = `pat_${stripe}_${uid}`;

  const mirrorTx =
    mirror === "h"
      ? "scale(-1,1) translate(-100,0)"
      : mirror === "v"
      ? "scale(1,-1) translate(0,-100)"
      : "";

  const rotTx =
    rotate === 0
      ? ""
      : `translate(50,50) rotate(${rotate}) translate(-50,-50)`;

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
      <defs>
        <pattern id={patId} patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#fff" />
          {/* slash:  "/"  → M0,8 L8,0   |  backslash "\" → M0,0 L8,8 */}
          <path
            d={stripe === "slash" ? "M0,8 L8,0" : "M0,0 L8,8"}
            stroke="#111"
            strokeWidth="3"
          />
        </pattern>
      </defs>
      <g transform={rotTx}>
        <g transform={`translate(8,8) ${mirrorTx}`}>
          <rect x="12" y="16" width="8" height="68" rx="4" fill="#111" />
          <path
            d="M20,20 L68,26 L52,42 L68,58 L20,64 Z"
            fill={`url(#${patId})`}
            stroke="#111"
            strokeWidth="2"
          />
          <circle cx="70" cy="42" r="4" fill="#111" stroke="#555" strokeWidth="1" />
        </g>
      </g>
    </svg>
  );
};

const Board: React.FC = () => {
  return (
    <div className="flex justify-center my-6">
      <figure className="w-full max-w-[720px]">
        <img
          src={boardImg}
          alt="Matriz 2x2 do teste de padrões, célula 4 faltando"
          className="w-full h-auto"
          sizes="(max-width: 640px) 100vw, 720px"
          loading="eager"
          decoding="async"
        />
      </figure>
    </div>
  );
};

/* =====================================================
   Opções
   - Correta = D (espelho horizontal com listras “\”)
   ===================================================== */
const CORRECT: OptionKey = "D";

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const mini = 80;

  const items: { key: OptionKey; node: React.ReactNode; aria: string }[] = [
    // A) igual ao 3 (não espelha)
    {
      key: "A",
      node: <Flag stripe="slash" size={mini} />,
      aria: "A: igual ao 3 (não espelha)",
    },
    // B) espelho vertical
    {
      key: "B",
      node: <Flag mirror="v" stripe="slash" size={mini} />,
      aria: "B: espelho vertical",
    },
    // C) espelho horizontal, mas listras não invertidas (erradas)
    {
      key: "C",
      node: <Flag mirror="h" stripe="slash" size={mini} />,
      aria: "C: espelho horizontal com listras não invertidas",
    },
    // D) ✅ espelho horizontal correto (listras invertidas para “\”)
    {
      key: "D",
      node: <Flag mirror="h" stripe="backslash" size={mini} />,
      aria: "D: espelho horizontal correto",
    },
    // E) rotação 180°
    {
      key: "E",
      node: <Flag rotate={180} stripe="slash" size={mini} />,
      aria: "E: rotação 180 graus",
    },
    // F) rotação 90°
    {
      key: "F",
      node: <Flag rotate={90} stripe="slash" size={mini} />,
      aria: "F: rotação 90 graus",
    },
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[720px] mx-auto">
        {items.map(({ key, node, aria }) => {
          const isSel = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              aria-label={aria}
              className={[
                "rv-option",
                isSel ? "rv-option--active" : "rv-option--idle",
              ].join(" ")}
            >
              <span className="rv-option-label">{key})</span>
              <div className="rv-option-content">{node}</div>
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

/* =====================================================
   Spec
   ===================================================== */
const Q2: QuestionSpec = {
  id: 2,
  prompt: "Qual alternativa completa logicamente o quadrante 4?",
  Board,
  Options,
};

export default Q2;
