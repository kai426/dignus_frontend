import type { Section, Question } from "@/@types";
import { makeQuestionsFromPrompts, withLetters } from "../helpers";
import { AGREES } from "../constants";

const base: Question[] = makeQuestionsFromPrompts(
  [
    "Busco ser o melhor no que faço.",
    "Já enfrentei dificuldades para conquistar um desafio importante.",
    "Novas ideias e projetos às vezes me distraem de ideias e projetos anteriores.",
    "Mudo de objetivos com facilidade.",
    "Termino tudo que inicio.",
    "Costumo agir de forma compulsiva.",
    "Me considero alguém exigente.",
    "Comemoro os bons resultados obtidos com frequência.",
    "Me considero uma pessoa autêntica.",
  ],
  16,
  AGREES
);

const q25: Question = {
  id: "q-25",
  prompt: "25. Você se considera alguém.",
  options: withLetters([
    "Ambicioso(a) e determinado(a)",
    "Ambicioso(a) com alguma determinação",
    "Determinado(a), mas não ambicioso(a)",
    "Nem ambicioso(a), nem determinado(a), apenas comprometido com as responsabilidades que assumo",
  ]),
};

export const sec4: Section = {
  id: "sec-4",
  title: "Seção 4: Motivação e Direcionamento Pessoal",
  questions: [...base, q25],
};
