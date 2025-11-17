import React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q14.png";

/* ===================== Tile (formas + texturas P&B) ===================== */

type Texture = "slash" | "back" | "grid";
type Shape = "circle" | "square" | "triangle";

type TileCfg = {
  shape: Shape;
  texture: Texture;
  dots: 2 | 4 | 6;
  dotY: 30 | 50 | 70; // topo, meio, base
};

type TileProps = TileCfg & { size?: "lg" | "sm" };

const Tile: React.FC<TileProps> = ({
  shape,
  texture,
  dots,
  dotY,
  size = "lg",
}) => {
  const id = React.useId();

  const stroke = "#000";
  const r = 32;
  const box = { x: 18, y: 18, w: 64, h: 64, rx: 12 };
  const triPts = "50,16 84,84 16,84";

  // padrão P&B (traço fino)
  const defs = (
    <defs>
      <pattern id={`pt-${id}`} width="8" height="8" patternUnits="userSpaceOnUse">
        <rect width="8" height="8" fill="#fff" />
        {texture === "slash" && (
          <path d="M0 8 L8 0" stroke="#000" strokeWidth="1.1" />
        )}
        {texture === "back" && (
          <path d="M0 0 L8 8" stroke="#000" strokeWidth="1.1" />
        )}
        {texture === "grid" && (
          <>
            <path d="M0 4 H8" stroke="#000" strokeWidth="1" />
            <path d="M4 0 V8" stroke="#000" strokeWidth="1" />
          </>
        )}
      </pattern>
    </defs>
  );

  const core =
    shape === "circle" ? (
      <circle cx="50" cy="50" r={r} fill={`url(#pt-${id})`} stroke={stroke} strokeWidth="1.25" />
    ) : shape === "square" ? (
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={box.rx}
        ry={box.rx}
        fill={`url(#pt-${id})`}
        stroke={stroke}
        strokeWidth="1.25"
      />
    ) : (
      <polygon
        points={triPts}
        fill={`url(#pt-${id})`}
        stroke={stroke}
        strokeWidth="1.25"
      />
    );

  // distribuição dos pontos (maiores e mais espaçados)
  const xs =
    dots === 2 ? [30, 70] : dots === 4 ? [24, 40, 60, 76] : [20, 32, 44, 56, 68, 80];
  const dotR = size === "lg" ? 4.2 : 3.8;

  const wh = size === "lg" ? 112 : 96;

  return (
    <svg viewBox="0 0 100 100" width={wh} height={wh} aria-hidden="true">
      {defs}
      {core}
      {xs.map((x) => (
        <circle key={x} cx={x} cy={dotY} r={dotR} fill="#000" />
      ))}
    </svg>
  );
};

type BoardProps = { selected?: OptionKey | null };

const Board: React.FC<BoardProps> = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[920px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 com a posição 8 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 920px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ===================== Opções ===================== */

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const sel = selected ?? null;

  const CHOICES: Array<{ k: OptionKey; cfg: TileCfg }> = [
    { k: "A", cfg: { shape: "square",   texture: "back", dots: 4, dotY: 70 } },
    { k: "B", cfg: { shape: "triangle", texture: "back", dots: 4, dotY: 70 } },
    { k: "C", cfg: { shape: "circle",   texture: "grid", dots: 4, dotY: 70 } },
    { k: "D", cfg: { shape: "circle",   texture: "back", dots: 4, dotY: 70 } }, // ✔ correta
    { k: "E", cfg: { shape: "circle",   texture: "back", dots: 6, dotY: 70 } },
    { k: "F", cfg: { shape: "circle",   texture: "back", dots: 4, dotY: 50 } },
  ];

  const Opt: React.FC<{ k: OptionKey; cfg: TileCfg }> = ({ k, cfg }) => (
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
        <Tile {...cfg} size="sm" />
      </div>
    </button>
  );

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[920px] mx-auto">
      {CHOICES.map(({ k, cfg }) => (
        <Opt key={k} k={k} cfg={cfg} />
      ))}
    </div>
  );
};

/* ===================== Spec export ===================== */

const Q14: QuestionSpec = {
  id: 14,
  prompt: "Qual alternativa completa logicamente a posição 8?",
  Board,
  Options, // usa OptionKey | null no prop selected
  // dica rápida opcional (se exibirem em algum lugar):
  // explanation: "Gabarito D: forma da linha (círculo), textura da coluna (\\), nº de pontos da coluna (4) e altura da linha (base).",
};

export default Q14;
