import type { OptionKey } from "@/components/options";

export type QuestionOptionsProps = {
  selected: OptionKey | null;
  onSelect: (k: OptionKey) => void;
};

export type QuestionSpec = {
  id: number;
  prompt: string;
  Board: React.FC;                       // “matriz/cartas”
  Options: React.FC<QuestionOptionsProps>; // alternativas (A..F)
};