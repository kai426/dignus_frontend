import * as React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q24.png";

function polygonPoints(
  cx: number,
  cy: number,
  R: number,
  sides: number,
  rotationDeg = 0
) {
  const pts: Array<[number, number]> = [];
  const rot = ((rotationDeg - 90) * Math.PI) / 180;
  for (let i = 0; i < sides; i++) {
    const ang = rot + i * ((2 * Math.PI) / sides);
    pts.push([cx + R * Math.cos(ang), cy + R * Math.sin(ang)]);
  }
  return pts.map((p) => p.join(",")).join(" ");
}

function starPoints(
  cx: number,
  cy: number,
  spikes = 5,
  outerR = 10,
  innerR = 4.2,
  rotationDeg = 0
) {
  const pts: Array<[number, number]> = [];
  const step = Math.PI / spikes;
  const rot = ((rotationDeg - 90) * Math.PI) / 180;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const ang = rot + i * step;
    pts.push([cx + Math.cos(ang) * r, cy + Math.sin(ang) * r]);
  }
  return pts.map((p) => p.join(",")).join(" ");
}
const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
};

type Pattern = "stripes" | "grid";

function Piece({
  sides,
  sats,
  pattern,
  rotDeg,
  star,
  size = 104,
}: {
  sides: number;
  sats: number;
  pattern: Pattern;
  rotDeg: number;
  star: boolean;
  size?: number;
}) {
  const uid = React.useId();
  const patId = `${uid}-${pattern}`;
  const polygon = polygonPoints(50, 50, 28, sides, rotDeg);

  // satélites: posições equidistantes no raio 40
  const satsNodes = Array.from({ length: sats }, (_, i) => {
    const ang = (-90 + i * (360 / sats)) * (Math.PI / 180);
    const x = 50 + Math.cos(ang) * 40;
    const y = 50 + Math.sin(ang) * 40;
    return <circle key={i} cx={x} cy={y} r={4} fill="#111" />;
  });

  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
        <defs>
          {pattern === "stripes" ? (
            <pattern id={patId} patternUnits="userSpaceOnUse" width="14" height="14">
              <rect width="14" height="14" fill="#fff" />
              <path d="M0,14 L14,0" stroke="#555" strokeWidth={1.4} strokeOpacity={0.85} />
            </pattern>
          ) : (
            <pattern id={patId} patternUnits="userSpaceOnUse" width="14" height="14">
              <rect width="14" height="14" fill="#fff" />
              <path
                d="M0,0 L0,14 M0,0 L14,0"
                stroke="#555"
                strokeWidth={1.2}
                strokeOpacity={0.85}
              />
            </pattern>
          )}
        </defs>

        <polygon
          points={polygon}
          fill={`url(#${patId})`}
          stroke="#111"
          strokeWidth={2}
          shapeRendering="geometricPrecision"
        />
        {satsNodes}
        {star && <polygon points={starPoints(50, 50, 5, 10, 4.2)} fill="#111" />}
      </svg>
    </div>
  );
}

function cfgFor(r: number, c: number) {
  const linha = r + 1;
  const coluna = c + 1;
  const sides = [3, 4, 5][r];
  const sats = [1, 2, 3][c];
  const rotDeg = 30 * (linha - 1) + 15 * (coluna - 1);
  const star = isPrime(linha + coluna);
  const pattern: Pattern = (sides * sats) % 2 === 1 ? "stripes" : "grid";
  return { sides, sats, rotDeg, pattern, star };
};

const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[900px]">
      <img
        src={boardImg}
        alt="Matriz 3×3 de polígonos com satélites; posição 6 faltando"
        className="w-full h-auto select-none"
        sizes="(max-width: 640px) 100vw, 900px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

const SOL = cfgFor(1, 2);

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const items: { key: OptionKey; correct?: boolean; cfg: Parameters<typeof Piece>[0] }[] = [
    { key: "A", cfg: { ...SOL, rotDeg: 75, star: false } }, 
    { key: "B", cfg: { ...SOL, pattern: "stripes" } },      
    { key: "C", cfg: { ...SOL }, correct: true },           
    { key: "D", cfg: { ...SOL, star: false } },             
    { key: "E", cfg: { ...SOL, sats: 2 } },               
    { key: "F", cfg: { ...SOL, sides: 5 } },                
  ];

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[720px] mx-auto">
      {items.map((o) => (
        <button
          key={o.key}
          onClick={() => onSelect(o.key)}
          className={["rv-option", selected === o.key ? "rv-option--active" : "rv-option--idle"].join(
            " "
          )}
          aria-label={`Alternativa ${o.key}`}
        >
          <span className="rv-option-label">{o.key})</span>
          <div className="rv-option-content">
            <Piece
              sides={o.cfg.sides}
              sats={o.cfg.sats}
              rotDeg={o.cfg.rotDeg}
              pattern={o.cfg.pattern as Pattern}
              star={!!(o.cfg as any).star}
              size={104}
            />
          </div>
        </button>
      ))}
    </div>
  );
};

/* =============== Spec exportado =============== */
const Q24: QuestionSpec = {
  id: 24,
  prompt: "Qual alternativa completa logicamente a posição 6?",
  Board,
  Options,
};

export default Q24;
