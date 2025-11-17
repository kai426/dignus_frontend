import * as React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q30.png";

/* =================== Tipos & helpers =================== */
type Mirror = "none" | "h" | "v";
type Tri = "none" | "P" | "M" | "G";

type TileCfg = {
  row: 0 | 1 | 2;   // 0:A, 1:B, 2:C
  col: 0 | 1 | 2;   // 0..2
  angle: 0 | 90 | 180;
  mirror: Mirror;
  tri: Tri;
  bonus: boolean;
};

const ANGLES: Record<0 | 1 | 2, 0 | 90 | 180> = { 0: 0, 1: 90, 2: 180 };

/* =================== SVG do tile =================== */
function Tile30({ cfg, size = "lg" }: { cfg: TileCfg; size?: "lg" | "sm" }) {
  const side = size === "sm" ? 96 : 110;

  const drawDiagonal = (row: number, col: number) => {
    if (col > 1) return null; // só colunas 0 e 1
    const even = ((row + col) % 2) === 0; // par => "\"
    const props = {
      stroke: "#111",
      strokeWidth: 2,
      strokeLinecap: "round" as const,
    };
    return even ? (
      <line x1={18} y1={18} x2={92} y2={92} {...props} />
    ) : (
      <line x1={18} y1={92} x2={92} y2={18} {...props} />
    );
  };

  const drawDot = (col: number) =>
    col === 0 ? <circle cx={32} cy={80} r={3.4} fill="#111" /> : null;

  const drawL = (angle: number, mirror: Mirror) => {
    const sx = mirror === "h" ? -1 : 1;
    const sy = mirror === "v" ? -1 : 1;
    const segProps = {
      stroke: "#111",
      strokeWidth: 5,
      strokeLinecap: "round" as const,
    };
    return (
      <g transform={`translate(55,55) rotate(${angle}) scale(${sx}, ${sy})`}>
        <line x1={0} y1={-25} x2={0} y2={0} {...segProps} />
        <line x1={0} y1={0} x2={25} y2={0} {...segProps} />
      </g>
    );
  };

  const drawTri = (t: Tri) => {
    if (t === "none") return null;
    const sizes: Record<Exclude<Tri, "none">, number> = { P: 10, M: 14, G: 18 };
    const s = sizes[t as Exclude<Tri, "none">];
    const cx = 78,
      cy = 30;
    const pts = `${cx},${cy - s} ${cx + s},${cy + s * 0.8} ${cx - s},${cy + s * 0.8}`;
    return <polygon points={pts} fill="#111" />;
  };

  const drawBonus = (has: boolean) =>
    has ? <rect x={18} y={20} width={8} height={8} fill="none" stroke="#111" strokeWidth={1.5} /> : null;

  return (
    <svg
      viewBox="0 0 110 110"
      width={side}
      height={side}
      aria-hidden
      style={{ width: side, height: side }}
    >
      {/* diagonal por coluna + paridade */}
      {drawDiagonal(cfg.row, cfg.col)}
      {/* ponto apenas coluna 0 */}
      {drawDot(cfg.col)}
      {/* L base (ângulo por coluna) + espelho por linha */}
      {drawL(cfg.angle, cfg.mirror)}
      {/* triângulo */}
      {drawTri(cfg.tri)}
      {/* bônus linha 3 */}
      {drawBonus(cfg.bonus)}
    </svg>
  );
}

/* =================== Board (3×3) =================== */
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

/* =================== Opções (3×2) =================== */
const CORRECT: OptionKey = "B";
// Solução (C2): espelho vertical de A2 (angle=90) + triângulo grande + bônus
const SOL: TileCfg = { row: 2, col: 1, angle: ANGLES[1], mirror: "v", tri: "G", bonus: true };

const BUILD: Record<OptionKey, TileCfg> = {
  A: { row: 2, col: 1, angle: ANGLES[1], mirror: "v", tri: "M", bonus: true },  // tri errado
  B: SOL,                                                                         // ✅ correta
  C: { row: 2, col: 1, angle: ANGLES[1], mirror: "h", tri: "G", bonus: true },   // espelho errado
  D: { row: 2, col: 0, angle: ANGLES[1], mirror: "v", tri: "G", bonus: true },   // coluna errada (teria ponto)
  E: { row: 2, col: 2, angle: ANGLES[1], mirror: "v", tri: "G", bonus: true },   // coluna errada (sem diagonal)
  F: { row: 2, col: 1, angle: ANGLES[0], mirror: "v", tri: "G", bonus: true },   // ângulo errado
};

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[880px] mx-auto">
        {(["A", "B", "C", "D", "E", "F"] as OptionKey[]).map((k) => {
          const isSel = selected === k;
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
              <Tile30 cfg={BUILD[k]} size="sm" />
              <span className="sr-only">
                {k === CORRECT ? "Resposta correta" : "Resposta incorreta"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* =================== Spec =================== */
const Q30: QuestionSpec = {
  id: 30,
  prompt: "Qual alternativa completa logicamente a posição 8?",
  Board,
  Options,
};

export default Q30;
