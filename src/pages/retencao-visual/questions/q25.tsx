// questions/q25.tsx
import * as React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q25.png";

/* =================== Cubo (SVG P&B com texturas) =================== */

type Face = "top" | "left" | "right";
type Slash = "/" | "\\";
type MarkerPos = "top" | "inf-esq" | "inf-dir";

function polyStr(pts: Array<[number, number]>) {
  return pts.map((p) => p.join(",")).join(" ");
}

function Cube({
  blank = "right",
  density = 3,
  dirs = { top: "\\", left: "/", right: "\\" } as Record<Face, Slash>,
  marker = "top",
  size = 128,
}: {
  blank?: Face;
  density?: number; // nº de linhas por face
  dirs?: Record<Face, Slash>;
  marker?: MarkerPos;
  size?: number;
}) {
  const uid = React.useId();

  // Geometria base (viewBox 100x100)
  const pts = {
    top: [
      [50, 18],
      [82, 34],
      [50, 50],
      [18, 34],
    ] as Array<[number, number]>,
    left: [
      [18, 34],
      [50, 50],
      [50, 82],
      [18, 66],
    ] as Array<[number, number]>,
    right: [
      [82, 34],
      [50, 50],
      [50, 82],
      [82, 66],
    ] as Array<[number, number]>,
  };

  const bounds = {
    top: { x1: 18, y1: 18, x2: 82, y2: 50, cx: 50, cy: 34 },
    left: { x1: 18, y1: 34, x2: 50, y2: 82, cx: 34, cy: 58 },
    right: { x1: 50, y1: 34, x2: 82, y2: 82, cx: 66, cy: 58 },
  };

  const vertices = { top: [50, 18], "inf-esq": [18, 66], "inf-dir": [82, 66] } as const;
  const mpos = vertices[marker];

  const clipTopId = `clipTop-${uid}`;
  const clipLeftId = `clipLeft-${uid}`;
  const clipRightId = `clipRight-${uid}`;

  const maskTopId = `maskTop-${uid}`;
  const maskLeftId = `maskLeft-${uid}`;
  const maskRightId = `maskRight-${uid}`;

  const markPatId = `markPat-${uid}`;

  // Gera as listras (com compactação nas laterais para “aparentar” mais densas)
  function Hatch({ face }: { face: Face }) {
    if (blank === face) return null;
    const b = bounds[face];
    const n = density;

    const pack = face === "left" || face === "right" ? 0.62 : 1.0; // laterais “mais próximas”
    const range = (b.y2 - b.y1) * pack;
    const startY = b.cy - range / 2;
    const step = range / (n + 1);

    const innerInset = face === "top" ? 18 : 0; // topo mais curto
    const overshoot = face === "top" ? 0 : 8; // laterais com leve sobra
    const cap = face === "top" ? "butt" : "round";

    const lines = Array.from({ length: n }, (_, i) => {
      const y = startY + step * (i + 1);
      const x1 = face === "top" ? b.x1 + innerInset : b.x1 - overshoot;
      const x2 = face === "top" ? b.x2 - innerInset : b.x2 + overshoot;
      // dash por face para diferenciar no P&B
      const dash =
        face === "top" ? undefined : face === "left" ? "3 3" : "1 5";

      return (
        <line
          key={i}
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke="#111827"
          strokeWidth={3}
          strokeLinecap={cap as any}
          vectorEffect="non-scaling-stroke"
          strokeDasharray={dash}
          {...(face === "top" ? { strokeOpacity: 0.9 } : {})}
        />
      );
    });

    const angle = dirs[face] === "/" ? 45 : -45;
    const clipId = face === "top" ? clipTopId : face === "left" ? clipLeftId : clipRightId;
    const maskId = face === "top" ? maskTopId : face === "left" ? maskLeftId : maskRightId;

    return (
      <g
        clipPath={`url(#${clipId})`}
        mask={`url(#${maskId})`}
        transform={`rotate(${angle} ${b.cx} ${b.cy})`}
      >
        {lines}
      </g>
    );
  }

  return (
    <div style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width="100%" height="100%" role="img" aria-label="cubo">
        <defs>
          <clipPath id={clipTopId}>
            <polygon points={polyStr(pts.top)} />
          </clipPath>
          <clipPath id={clipLeftId}>
            <polygon points={polyStr(pts.left)} />
          </clipPath>
          <clipPath id={clipRightId}>
            <polygon points={polyStr(pts.right)} />
          </clipPath>

          {/* Máscaras para não cobrir o marcador */}
          <mask id={maskTopId}>
            <rect x="0" y="0" width="100" height="100" fill="white" />
            {marker === "top" && <circle cx={mpos[0]} cy={mpos[1]} r={6} fill="black" />}
          </mask>
          <mask id={maskLeftId}>
            <rect x="0" y="0" width="100" height="100" fill="white" />
            {marker === "inf-esq" && <circle cx={mpos[0]} cy={mpos[1]} r={6} fill="black" />}
          </mask>
          <mask id={maskRightId}>
            <rect x="0" y="0" width="100" height="100" fill="white" />
            {marker === "inf-dir" && <circle cx={mpos[0]} cy={mpos[1]} r={6} fill="black" />}
          </mask>

          {/* Padrão do marcador (xadrezinho diagonal) */}
          <pattern id={markPatId} patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="#fff" />
            <path d="M0,4 L4,0" stroke="#111" strokeWidth={0.9} />
          </pattern>
        </defs>

        {/* Faces (contorno P&B) */}
        <polygon points={polyStr(pts.top)} fill="#fff" stroke="#111827" strokeWidth={1.2} />
        <polygon points={polyStr(pts.left)} fill="#fff" stroke="#111827" strokeWidth={1.2} />
        <polygon points={polyStr(pts.right)} fill="#fff" stroke="#111827" strokeWidth={1.2} />

        {/* Hachuras por face */}
        <Hatch face="left" />
        <Hatch face="right" />
        <Hatch face="top" />

        {/* Marcador */}
        <circle
          cx={mpos[0]}
          cy={mpos[1]}
          r={5.2}
          fill={`url(#${markPatId})`}
          stroke="#111827"
          strokeWidth={1.2}
        />
      </svg>
    </div>
  );
}

