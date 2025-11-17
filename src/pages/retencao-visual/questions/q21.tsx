import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q21.png";

type Shape = "star" | "diamond" | "triangle" | "circle" | "square";
type Grid = Array<Shape | null>; // 9 posições (row-major)

const black = "#111";

// ===== SVG inline para cada forma (sem depender de CSS) =====
const ShapeIcon: React.FC<{ shape: Shape }> = ({ shape }) => {
  switch (shape) {
    case "circle":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <circle cx="10" cy="10" r="8" fill={black} />
        </svg>
      );
    case "square":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <rect x="3" y="3" width="14" height="14" rx="2" fill={black} />
        </svg>
      );
    case "triangle":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <polygon points="10,2 2,18 18,18" fill={black} />
        </svg>
      );
    case "diamond":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <polygon points="10,2 18,10 10,18 2,10" fill={black} />
        </svg>
      );
    case "star":
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden>
          <polygon
            fill={black}
            points="10,1.5 12.6,7.2 18.9,7.2 13.8,11.0 15.7,17.8 10,13.9 4.3,17.8 6.2,11.0 1.1,7.2 7.4,7.2"
          />
        </svg>
      );
  }
};

// grade 3×3 com estilos inline mínimos (não cria CSS novo)
// grade 3×3 com tamanho configurável
const SymbolGrid: React.FC<{ grid: Grid; size?: number }> = ({ grid, size = 96 }) => (
  <div
    className="symbol-grid"
    style={{
      width: size,
      height: size,
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gridTemplateRows: "repeat(3,1fr)",
      gap: 6,
      padding: 6,
    }}
  >
    {grid.map((s, i) => (
      <div
        key={i}
        className="symbol"
        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        {s ? <ShapeIcon shape={s} /> : null}
      </div>
    ))}
  </div>
);


// ===== helpers =====
function mkGrid(pos: Record<number, Shape>): Grid {
  const g: Grid = Array(9).fill(null);
  for (const [k, v] of Object.entries(pos)) g[Number(k) - 1] = v;
  return g;
}

const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[880px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 de grids de símbolos com a posição 6 faltando"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 880px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);


// ===== Alternativas =====
const ALT_MAP: Record<OptionKey, Grid> = {
  // A) correta — XOR posicional de B1 e B2
  A: mkGrid({ 2: "circle", 3: "square", 6: "star", 7: "circle" }),
  B: mkGrid({ 1: "triangle", 2: "circle", 3: "square", 5: "diamond", 6: "star", 7: "circle", 9: "star" }),
  C: mkGrid({ 1: "triangle", 5: "diamond", 9: "star" }),
  D: mkGrid({ 1: "star", 3: "circle", 4: "star", 6: "diamond", 7: "square", 8: "circle", 9: "triangle" }),
  E: mkGrid({ 3: "square", 7: "circle" }),
  F: mkGrid({
    1: "star", 2: "circle", 3: "triangle",
    4: "diamond", 5: "square", 6: "star",
    7: "circle", 8: "triangle", 9: "diamond",
  }),
};

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const keys: OptionKey[] = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="mt-6">
      {/* 2 colunas no mobile, 3 colunas ≥ sm */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[880px] mx-auto">
        {keys.map((k) => {
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
              <div className="rv-option-content flex justify-center">
                {/* dá um respiro no mobile pra não “achatar” */}
                <div className="w-[92px] sm:w-[96px]">
                  <SymbolGrid grid={ALT_MAP[k]} size={92} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Q21: QuestionSpec = {
  id: 21,
  prompt: "Qual alternativa completa logicamente a posição 6?",
  Board,
  Options,
};

export default Q21;
