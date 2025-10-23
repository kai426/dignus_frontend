import type { Option, Question } from "@/@types";

export const letter = (i: number) => String.fromCharCode(65 + i);

export const withLetters = (labels: string[]): Option[] =>
  labels.map((label, i) => ({
    id: letter(i).toLowerCase(),
    label: `${letter(i)}) ${label}`,
  }));

export const makeQuestionsFromPrompts = (
  prompts: string[],
  startIndex: number,
  optionLabels: string[]
): Question[] =>
  prompts.map((text, idx): Question => ({
    id: `q-${startIndex + idx}`,
    prompt: `${startIndex + idx}. ${text}`,
    options: withLetters(optionLabels),
  }));
