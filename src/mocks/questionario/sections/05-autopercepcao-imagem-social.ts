import type { Section, Question } from "@/@types";
import { withLetters } from "../helpers";

const questions: Question[] = [
  {
    id: "q-26",
    prompt: "26. Com que frequência você se sente alegre ao longo de um dia?",
    options: withLetters(["Me considero uma pessoa alegre o tempo todo", "Muitas vezes", "Poucas vezes"]),
  },
  {
    id: "q-27",
    prompt: "27. Você é engajado em algum projeto ou programa social? Se sim, qual?",
    type: "text",
    placeholder: "Descreva suas atividades...",
    options: [],
  },
  { id: "q-28", prompt: "28. Como você se define?", options: withLetters(["Adaptável","Analítico","Animado(a)","Aventureiro(a)"]) },
  { id: "q-29", prompt: "29. Qual característica abaixo melhor lhe define?", options: withLetters(["Brincalhão","Persistente","Persuasivo","Calmo"]) },
  { id: "q-30", prompt: "30. Qual característica abaixo você gostaria de ter mais desenvolvida?", options: withLetters(["Determinação","Doador","Sociável","Submisso"]) },
  { id: "q-31", prompt: "31. Qual é a imagem que os outros têm de você?", options: withLetters(["Pessoa colaborativa","Pessoa competidora","Pessoa solitária","Não me interesso pelo assunto"]) },
  {
    id: "q-32",
    prompt: "32. Você considera que o medo atrapalha a obtenção de seus melhores resultados?",
    options: withLetters([
      "Não. Mas fico sempre atento para não perder alguma oportunidade por medo",
      "Não. Pois sou muito autoconfiante",
      "Sim. E me incomodo muito com isso",
      "Sim. Mas não me incomodo com isso",
    ]),
  },
];

export const sec5: Section = {
  id: "sec-5",
  title: "Seção 5: Autopercepção e Imagem Social",
  questions,
};
