import type { QuestionSpec, QuestionOptionsProps } from "./types";
import type { OptionKey } from "@/components/options";
import boardImg from "@/assets/retencao-visual/q27.png";
import optA from "@/assets/retencao-visual/q27-opt-a.png";
import optB from "@/assets/retencao-visual/q27-opt-b.png";
import optC from "@/assets/retencao-visual/q27-opt-c.png";
import optD from "@/assets/retencao-visual/q27-opt-d.png";
import optE from "@/assets/retencao-visual/q27-opt-e.png";
import optF from "@/assets/retencao-visual/q27-opt-f.png";

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

const CORRECT_KEY: OptionKey = "F";

const Options: React.FC<QuestionOptionsProps> = ({ selected, onSelect }) => {
  const items: { key: OptionKey; src: string }[] = [
    { key: "A", src: optA },
    { key: "B", src: optB },
    { key: "C", src: optC },
    { key: "D", src: optD },
    { key: "E", src: optE },
    { key: "F", src: optF }, 
  ];

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-[860px] mx-auto">
        {items.map(({ key, src }) => {
          const active = selected === key;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              aria-label={`Alternativa ${key}`}
              aria-pressed={active}
              className={[
                "rv-option",
                active ? "rv-option--active" : "rv-option--idle",
                "group"
              ].join(" ")}
            >
              <span className="rv-option-label">{key})</span>
              <div className="rv-option-content">
                <img
                  src={src}
                  alt=""
                  className="w-[120px] h-auto sm:w-[140px] select-none transition-transform duration-150 ease-out"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <span className="sr-only">
                {key === CORRECT_KEY ? "Resposta correta" : "Resposta incorreta"}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* ================== Spec ================== */
const Q27: QuestionSpec = {
  id: 27,
  prompt: "Qual alternativa completa logicamente a posição 9?",
  Board,
  Options,
};

export default Q27;
