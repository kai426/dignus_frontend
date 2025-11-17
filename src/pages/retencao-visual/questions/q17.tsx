// q17.tsx
import React, { useId } from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types"; 
import type { OptionKey } from "@/components/options";       
import boardImg from "@/assets/retencao-visual/q17.png";      

/* ===== Helpers de grade 3×3 ===== */
type Grid3 = 0 | 1;
type G = Grid3[][]; // 3x3

const mirrorH = (g: G): G => g.map((row) => row.slice().reverse());
const transpose = (g: G): G => g[0].map((_, c) => g.map((row) => row[c])) as G;
const mirrorV = (g: G): G => g.slice().reverse() as G;
const OR = (a: G, b: G): G => a.map((row, r) => row.map((v, c) => ((v || b[r][c]) ? 1 : 0) as Grid3)) as G;
const invert = (g: G): G => g.map((row) => row.map((v) => (v ? 0 : 1) as Grid3)) as G;

/** Desenha o “tabuleiro” 3×3 dentro de uma célula (usa somente inline SVG, sem estilos novos). */
function MiniBoard({
  grid,
  col,
  box = 110,                 // padrão: 110 (como estava)
}: { grid: G; col: 0 | 1 | 2; box?: number }) {
  const dotsId = useId();
  const hatchId = useId();

  const bgFill =
    col === 0 ? "#fff" : col === 1 ? `url(#dots-${dotsId})` : `url(#hatch-${hatchId})`;

  // --- dimensões proporcionais ao box ---
  const BASE = 110;
  const k = box / BASE;
  const n = 3;
  const size = 22 * k;
  const gap  =  6 * k;
  const total = n * size + (n - 1) * gap;
  const off = (box - total) / 2;

  return (
    <svg viewBox={`0 0 ${box} ${box}`} width={box} height={box} aria-hidden="true">
      <defs>
        <pattern id={`dots-${dotsId}`} patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#fff" />
          <circle cx="2" cy="2" r="1.2" fill="#b7c0c9" />
        </pattern>
        <pattern id={`hatch-${hatchId}`} patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#fff" />
          <path d="M0,8 L8,0" stroke="#c4cbd2" strokeWidth="1.2" />
        </pattern>
      </defs>

      {/* fundo + moldura */}
      <rect x="0" y="0" width={box} height={box} rx={12 * k} fill={bgFill} stroke="#e5e7eb" />
      <rect x={2 * k} y={2 * k} width={box - 4 * k} height={box - 4 * k} rx={10 * k} fill="none" stroke="#d1d5db" />

      {/* quadradinhos ativos */}
      {grid.map((row, r) =>
        row.map((v, c) =>
          v ? (
            <rect
              key={`${r}-${c}`}
              x={off + c * (size + gap)}
              y={off + r * (size + gap)}
              width={size}
              height={size}
              rx={4 * k}
              fill="#111"
            />
          ) : null
        )
      )}
    </svg>
  );
}

/* ===== Seeds e derivações (regras por coluna) ===== */
// Coluna 1 (A1, B1, C1)
const B1: G = [
  [1, 0, 0],
  [0, 1, 1],
  [0, 0, 0],
];

const B2_SOL = mirrorH(B1); // ← falta na matriz (posição 5)
const B3 = OR(B1, B2_SOL);

/* ===================== BOARD ===================== */
const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[720px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 com a posição 5 faltando (regras de espelho e OR por coluna)"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 720px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ===================== OPTIONS ===================== */
/** Alternativas: correta = C (espelho lateral de B1). */
const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const KEYS = ["A", "B", "C", "D", "E", "F"] as OptionKey[];

  const ALTS: Record<OptionKey, G> = {
    A: transpose(B1), // transposição (distrator)
    B: mirrorV(B1),   // espelho vertical (topo↔base)
    C: B2_SOL,        // ✅ correta: espelho lateral de B1 (coluna 2)
    D: B3,            // OR(B1,B2) = coluna 3 (distrator)
    E: invert(B1),    // “negativo” (distrator)
    F: (() => {       // quase certo (um pixel trocado)
      const g = B2_SOL.map((r) => r.slice()) as G;
      g[1][0] = g[1][0] ? 0 : 1;
      return g;
    })(),
  };

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[720px] mx-auto">
      {KEYS.map((k) => (
        <button
          key={k}
          onClick={() => onSelect(k)}
          className={["rv-option", selected === k ? "rv-option--active" : "rv-option--idle"].join(" ")}
          aria-label={`Alternativa ${k}`}
        >
          <span className="rv-option-label">{k})</span>
          <div className="rv-option-content">
            {/* As opções sempre mostram a “coluna 2”, então usamos col={1} para o fundo padronizado */}
            <MiniBoard grid={ALTS[k]} col={1} />
          </div>
        </button>
      ))}
    </div>
  );
};

/* ===================== SPEC ===================== */
const Q17: QuestionSpec = {
  id: 17,
  prompt: "Qual alternativa completa logicamente a posição 5?",
  Board,
  Options,
};

export default Q17;
