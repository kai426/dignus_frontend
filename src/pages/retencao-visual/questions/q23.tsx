import * as React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types"; 
import type { OptionKey } from "@/components/options";     
import boardImg from "@/assets/retencao-visual/q23.png";      

/* ===================== Target (P&B) ===================== */
type RingStyle = "hatch" | "dots";
type Projectile = "circle" | "square" | "triangle";

function Target({
  rings,
  projectiles,
  ringStyle,
  projectileShape,
  size = 104, // mantém o mesmo tamanho usado na 23 em HTML
}: {
  rings: number;
  projectiles: number;
  ringStyle: RingStyle;
  projectileShape: Projectile;
  size?: number;
}) {
  const id = React.useId(); // evita colisão de <pattern> entre instâncias
  const hatchId = `${id}-h`;
  const dotsId = `${id}-d`;

  // anéis concêntricos
  const maxR = 35;
  const ringNodes = Array.from({ length: rings }, (_, i) => {
    const k = rings - i;                       // maior → menor
    const r = (maxR / rings) * k;
    const fill = k % 2 === 1 ? `url(#${ringStyle === "hatch" ? hatchId : dotsId})` : "#fff";
    return <circle key={k} cx={50} cy={50} r={r} fill={fill} stroke="#374151" strokeWidth={1.5} />;
  });

  // projéteis (até 5 posições seguras)
  const pos = [
    { x: 15, y: 20 },
    { x: 85, y: 20 },
    { x: 15, y: 80 },
    { x: 85, y: 80 },
    { x: 50, y: 10 },
  ];
  const projNodes = Array.from({ length: Math.min(projectiles, 5) }, (_, i) => {
    const p = pos[i];
    if (projectileShape === "circle") {
      return <circle key={i} cx={p.x} cy={p.y} r={5} fill="#374151" />;
    }
    if (projectileShape === "square") {
      return <rect key={i} x={p.x - 4} y={p.y - 4} width={8} height={8} fill="#374151" />;
    }
    // triangle
    const pts = `${p.x},${p.y - 5} ${p.x - 4},${p.y + 3} ${p.x + 4},${p.y + 3}`;
    return <polygon key={i} points={pts} fill="#374151" />;
  });

  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
        <defs>
          <pattern id={hatchId} patternUnits="userSpaceOnUse" width="6" height="6">
            <path d="M0,6 L6,0" stroke="#111" strokeWidth="0.8" />
          </pattern>
          <pattern id={dotsId} patternUnits="userSpaceOnUse" width="6" height="6">
            <circle cx="1.5" cy="1.5" r="0.9" fill="#111" />
          </pattern>
        </defs>
        {ringNodes}
        <circle cx={50} cy={50} r={3} fill="#374151" />
        {projNodes}
      </svg>
    </div>
  );
};

const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[900px]">
      <img
        src={boardImg}
        alt="Matriz 3×3 de alvos com a posição 8 faltando"
        className="w-full h-auto select-none"
        sizes="(max-width: 640px) 100vw, 900px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

const SOLUTION = {
  rings: 4,
  projectiles: 2,
  ringStyle: "hatch" as RingStyle,
  projectileShape: "triangle" as Projectile,
};

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const opts: { key: OptionKey; correct?: boolean; cfg: Parameters<typeof Target>[0] }[] = [
    { key: "A", cfg: { rings: 4, projectiles: 2, ringStyle: "dots", projectileShape: "triangle" } },
    { key: "B", cfg: SOLUTION, correct: true }, // ✅
    { key: "C", cfg: { rings: 3, projectiles: 2, ringStyle: "hatch", projectileShape: "triangle" } },
    { key: "D", cfg: { rings: 4, projectiles: 3, ringStyle: "hatch", projectileShape: "triangle" } },
    { key: "E", cfg: { rings: 4, projectiles: 2, ringStyle: "hatch", projectileShape: "square" } },
    { key: "F", cfg: { rings: 4, projectiles: 1, ringStyle: "hatch", projectileShape: "triangle" } },
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
          {/* usa o mesmo tamanho do tabuleiro para evitar qualquer corte nas figuras */}
          <div className="rv-option-content">
            <Target {...o.cfg} size={104} />
          </div>
        </button>
      ))}
    </div>
  );
};

/* ===================== Spec ===================== */
const Q23: QuestionSpec = {
  id: 23,
  prompt: "Qual alternativa completa logicamente a posição 8?",
  Board,
  Options,
};

export default Q23;
