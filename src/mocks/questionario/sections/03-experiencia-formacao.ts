import type { Section, Question } from "@/@types";
import { withLetters } from "../helpers";

const questions: Question[] = [
  { id: "q-11", prompt: "11. Você já trabalhou com atendimento ao público?", options: withLetters(["Sim", "Não"]) },
  { id: "q-12", prompt: "12. Você possui experiência com vendas?",           options: withLetters(["Sim", "Não"]) },
  { id: "q-13", prompt: "13. Qual sua disponibilidade de horário?",          options: withLetters(["Manhã", "Tarde", "Noite", "Todos acima"]) },
  {
    id: "q-14",
    prompt: "14. Qual é a sua escolaridade?",
    options: withLetters([
      "Ensino fundamental incompleto",
      "Ensino fundamental completo",
      "Ensino médio incompleto",
      "Ensino médio completo",
      "Ensino superior incompleto",
      "Ensino superior completo",
    ]),
  },
  {
    id: "q-15",
    prompt: "15. Com qual idade você concluiu o ensino médio?",
    options: withLetters(["Não conclui o ensino médio", "Entre 16 e 18 anos", "Entre 18 e 20 anos", "Acima de 20 anos"]),
  },
];

export const sec3: Section = {
  id: "sec-3",
  title: "Seção 3: Experiência e formação",
  questions,
};
