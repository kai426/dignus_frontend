import type { Section, Question } from "@/@types";
import { withLetters } from "../helpers";

const questions: Question[] = [
  {
    id: "q-38",
    prompt: "38. Assinale a alternativa abaixo que mais se parece com você.",
    options: withLetters([
      "Eu sou capaz de tomar decisões de forma eficaz sob pressão",
      "Eu tenho a habilidade de superar obstáculos para atingir meus objetivos",
      "Transformo os meus planos em realidade",
      "Entrego meus resultados de acordo com às expectativas dos outros",
    ]),
  },
  {
    id: "q-39",
    prompt: "39. Assinale a alternativa abaixo que mais se parece com você.",
    options: withLetters([
      "Eu me sinto motivado(a) quando posso usar minhas habilidades para resolver problemas complexos",
      "Eu me sinto motivado(a) quando tenho a oportunidade de liderar um projeto ou uma equipe.",
      "Eu me sinto motivado(a) quando tenho a oportunidade de aprender algo novo",
    ]),
  },
  { id: "q-40", prompt: "40. Você aprende mais:", options: withLetters(["Vendo", "Ouvindo", "Fazendo"]) },
  {
    id: "q-41",
    prompt: "41. Diante de uma situação de estresse, você procura:",
    options: withLetters([
      "Contar até 10, se recuperar e tentar novamente.",
      "Contar até 10, se recuperar e evitar a mesma situação novamente",
      "Simplesmente ignoro o estresse e procuro espairecer fazendo outra coisa",
      "Fico mal e tenho dificuldade de retomar o controle",
    ]),
  },
];

export const sec7: Section = {
  id: "sec-7",
  title: "Seção 7: Tomada de Decisão e Desempenho",
  questions,
};
