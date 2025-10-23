import type { Section } from "@/@types";
import { sec1 } from "./sections/01-personalidade";
import { sec2 } from "./sections/02-habitos";
import { sec3 } from "./sections/03-experiencia-formacao";
import { sec4 } from "./sections/04-motivacao-direcionamento";
import { sec5 } from "./sections/05-autopercepcao-imagem-social";
import { sec6 } from "./sections/06-emocoes-relacoes";
import { sec7 } from "./sections/07-tomada-decisao-desempenho";
import { sec8 } from "./sections/08-estilo-pessoal-preferencias";
import { sec9 } from "./sections/09-diversidade-inclusao";

export const SECTION_DATA: Section[] = [
  sec1, sec2, sec3, sec4, sec5, sec6, sec7, sec8, sec9,
];

export const TOTAL_QUESTIONS = SECTION_DATA.reduce(
  (sum, sec) => sum + sec.questions.length,
  0
);

// reexport úteis (se precisar em outros lugares)
export * from "./helpers";
export * from "./constants";
