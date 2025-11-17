import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q22.png";
import optA from "@/assets/retencao-visual/q22-opt-a.png";
import optB from "@/assets/retencao-visual/q22-opt-b.png";
import optC from "@/assets/retencao-visual/q22-opt-c.png";
import optD from "@/assets/retencao-visual/q22-opt-d.png";
import optE from "@/assets/retencao-visual/q22-opt-e.png";
import optF from "@/assets/retencao-visual/q22-opt-f.png";

const Board: React.FC = () => (
  <div className="flex justify-center my-6">
    <figure className="w-full max-w-[900px]">
      <img
        src={boardImg}
        alt="Matriz 3x3 de balanças com a posição 5 em falta"
        className="w-full h-auto select-none"
        sizes="(max-width: 640px) 100vw, 900px"
        loading="eager"
        decoding="async"
      />
    </figure>
  </div>
);


const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const MAP: Record<OptionKey, { src: string; alt: string }> = {
    A: { src: optA, alt: "A: balança com triângulo em cada lado (equilíbrio)" }, // correta
    B: { src: optB, alt: "B: duas praças à esquerda contra um círculo" },
    C: { src: optC, alt: "C: quadrado e círculo vs quadrado e dois círculos" },
    D: { src: optD, alt: "D: triângulo e círculo vs círculo" },
    E: { src: optE, alt: "E: quadrado vs quadrado" },
    F: { src: optF, alt: "F: dois quadrados vs dois quadrados" },
  };

  const keys: OptionKey[] = ["A", "B", "C", "D", "E", "F"];

  return (
    <div className="mt-6">
      {/* 2 colunas no mobile, 3 colunas ≥ sm; evita “achatar” */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[900px] mx-auto">
        {keys.map((k) => {
          const isSel = selected === k;
          const { src, alt } = MAP[k];
          return (
            <button
              key={k}
              onClick={() => onSelect(k)}
              className={[
                "rv-option group",
                isSel ? "rv-option--active" : "rv-option--idle",
              ].join(" ")}
              aria-label={`Alternativa ${k}`}
              aria-pressed={isSel}
            >
              <span className="rv-option-label">{k})</span>
              <div className="rv-option-content">
                {/* largura fixa confortável no mobile; cresce um pouco no sm */}
                <img
                  src={src}
                  alt={alt}
                  className="mx-auto w-[124px] sm:w-[140px] h-auto select-none transition-transform duration-150"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const Q22: QuestionSpec = {
  id: 22,
  prompt: "Qual balança completa a posição 5?",
  Board,
  Options,
};

export default Q22;
