import React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q12.png";

/* ============== helpers ============== */
const toRad = (deg: number) => (deg * Math.PI) / 180;
const hourToDeg = (h: number) => ((h % 12) * 30) % 360;
const ticksAngles = (count: 4 | 8 | 12) =>
  Array.from({ length: count }, (_, i) => (360 / count) * i);
const angleToHourLabel = (angle: number) => {
  let h = Math.round(angle / 30) % 12;
  if (h === 0) h = 12;
  return h;
};

/* ============== Clock component ============== */
type ClockProps = {
  hour: number;           // 1..12
  ticks: 4 | 8 | 12;      // marcas no aro
  size?: "lg" | "sm";
};

const Clock: React.FC<ClockProps> = ({ hour, ticks, size = "lg" }) => {
  const R = size === "lg" ? 38 : 35;
  const hand = size === "lg" ? 26 : 24;
  const cx = 50, cy = 50;

  return (
    <svg viewBox="0 0 100 100" role="img" aria-label={`Relógio ${hour} horas, ${ticks} marcas`}>
      {/* aro */}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="#111" strokeWidth={size === "lg" ? 2.2 : 2} />
      {/* marcas */}
      <g transform={`translate(${cx},${cy})`}>
        {ticksAngles(ticks).map((a) => (
          <g key={a} transform={`rotate(${a})`}>
            <line
              x1={0}
              y1={-R}
              x2={0}
              y2={-R + (ticks === 12 ? 5 : 6)}
              stroke="#111"
              strokeWidth={ticks === 4 ? 2.2 : 1.4}
            />
          </g>
        ))}
      </g>
      {/* números (1..12) nas marcas disponíveis */}
      <g>
        {ticksAngles(ticks).map((a) => {
          const rr = R + (size === "lg" ? 7 : 8);
          const x = cx + rr * Math.sin(toRad(a));
          const y = cy - rr * Math.cos(toRad(a));
          return (
            <text
              key={`n-${a}`}
              x={x}
              y={y}
              fontSize={size === "lg" ? 11 : 10}
              fontWeight={800}
              fill="#111"
              dominantBaseline="middle"
              textAnchor="middle"
            >
              {angleToHourLabel(a)}
            </text>
          );
        })}
      </g>
      {/* ponteiro (hora exata) */}
      <g transform={`translate(${cx},${cy}) rotate(${hourToDeg(hour)})`}>
        <line x1={0} y1={0} x2={0} y2={-hand} stroke="#111" strokeWidth={size === "lg" ? 2.2 : 2} />
      </g>
    </svg>
  );
};

/* ============== Board (sem Options dentro!) ============== */
type BoardProps = { selected?: OptionKey | null };

const Board: React.FC<BoardProps> = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[980px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 de relógios com a posição 6 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 980px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ============== Options ============== */
const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  // garantir o contrato OptionKey | null
  const sel = selected ?? null;

  const Opt: React.FC<{ k: OptionKey; h: number; t: 4 | 8 | 12 }> = ({ k, h, t }) => (
    <button
      onClick={() => onSelect(k)}
      className={["rv-option", sel === k ? "rv-option--active" : "rv-option--idle"].join(" ")}
      aria-label={`Alternativa ${k}`}
    >
      <span className="rv-option-label">{k})</span>
      <div className="rv-option-content" style={{ width: 120, height: 120 }}>
        <Clock hour={h} ticks={t} size="sm" />
      </div>
    </button>
  );

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[980px] mx-auto">
      <Opt k="A" h={10} t={12} />
      <Opt k="B" h={1}  t={12} /> {/* ✔ gabarito */}
      <Opt k="C" h={3}  t={12} />
      <Opt k="D" h={12} t={12} />
      <Opt k="E" h={1}  t={8} />
      <Opt k="F" h={1}  t={4} />
    </div>
  );
};

/* ============== Spec export ============== */
const Q12: QuestionSpec = {
  id: 12,
  prompt: "Qual alternativa completa logicamente a posição 6?",
  Board,    // agora NÃO inclui Options (acabou a duplicação)
  Options,  // recebe/retorna OptionKey | null certinho
};

export default Q12;