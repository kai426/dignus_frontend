import * as React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q28.png";

/* ======================= Tile (SVG) ======================= */
type Corners = { tl: boolean; tr: boolean; br: boolean; bl: boolean };
type FillKind = "solid" | "dotted" | "hatched";

function Tile28({
  corners,
  fill,
  dot = false,
  size = "lg",
}: {
  corners: Corners;
  fill: FillKind;
  dot?: boolean;
  size?: "lg" | "sm";
}) {
  const uid = React.useId();
  const W = 104;
  const side = size === "sm" ? 96 : W;

  return (
    <svg
      viewBox={`0 0 ${W} ${W}`}
      width={side}
      height={side}
      role="img"
      aria-hidden
      style={{ borderRadius: 12, boxShadow: "inset 0 0 0 1px #e5e7eb" }}
    >
      <defs>
        {/* pontilhado */}
        <pattern
          id={`pat-dots-${uid}`}
          patternUnits="userSpaceOnUse"
          width="8"
          height="8"
        >
          <circle cx="2" cy="2" r="1.2" fill="#b7c0c9" />
        </pattern>
        {/* hachurado */}
        <pattern
          id={`pat-hatch-${uid}`}
          patternUnits="userSpaceOnUse"
          width="8"
          height="8"
        >
          <path d="M0,8 L8,0" stroke="#c4cbd2" strokeWidth="1.3" />
        </pattern>
      </defs>

      {/* fundo por coluna */}
      <rect
        x="0"
        y="0"
        width={W}
        height={W}
        rx="12"
        fill={
          fill === "solid"
            ? "#ffffff"
            : fill === "dotted"
            ? `url(#pat-dots-${uid})`
            : `url(#pat-hatch-${uid})`
        }
        stroke="#e5e7eb"
      />
      <rect
        x="2"
        y="2"
        width={W - 4}
        height={W - 4}
        rx="10"
        fill="none"
        stroke="#d1d5db"
      />

      {/* triângulos de canto (P&B) */}
      {corners.tl && (
        <polygon points="10,10 32,10 10,32" fill="#111" />
      )}
      {corners.tr && (
        <polygon points="94,10 72,10 94,32" fill="#111" />
      )}
      {corners.br && (
        <polygon points="94,94 72,94 94,72" fill="#111" />
      )}
      {corners.bl && (
        <polygon points="10,94 32,94 10,72" fill="#111" />
      )}

      {/* ponto central apenas quando solicitado */}
      {dot && <circle cx="52" cy="52" r="6.6" fill="#111" />}
    </svg>
  );
}

/* ======================= Lógica da questão ======================= */

const xorCorners = (a: Corners, b: Corners): Corners => ({
  tl: !!(a.tl !== b.tl),
  tr: !!(a.tr !== b.tr),
  br: !!(a.br !== b.br),
  bl: !!(a.bl !== b.bl),
});

const B1: Corners = { tl: false, tr: true, br: true, bl: true }; // 3 cantos
const B3: Corners = { tl: true, tr: false, br: false, bl: true }; // 2 cantos

const B2_corners = xorCorners(B1, B3); // {TL,TR,BR}

/* ======================= Board ======================= */
const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[960px]">
      <img
        src={boardImg}
        alt="Sequência 3×3 de mini-tabuleiros; célula 9 em falta."
        className="w-full h-auto select-none"
        sizes="(max-width: 640px) 100vw, 960px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ======================= Opções (3×2) ======================= */
const CORRECT_KEY: OptionKey = "D";

const ALTS: Record<
  OptionKey,
  { corners: Corners; fill: FillKind; dot: boolean }
> = {
  A: { corners: B2_corners, fill: "dotted", dot: true }, // cantos ok, mas COM ponto (errado)
  B: { corners: { tl: true, tr: false, br: true, bl: false }, fill: "dotted", dot: false }, // cantos errados
  C: { corners: B2_corners, fill: "hatched", dot: false }, // padrão de coluna errado
  D: { corners: B2_corners, fill: "dotted", dot: false }, // ✅ correta
  E: { corners: { tl: true, tr: true, br: true, bl: true }, fill: "dotted", dot: false }, // 4 cantos (não é XOR)
  F: { corners: { tl: false, tr: true, br: true, bl: true }, fill: "dotted", dot: true }, // repete B1 (e com ponto)
};

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[860px] mx-auto">
        {(["A", "B", "C", "D", "E", "F"] as OptionKey[]).map((k) => {
          const isSel = selected === k;
          const spec = ALTS[k];
          return (
            <button
              key={k}
              onClick={() => onSelect(k)}
              aria-label={`Alternativa ${k}`}
              className={[
                "rv-option",
                isSel ? "rv-option--active" : "rv-option--idle",
              ].join(" ")}
            >
              <span className="rv-option-label">{k})</span>
              <Tile28
                corners={spec.corners}
                fill={spec.fill}
                dot={spec.dot}
                size="sm"
              />
              <span className="sr-only">
                {k === CORRECT_KEY ? "Resposta correta" : "Resposta incorreta"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ======================= Spec ======================= */
const Q28: QuestionSpec = {
  id: 28,
  prompt: "Qual alternativa completa logicamente a posição 5?",
  Board,
  Options,
};

export default Q28;
