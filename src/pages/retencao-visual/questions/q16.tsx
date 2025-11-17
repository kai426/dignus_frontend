// src/pages/retencao-visual/questions/q16.tsx
import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q16.png";

/** ---- Tile 2×2 (bits): 8=TL(●), 4=TR(■), 2=BL(▲), 1=BR(★) ---- */
type Mask = number;

const POS = {
  TL: { bit: 8, style: { top: "25%", left: "25%" } as React.CSSProperties, sym: "●", name: "TL" },
  TR: { bit: 4, style: { top: "25%", left: "75%" } as React.CSSProperties, sym: "■", name: "TR" },
  BL: { bit: 2, style: { top: "75%", left: "25%" } as React.CSSProperties, sym: "▲", name: "BL" },
  BR: { bit: 1, style: { top: "75%", left: "75%" } as React.CSSProperties, sym: "★", name: "BR" },
} as const;

function XorTile({ mask }: { mask: Mask }) {
  // container desenhado com utilitários (sem CSS novo)
  return (
    <div className="relative w-[96px] h-[96px] rounded-lg border-2 border-black bg-white">
      {/* guias do 2×2 */}
      <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-black/15" />
      <div className="absolute left-0 top-1/2 h-[2px] w-full -translate-y-1/2 bg-black/15" />

      {/* marcas ativas conforme bits */}
      {Object.values(POS).map((p) =>
        mask & p.bit ? (
          <div
            key={p.bit}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-4xl font-black text-black"
            style={p.style}
            title={p.name}
            aria-hidden
          >
            {p.sym}
          </div>
        ) : null
      )}
    </div>
  );
}

const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[720px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 com a posição 5 faltando (tile 2×2 por XOR)"
        className="w-full h-auto"
        sizes="(max-width: 640px) 100vw, 720px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);

/** ---- Opções (A–F). Correta: A = 11 (1011) = TL + BL + BR ---- */
const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const opts: { key: OptionKey; mask: Mask }[] = [
    { key: "A", mask: 11 }, // ✅ TL + BL + BR
    { key: "B", mask: 6  }, // TR + BL
    { key: "C", mask: 2  }, // BL
    { key: "D", mask: 9  }, // TL + BR
    { key: "E", mask: 15 }, // TL + TR + BL + BR
    { key: "F", mask: 13 }, // TL + TR + BR
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
          <div className="rv-option-content">
            <XorTile mask={o.mask} />
          </div>
        </button>
      ))}
    </div>
  );
};

const Q16: QuestionSpec = {
  id: 16,
  prompt: "Qual alternativa completa logicamente a posição 5?",
  Board,
  Options,
};

export default Q16;
