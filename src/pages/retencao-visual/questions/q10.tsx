import React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q10.png";

/* ---------- tipos ---------- */
type Corner = "TL" | "TR" | "BR" | "BL";
type Hatch = "slash" | "back";
type TileSpec = { cuts: Corner[]; dot: Corner; hatch: Hatch };

/* ---------- desenho de uma peça (SVG), igual ao HTML ---------- */
const Tile: React.FC<{ spec: TileSpec; size?: "board" | "mini" }> = ({
  spec,
  size = "board",
}) => {
  const isMini = size === "mini";
  const W = isMini ? 92 : 110;
  const H = W;
  const pad = isMini ? 10 : 12;
  const sw = isMini ? 3 : 3.6;
  const t = isMini ? 18 : 22;
  const dotR = isMini ? 6 : 7.5;
  const pid = React.useId().replace(/:/g, "_");

  const dpath = spec.hatch === "slash" ? "M0,10 L10,0" : "M0,0 L10,10";

  const dotPos: Record<Corner, [number, number]> = {
    TL: [pad + 12, pad + 12],
    TR: [W - pad - 12, pad + 12],
    BR: [W - pad - 12, H - pad - 12],
    BL: [pad + 12, H - pad - 12],
  };
  const [dx, dy] = dotPos[spec.dot];

  const cornerCut = (which: Corner) => {
    if (which === "TL")
      return (
        <>
          <polygon
            points={`${pad},${pad} ${pad + t},${pad} ${pad},${pad + t}`}
            fill="#fff"
          />
          <line
            x1={pad}
            y1={pad + t}
            x2={pad + t}
            y2={pad}
            stroke="#111"
            strokeWidth={sw}
          />
        </>
      );
    if (which === "TR")
      return (
        <>
          <polygon
            points={`${W - pad},${pad} ${W - pad - t},${pad} ${W - pad},${
              pad + t
            }`}
            fill="#fff"
          />
          <line
            x1={W - pad - t}
            y1={pad}
            x2={W - pad}
            y2={pad + t}
            stroke="#111"
            strokeWidth={sw}
          />
        </>
      );
    if (which === "BR")
      return (
        <>
          <polygon
            points={`${W - pad},${H - pad} ${W - pad - t},${H - pad} ${
              W - pad
            },${H - pad - t}`}
            fill="#fff"
          />
          <line
            x1={W - pad}
            y1={H - pad - t}
            x2={W - pad - t}
            y2={H - pad}
            stroke="#111"
            strokeWidth={sw}
          />
        </>
      );
    // BL
    return (
      <>
        <polygon
          points={`${pad},${H - pad} ${pad + t},${H - pad} ${pad},${
            H - pad - t
          }`}
          fill="#fff"
        />
        <line
          x1={pad + t}
          y1={H - pad}
          x2={pad}
          y2={H - pad - t}
          stroke="#111"
          strokeWidth={sw}
        />
      </>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={isMini ? "tile-sm" : "tile-lg"}
      role="img"
      aria-hidden
      style={{ width: isMini ? 92 : 108, height: isMini ? 92 : 108 }}
    >
      <defs>
        <pattern id={`tx_${pid}`} patternUnits="userSpaceOnUse" width="10" height="10">
          <rect width="10" height="10" fill="#fff" />
          <path d={dpath} stroke="#cbd5e1" strokeWidth={1.6} />
        </pattern>
      </defs>

      {/* “moldura” suave */}
      <rect
        x={pad - 2}
        y={pad - 2}
        width={W - 2 * (pad - 2)}
        height={H - 2 * (pad - 2)}
        rx={isMini ? 12 : 14}
        fill="rgba(0,0,0,.03)"
      />
      {/* quadrado com textura */}
      <rect
        x={pad}
        y={pad}
        width={W - 2 * pad}
        height={H - 2 * pad}
        rx={isMini ? 10 : 12}
        fill={`url(#tx_${pid})`}
        stroke="#111"
        strokeWidth={sw}
      />

      {/* chanfros */}
      {spec.cuts.map((c) => (
        <g key={c}>{cornerCut(c)}</g>
      ))}

      {/* ponto */}
      <circle
        cx={dx}
        cy={dy}
        r={dotR}
        fill="#111"
        stroke="rgba(0,0,0,.35)"
        strokeWidth={isMini ? 1.2 : 1.4}
      />
    </svg>
  );
};

const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[880px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 com a posição 5 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 880px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ---------- ALTERNATIVAS (gabarito = D) ---------- */
const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const opts: { key: OptionKey; spec: TileSpec }[] = [
    { key: "A", spec: { cuts: ["TR", "BR"], dot: "BL", hatch: "back" } },
    { key: "B", spec: { cuts: ["TR"], dot: "TL", hatch: "back" } },
    { key: "C", spec: { cuts: ["TR", "BR", "BL"], dot: "TL", hatch: "back" } },
    { key: "D", spec: { cuts: ["TR", "BR"], dot: "TL", hatch: "back" } }, // ✔
    { key: "E", spec: { cuts: ["TL", "TR"], dot: "BL", hatch: "back" } },
    { key: "F", spec: { cuts: ["TR", "BR"], dot: "TR", hatch: "back" } },
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
          <div className="rv-option-content">
            <Tile spec={o.spec} size="mini" />
          </div>
        </button>
      ))}
    </div>
  );
};

const Q10: QuestionSpec = {
  id: 10,
  prompt: "Qual alternativa completa logicamente a posição 5?",
  Board,
  Options,
};

export default Q10;