import type { Section, Question } from "@/@types";
import { withLetters } from "../helpers";

const questions: Question[] = [
  { id: "q-47", prompt: "47. Você se enquadra como uma Pessoa PCD?", options: withLetters(["Sim", "Não"]) },
  { id: "q-48", prompt: "48. Você é estrangeiro?", options: withLetters(["Sim", "Não"]) },
  { id: "q-49", prompt: "49. Você tem mais de 50 anos?", options: withLetters(["Sim", "Não"]) },
  { id: "q-50", prompt: "50. Qual é o seu gênero?", options: withLetters(["Masculino", "Feminino", "Não binário", "Outros"]) },
  { id: "q-51", prompt: "51. Você é Transgênero?", options: withLetters(["Sim", "Não"]) },
  { id: "q-52", prompt: "52. Qual é a sua cor/raça ou etnia?", options: withLetters(["Amarela", "Indígena", "Parda", "Preta", "Branca"]) },
];

export const sec9: Section = {
  id: "sec-9",
  title: "Seção 9: Diversidade e Inclusão",
  questions,
};
