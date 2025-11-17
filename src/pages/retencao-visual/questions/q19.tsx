import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q19.png";

type Side = "top" | "right" | "bottom" | "left";
type Diag = "back" | "slash";

type TileCfg = { notch: Side; dot: Side; diag: Diag };

const RING: { box: { x: number; y: number; w: number; h: number; r: number } } =
  { box: { x: 15, y: 15, w: 70, h: 70, r: 10 } };

const NOTCH_RECT: Record<Side, { x: number; y: number; w: number; h: number }> = {
  top:    { x: 25, y: 12, w: 50, h: 12 },
  right:  { x: 78, y: 25, w: 12, h: 50 },
  bottom: { x: 25, y: 78, w: 50, h: 12 },
  left:   { x: 12, y: 25, w: 12, h: 50 },
};

const DOT_POS: Record<Side, { cx: number; cy: number }> = {
  top:    { cx: 50, cy: 23 },
  right:  { cx: 77, cy: 50 },
  bottom: { cx: 50, cy: 77 },
  left:   { cx: 23, cy: 50 },
};

function TileSVG({ notch, dot, diag, size = 100 }: TileCfg & { size?: number }) {
  const { box } = RING;
  const n = NOTCH_RECT[notch];
  const d = DOT_POS[dot];

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} aria-hidden="true">
      {/* moldura (anel quadrado) */}
      <rect
        x={box.x}
        y={box.y}
        width={box.w}
        height={box.h}
        rx={box.r}
        ry={box.r}
        fill="none"
        stroke="#111827"
        strokeWidth={4}
      />
      {/* diagonal */}
      {diag === "slash" ? (
        <line x1="78" y1="22" x2="22" y2="78" stroke="#111827" strokeWidth={4} strokeLinecap="round" />
      ) : (
        <line x1="22" y1="22" x2="78" y2="78" stroke="#111827" strokeWidth={4} strokeLinecap="round" />
      )}
      {/* entalhe (apagando trecho da borda) */}
      <rect x={n.x} y={n.y} width={n.w} height={n.h} fill="#fff" />
      {/* ponto */}
      <circle cx={d.cx} cy={d.cy} r={5.2} fill="#111827" />
    </svg>
  );
}

/* ================== BOARD ================== */
/* Matriz (3×3) conforme o enunciado — célula 6 vazia */

const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[720px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 com a posição 6 faltando (anel, entalhe, diagonal e ponto)"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 720px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ================== OPTIONS ================== */
/* Alternativas do enunciado; CORRETA = A */
const ALT_MAP: Record<OptionKey, TileCfg> = {
  A: { notch: "left",  dot: "top",    diag: "back"  }, // ✅ correta
  B: { notch: "left",  dot: "top",    diag: "slash" }, // diag errada
  C: { notch: "left",  dot: "right",  diag: "back"  }, // ponto errado
  D: { notch: "right", dot: "top",    diag: "back"  }, // entalhe errado
  E: { notch: "left",  dot: "bottom", diag: "back"  }, // ponto errado
  F: { notch: "top",   dot: "left",   diag: "back"  }, // ambos espelhados
};

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const keys = Object.keys(ALT_MAP) as OptionKey[];

  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[720px] mx-auto">
      {keys.map((k) => {
        const cfg = ALT_MAP[k];
        const active = selected === k;
        return (
          <button
            key={k}
            onClick={() => onSelect(k)}
            className={["rv-option", active ? "rv-option--active" : "rv-option--idle"].join(" ")}
            aria-label={`Alternativa ${k}`}
            aria-pressed={active}
          >
            <span className="rv-option-label">{k})</span>
            <div className="rv-option-content">
              <TileSVG {...cfg} size={96} />
            </div>
          </button>
        );
      })}
    </div>
  );
};

/* ================== SPEC ================== */
const Q19: QuestionSpec = {
  id: 19,
  prompt: "Qual alternativa completa logicamente a posição 6?",
  Board,
  Options,
};

export default Q19;
