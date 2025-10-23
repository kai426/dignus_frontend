import type { Section, Question } from "@/@types";
import { withLetters } from "../helpers";

const prompts = [
  "Quando algo realmente lhe diverte, você reage com:",
  "Você se considera mais produtivo pela:",
  "Na maior parte do tempo, você costuma andar:",
  "Qual opção abaixo mais se parece com você?",
  "Diante de estresse, você tende a:",
];

const optionsByPrompt: string[][] = [
  ["Riso contido", "Sorriso tímido", "Gargalhadas moderadas", "Grande gargalhada"],
  ["Manhã", "Tarde", "Noite"],
  ["Normal", "Rápido", "Lentamente"],
  ["Impaciente", "Cooperativo(a)", "Compreensível", "Evito envolver emoções"],
  ["Contar piada/transformar em riso", "Evitar/ignorar a situação", "Organizar e solucionar", "Ficar mais sério/dificuldade"],
];

const questions: Question[] = prompts.map((p, i) => ({
  id: `q-${1 + i}`,
  prompt: `${1 + i}. ${p}`,
  options: withLetters(optionsByPrompt[i]),
}));

export const sec1: Section = {
  id: "sec-1",
  title: "Seção 1: Personalidade",
  questions,
};
