// questions/q29.tsx
import * as React from "react";
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q29.png";

/* ======================= Tipos & helpers ======================= */
type PanelState = { coins: [number, number, number]; cur: 0 | 1 | 2 };

// Move 1 moeda do compartimento cur para o próximo; cursor avança para o próximo
function stepH(s: PanelState): PanelState {
  const coins = [...s.coins] as PanelState["coins"];
  const from = s.cur;
  const to = ((s.cur + 1) % 3) as PanelState["cur"];
  if (coins[from] > 0) {
    coins[from] = (coins[from] - 1) as 0 | 1 | 2 | 3;
    coins[to] = (coins[to] + 1) as 0 | 1 | 2 | 3;
  }
  return { coins: coins as PanelState["coins"], cur: to };
}

// Espelha verticalmente (1↔3) e espelha também o cursor. Quantidades ficam iguais.
function stepV(s: PanelState): PanelState {
  const coins = [s.coins[2], s.coins[1], s.coins[0]] as PanelState["coins"];
  const cur = (2 - s.cur) as PanelState["cur"];
  return { coins, cur };
}

/* ======================= SVG do painel ======================= */
function Panel29({
  state,
  size = "lg",
}: {
  state: PanelState;
  size?: "lg" | "sm";
}) {
  const W = 110;
  const side = size === "sm" ? 96 : W;

  // Geometria dos 3 compartimentos
  const x0 = 12,
    y0 = 40,
    w = 86,
    h = 30,
    gap = 6,
    cellW = (w - 2 * gap) / 3;

  return (
    <svg
      viewBox={`0 0 ${W} ${W}`}
      width={side}
      height={side}
      role="img"
      aria-hidden
      style={{ borderRadius: 12, boxShadow: "inset 0 0 0 1px #e5e7eb", background: "#fff" }}
    >
      {/* Trilho dos compartimentos */}
      {[0, 1, 2].map((i) => (
        <rect
          key={i}
          x={x0 + i * (cellW + gap)}
          y={y0}
          width={cellW}
          height={h}
          rx={8}
          fill="#fff"
          stroke="#111"
          strokeWidth={1.6}
        />
      ))}

      {/* Moedas (P&B) */}
      {state.coins.map((n, i) =>
        Array.from({ length: n }).map((_, k) => (
          <circle
            key={`${i}-${k}`}
            cx={x0 + i * (cellW + gap) + cellW / 2}
            cy={y0 + h - 8 - k * 10}
            r={4.5}
            fill="#111"
          />
        ))
      )}

      {/* Marcador (seta) acima do compartimento atual */}
      {(() => {
        const mcx = x0 + state.cur * (cellW + gap) + cellW / 2;
        return <polygon points={`${mcx},24 ${mcx - 8},34 ${mcx + 8},34`} fill="#111" />;
      })()}
    </svg>
  );
}

/* ======================= Estados da matriz (fixos) ======================= */
// Semente
const A1: PanelState = { coins: [2, 1, 0], cur: 0 };

const B1 = stepV(A1);
const B2 = stepH(B1); 
const B3 = stepH(B2);
/* ======================= Board (3×3) ======================= */
const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[960px]">
      <img
        src={boardImg}
        alt="Sequência 3×3 de mini-tabuleiros; célula 9 em falta."
        className="w-full h-auto select-none"
        sizes="(max-width: 640px) 100vw, 960px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/* ======================= Opções (3×2) ======================= */
const CORRECT: OptionKey = "A";

// Correta: B2 = [1,1,1] com cursor no 1º
const ALTS: Record<OptionKey, PanelState> = {
  A: B2,                          // ✅ correta
  B: { coins: [1, 1, 1], cur: 2 },// mesma contagem, cursor errado
  C: B3,                          // estado após mais um passo (como B3)
  D: { coins: [0, 1, 2], cur: 0 },// não move moeda; muda só cursor
  E: { coins: [1, 2, 0], cur: 1 },// passo aplicado como se partisse de A1
  F: { coins: [2, 1, 0], cur: 0 },// erra o espelho vertical anterior
};

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[880px] mx-auto">
        {(["A", "B", "C", "D", "E", "F"] as OptionKey[]).map((k) => {
          const isSel = selected === k;
          return (
            <button
              key={k}
              onClick={() => onSelect(k)}
              aria-label={`Alternativa ${k}`}
              className={[
                "rv-option",
                isSel ? "rv-option--active" : "rv-option--idle",
              ].join(" ")}
            >
              <span className="rv-option-label">{k})</span>
              <Panel29 state={ALTS[k]} size="sm" />
              <span className="sr-only">
                {k === CORRECT ? "Resposta correta" : "Resposta incorreta"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ======================= Spec ======================= */
const Q29: QuestionSpec = {
  id: 29,
  prompt: "Qual alternativa completa logicamente a posição 5?",
  Board,
  Options,
};

export default Q29;
