import type { Section, Question } from "@/@types";
import { withLetters } from "../helpers";

const questions: Question[] = [
  {
    id: "q-42",
    prompt: "42. Quando decide ir a uma festa, você se arruma.",
    options: withLetters([
      "De forma simples sem preocupação com a opinião dos outros",
      "De forma modesta para não chamar a atenção",
      "Se arruma tanto que acaba chamando a atenção",
    ]),
  },
  {
    id: "q-43",
    prompt: "43. Antes de dormir, você procura.",
    options: withLetters([
      "Fazer uma prece para agradecer o dia que teve",
      "Não procura pensar em nada, apenas se deita e dorme",
      "Pensar sobre os principais acontecimentos do dia",
    ]),
  },
  {
    id: "q-44",
    prompt: "44. Você consegue ficar à vontade e sentir-se relaxado, quando.",
    options: withLetters([
      "Está rodeado de pessoas conhecidas",
      "Quando está fazendo algo que gosta",
      "Quando está sozinho",
      "Quando está ocupado e ninguém o incomoda",
    ]),
  },
  {
    id: "q-45",
    prompt: "45. Marque 3 tipos de literatura que você prefere. (Escolha 3 Opções)",
    type: "multi",
    maxSelections: 3,
    options: withLetters([
      "Literatura adulta: romance, crônicas, contos e novela",
      "Literatura científica",
      "Literatura crítica",
      "Literatura ficção científica",
      "Literatura humorística",
      "Literatura religiosa",
    ]),
  },
  {
    id: "q-46",
    prompt: "46. Das 3 coisas abaixo, o que você escolheria se tivesse apenas 1 desejo?",
    options: withLetters(["Ser apenas rico(a)", "Ser apenas feliz", "Ter apenas saúde"]),
  },
];

export const sec8: Section = {
  id: "sec-8",
  title: "Seção 8: Estilo Pessoal e Preferências",
  questions,
};