/* =================== Regras da questão =================== */
// Colunas: qual face fica vazia + direção das listras
const colSpec = [
  { blank: "top" as Face, dirs: { top: "/", left: "/", right: "\\" } as Record<Face, Slash> },
  { blank: "left" as Face, dirs: { top: "/", left: "/", right: "\\" } as Record<Face, Slash> },
  { blank: "right" as Face, dirs: { top: "\\", left: "/", right: "\\" } as Record<Face, Slash> },
];
// Linhas: densidade 2, 3, 4
const rowSpec = [{ density: 2 }, { density: 3 }, { density: 4 }];

// Movimento do marcador por linha (ciclo base) — L1 +0, L2 +1, L3 +2
const baseCycle: MarkerPos[] = ["top", "inf-esq", "inf-dir"];
function getMarker(r: number, c: number): MarkerPos {
  return baseCycle[(c + r) % baseCycle.length];
};

const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[900px]">
      <img
        src={boardImg}
        alt="Matriz 3×3 de polígonos com satélites; posição 6 faltando"
        className="w-full h-auto select-none"
        sizes="(max-width: 740px) 100vw, 900px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);
/* =================== Alternativas (A–F) =================== */
// Especificação correta para B3 (r=1,c=2)
const TRUE_SPEC = {
  ...rowSpec[1],
  ...colSpec[2],
  marker: getMarker(1, 2), // → "top"
};

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const items: { key: OptionKey; correct?: boolean; spec: React.ComponentProps<typeof Cube> }[] = [
    { key: "A", spec: { ...TRUE_SPEC, density: 4 } }, // densidade errada
    { key: "B", spec: { ...TRUE_SPEC, marker: "inf-esq" } }, // marcador errado
    {
      key: "C",
      spec: { ...rowSpec[1], ...colSpec[1], marker: getMarker(1, 1) }, // coluna errada
    },
    { key: "D", spec: { ...TRUE_SPEC, dirs: { top: "/", left: "\\", right: "\\" } } }, // direções erradas
    { key: "E", spec: { ...TRUE_SPEC }, correct: true }, // ✅ correta
    { key: "F", spec: { ...TRUE_SPEC, dirs: { top: "/", left: "/", right: "\\" } } }, // topo invertido
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
            <Cube
              blank={o.spec.blank as Face}
              density={o.spec.density as number}
              dirs={o.spec.dirs as Record<Face, Slash>}
              marker={o.spec.marker as MarkerPos}
              size={116}
            />
          </div>
        </button>
      ))}
    </div>
  );
};

/* =================== Spec exportado =================== */
const Q25: QuestionSpec = {
  id: 25,
  prompt: "Qual alternativa completa logicamente a posição 6?",
  Board,
  Options,
};

export default Q25;
