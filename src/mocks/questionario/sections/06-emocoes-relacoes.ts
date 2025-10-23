import type { Section, Question } from "@/@types";
import { withLetters } from "../helpers";

const questions: Question[] = [
  {
    id: "q-33",
    prompt: "33. Assinale a alternativa abaixo que mais se parece com você.",
    options: withLetters([
      "Fico preocupado(a) com coisas pequenas",
      "Frequentemente me sinto ansioso(a)",
      "Tenho dificuldade de me aproximar dos outros",
      "Tenho medo de chamar atenção",
    ]),
  },
  {
    id: "q-34",
    prompt: "34. Assinale a alternativa abaixo que mais se parece com você.",
    options: withLetters([
      "Sinto-me à vontade em torno de pessoas",
      "Sou mais reservado(a), prefiro ficar sem interações",
      "Frequentemente evito contato social. Falo quando acho necessário",
      "Só me sinto bem com meus amigos(as)",
    ]),
  },
  {
    id: "q-35",
    prompt: "35. Assinale a alternativa abaixo que mais se parece com você.",
    options: withLetters([
      "Tenho um amplo interesse em várias coisas",
      "Gosto de fazer coisas sem pensar",
      "Novas atividades me deixam entusiasmado(a)",
      "Prefiro fazer atividades que já tenho familiaridade",
    ]),
  },
  {
    id: "q-36",
    prompt: "36. Assinale a alternativa abaixo que mais se parece com você.",
    options: withLetters([
      "Tenho empatia pelos sentimentos dos outros",
      "Gosto de cooperar com os outros",
      "Sinto compaixão dos que estão em situações piores do que eu",
      "Evito me envolver em situações emocionais das outras pessoas",
    ]),
  },
  {
    id: "q-37",
    prompt: "37. Você considera que o medo atrapalha a obtenção de seus melhores resultados?",
    options: withLetters([
      "Não. Mas fico sempre atento para não perder alguma oportunidade por medo",
      "Não. Pois sou muito autoconfiante",
      "Sim. E me incomodo muito com isso",
      "Sim. Mas não me incomodo com isso",
    ]),
  },
];

export const sec6: Section = {
  id: "sec-6",
  title: "Seção 6: Emoções e Relações Interpessoais",
  questions,
};
