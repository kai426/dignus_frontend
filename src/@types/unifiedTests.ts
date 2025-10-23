export const TestType = {
  Portuguese: 0,
  Math: 1,
  Psychology: 2,
  VisualRetention: 3,
  Interview: 4,
} as const;

export type TestType = typeof TestType[keyof typeof TestType];

// Para o texto de leitura do teste de português
export interface PortugueseReadingText {
  id: string;
  title: string;
  content: string;
}

// Para as questões que vêm do backend
export interface QuestionSnapshot {
  id: string;
  questionText: string; // Este é o 'prompt'
  optionsJson: string | null;
  allowMultipleAnswers: boolean;
  questionOrder: number;
  pointValue: number;
}

// A estrutura principal do teste
export interface TestInstance {
  id: string;
  testType: TestType;
  candidateId: string;
  status: 'NotStarted' | 'InProgress' | 'Submitted' | 'Approved' | 'Rejected';
  startedAt: string | null;
  portugueseReadingText: PortugueseReadingText | null;
  questions: QuestionSnapshot[];
}

// Para o upload de vídeo (baseado em DTOs/Unified/TestInstanceDtos.cs)
export interface UploadVideoPayload {
  testId: string;
  candidateId: string;
  questionSnapshotId?: string | null; // ID da questão
  questionNumber: number; // 0 para leitura, 1-3 para perguntas
  responseType: 0 | 1; // 0 = Reading, 1 = QuestionAnswer
  videoBlob: Blob;
  fileName: string;
}