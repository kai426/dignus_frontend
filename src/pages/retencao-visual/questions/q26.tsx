// questions/q26.tsx
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q26.png";

/* ---------- Tile (azulejo P&B) ---------- */
type EdgeColor = "red" | "green" | "blue" | "purple";
type Edges = { top: EdgeColor; right: EdgeColor; bottom: EdgeColor; left: EdgeColor };

function AzTile({
  edges,
  size = "lg",
  ghost = false,
}: {
  edges: Edges;
  size?: "lg" | "sm";
  /** “fantasma” (para a célula vazia): baixa opacidade + grayscale */
  ghost?: boolean;
}) {
  return (
    <div
      className={[
        "rv-az",
        size === "sm" ? "rv-az--sm" : "rv-az--lg",
        ghost ? "rv-az--ghost" : "",
      ].join(" ")}
      aria-hidden
    >
      <div className={`rv-edge top rv-pat-${edges.top}`} />
      <div className={`rv-edge right rv-pat-${edges.right}`} />
      <div className={`rv-edge bottom rv-pat-${edges.bottom}`} />
      <div className={`rv-edge left rv-pat-${edges.left}`} />
      <span className="rv-nub" />
    </div>
  );
};

// célula (5) é a faltante
const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[900px]">
      <img
        src={boardImg}
        alt="Matriz 3×3 de azulejos; posição 5 vazia"
        className="w-full h-auto select-none"
        sizes="(max-width: 640px) 100vw, 900px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ---------- Opções (3 colunas × 2 linhas) ---------- */
const CORRECT: OptionKey = "E";

const OPTIONS: { key: OptionKey; edges: Edges }[] = [
  { key: "A", edges: { top: "blue", right: "purple", bottom: "green", left: "blue" } },
  { key: "B", edges: { top: "green", right: "purple", bottom: "red", left: "blue" } },
  { key: "C", edges: { top: "blue", right: "red", bottom: "red", left: "blue" } },
  { key: "D", edges: { top: "blue", right: "purple", bottom: "red", left: "green" } },
  { key: "E", edges: { top: "blue", right: "purple", bottom: "red", left: "blue" } }, // ✅
  { key: "F", edges: { top: "red", right: "blue", bottom: "blue", left: "purple" } },
];

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[820px] mx-auto">
        {OPTIONS.map((o) => {
          const isSel = selected === o.key;
          return (
            <button
              key={o.key}
              onClick={() => onSelect(o.key)}
              aria-label={`Alternativa ${o.key}`}
              className={[
                "rv-option",
                isSel ? "rv-option--active" : "rv-option--idle",
              ].join(" ")}
            >
              <span className="rv-option-label">{o.key})</span>
              <AzTile edges={o.edges} size="sm" />
              <span className="sr-only">
                {o.key === CORRECT ? "Resposta correta" : "Resposta incorreta"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Q26: QuestionSpec = {
  id: 26,
  prompt: "Qual alternativa completa logicamente a posição 5?",
  Board,
  Options,
};

export default Q26;
