import type { Section, Question } from "@/@types";
import { withLetters } from "../helpers";

const questions: Question[] = [
  {
    id: "q-6",
    prompt: "6. Quando está concentrado em algo e é interrompido, você:",
    options: withLetters(["Atende irritado", "Atende sem problemas", "Não atende", "Pede para voltar depois"]),
  },
  {
    id: "q-7",
    prompt: "7. Escolha 3 características que melhor lhe descrevem:",
    type: "multi",
    maxSelections: 3,
    options: withLetters([
      "Analítico","Compreensivo","Cooperativo","Criativo",
      "Extrovertido","Líder","Reservado","Realizador","Tímido",
    ]),
  },
  {
    id: "q-8",
    prompt: "8. Você lê quantos livros por ano?",
    options: withLetters(["1", "2", "3", "4 ou mais", "Nenhum"]),
  },
  {
    id: "q-9",
    prompt: "9. Quando você está em grupo, você costuma:",
    options: withLetters(["Não participa, prefere ouvir", "Participar ativamente", "Participar parcialmente"]),
  },
  {
    id: "q-10",
    prompt: "10. Quando está relaxando, prefere:",
    options: withLetters(["Assistir TV", "Cochilar", "Ler", "Conversar"]),
  },
];

export const sec2: Section = {
  id: "sec-2",
  title: "Seção 2: Hábitos",
  questions,
};
