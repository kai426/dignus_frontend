import React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q15.png";

/* ─────────────────────────── Tile ─────────────────────────── */

type Port = "N" | "E" | "S" | "W";
type Dots = 1 | 2;

type TileProps = {
  ports: Port[];      // quais lados têm “portas”
  dots: Dots;         // 1 (ímpar) ou 2 (par)
  size?: "lg" | "sm"; // tamanhos visuais
};

const Tile: React.FC<TileProps> = ({ ports, dots, size = "lg" }) => {
  const id = React.useId();
  const px = size === "lg" ? 104 : 90;
  const pad = 10;
  const cx = px / 2;
  const cy = px / 2;
  const sw = 6;

  const ends: Record<Port, [number, number]> = {
    N: [cx, pad],
    E: [px - pad, cy],
    S: [cx, px - pad],
    W: [pad, cy],
  };

  const frame = (
    <rect
      x={pad / 2}
      y={pad / 2}
      width={px - pad}
      height={px - pad}
      rx={14}
      ry={14}
      fill="none"
      stroke="#111"
      strokeWidth={2}
    />
  );

  // linhas (portas)
  const lines = ports.map((p) => {
    const [x, y] = ends[p];
    return (
      <line
        key={p}
        x1={x}
        y1={y}
        x2={cx}
        y2={cy}
        stroke="#111"
        strokeLinecap="round"
        strokeWidth={sw}
      />
    );
  });

  // marcador P&B com textura (sem vermelho)
  const r = 5.2;
  const halo = 9.2;
  const off = 14;

  const Dot = ({ x, y }: { x: number; y: number }) => (
    <>
      <circle cx={x} cy={y} r={halo} fill="#fff" opacity={0.85} />
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={`url(#pat-${id})`}
        stroke="#111"
        strokeWidth={1.8}
      />
    </>
  );

  return (
    <svg viewBox={`0 0 ${px} ${px}`} width={px} height={px} aria-hidden="true">
      <defs>
        <pattern id={`pat-${id}`} width="6" height="6" patternUnits="userSpaceOnUse">
          <rect width="6" height="6" fill="#fff" />
          <path d="M0,6 L6,0" stroke="#000" strokeWidth="1" />
        </pattern>
      </defs>
      {frame}
      {lines}
      {dots === 1 ? (
        <Dot x={cx} y={cy} />
      ) : (
        <>
          <Dot x={cx - off} y={cy - off} />
          <Dot x={cx + off} y={cy + off} />
        </>
      )}
    </svg>
  );
};

type BoardProps = { selected?: OptionKey | null };

const Board: React.FC<BoardProps> = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[860px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 com a posição 6 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 860px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ─────────────────────────── Options ─────────────────────────── */

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const sel = selected ?? null;

  const CHOICES: Array<{ k: OptionKey; ports: Port[]; dots: Dots }> = [
    { k: "A", ports: ["S", "W"], dots: 1 },
    { k: "B", ports: ["S", "N"], dots: 2 },
    { k: "C", ports: ["W", "N"], dots: 2 },
    { k: "D", ports: ["S", "W", "N"], dots: 1 },
    { k: "E", ports: ["S", "W"], dots: 2 }, // ✔ correta (R2C3)
    { k: "F", ports: ["W"], dots: 1 },
  ];

  const Opt: React.FC<{ k: OptionKey; ports: Port[]; dots: Dots }> = ({
    k,
    ports,
    dots,
  }) => (
    <button
      onClick={() => onSelect(k)}
      className={[
        "rv-option",
        sel === k ? "rv-option--active" : "rv-option--idle",
      ].join(" ")}
      aria-label={`Alternativa ${k}`}
    >
      <div className="rv-option-label">{k})</div>
      <div className="rv-option-content">
        <Tile ports={ports} dots={dots} size="sm" />
      </div>
    </button>
  );

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[860px] mx-auto">
      {CHOICES.map(({ k, ports, dots }) => (
        <Opt key={k} k={k} ports={ports} dots={dots} />
      ))}
    </div>
  );
};

/* ─────────────────────────── Spec export ─────────────────────────── */

const Q15: QuestionSpec = {
  id: 15,
  prompt: "Qual alternativa completa logicamente a posição 6?",
  Board,
  Options, // prop selected é OptionKey | null (sem undefined)
  // explanation (se quiser exibir): "Gabarito E — portas SW por rotação na 2ª linha; como são 2 portas (par), ficam 2 pontos."
};

export default Q15;
