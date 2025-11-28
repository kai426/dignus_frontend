// src/@types/tests.ts (ou onde preferir)
import { TestType, VideoResponseType } from "@/api/apiPaths"; // Importe os Enums

// Baseado em Dignus.Data.Models.TestStatus
export const TestStatus = {
    NotStarted: 0,
    InProgress: 1,
    Submitted: 2,
    Approved: 3, // Ou talvez 'Graded', 'Reviewed'? Verifique o uso no backend.
    Rejected: 4,
} as const;

export type TestStatus = typeof TestStatus[keyof typeof TestStatus];

// Baseado em DTOs.Unified.PortugueseReadingTextDto
export interface PortugueseReadingTextDto {
    id: string;
    title: string;
    content: string;
    authorName?: string;
    estimatedReadingTimeMinutes?: number;
}

// Baseado em DTOs.Unified.QuestionSnapshotDto (SEM RESPOSTA CORRETA)
export interface QuestionSnapshotDto {
    id: string;
    questionText: string;
    optionsJson?: string; // Precisa de JSON.parse() no frontend
    allowMultipleAnswers: boolean;
    maxAnswersAllowed?: number;
    questionOrder: number;
    pointValue: number;
    estimatedTimeSeconds?: number;
    // NÃO incluir correctAnswerSnapshot ou expectedAnswerGuideSnapshot
}

// Baseado em DTOs.Unified.VideoResponseDto
export interface VideoResponseDto {
    id: string;
    questionSnapshotId?: string;
    questionNumber: number;
    responseType?: VideoResponseType;
    blobUrl: string;
    fileSizeBytes: number;
    uploadedAt: string; // ISO Date String
    score?: string; // Vem da análise de IA externa
    feedback?: string;
    verdict?: string;
    analyzedAt?: string; // ISO Date String
}

// Baseado em DTOs.Unified.QuestionResponseDto
export interface QuestionResponseDto {
    id: string;
    questionSnapshotId: string;
    selectedAnswers: string[]; // Já parseado no DTO backend, vem como array
    responseTimeMs?: number;
    answeredAt: string; // ISO Date String
    isCorrect?: boolean; // Vem após auto-grading
    pointsEarned?: number;
}

// Baseado em DTOs.Unified.TestInstanceDto
export interface TestInstanceDto {
    id: string;
    testType: TestType;
    candidateId: string;
    status: TestStatus;
    score?: number;
    rawScore?: number;
    maxPossibleScore?: number;
    startedAt?: string; // ISO Date String
    completedAt?: string; // ISO Date String
    durationSeconds?: number;
    portugueseReadingTextId?: string;
    portugueseReadingText?: PortugueseReadingTextDto; // Objeto aninhado
    questions: QuestionSnapshotDto[]; // Array de snapshots
    videoResponses: VideoResponseDto[]; // Array de vídeos já enviados
    questionResponses: QuestionResponseDto[]; // Array de respostas MC já enviadas
    metadataJson?: string; // Para outros dados, ex: VisualRetention
}

// Baseado em DTOs.Unified.TestStatusDto
export interface TestStatusDto {
    testId: string;
    status: TestStatus;
    totalQuestions: number;
    questionsAnswered: number;
    videosUploaded: number;
    videosRequired: number;
    canStart: boolean;
    canSubmit: boolean;
    startedAt?: string; // ISO Date String
    remainingTimeSeconds?: number;
}

// Baseado em DTOs.Unified.UploadVideoRequest (para o payload do hook)
export interface UploadVideoRequestPayload {
  testId: string;
  candidateId: string;
  questionSnapshotId?: string; // Obrigatório para Respostas de Interpretação
  questionNumber: number;
  responseType: VideoResponseType; // Obrigatório
  videoBlob: Blob;
  fileName: string;
}

// Baseado em DTOs.Unified.SubmitTestRequest
export interface SubmitTestRequestPayload {
  testId: string;
  candidateId: string;
  answers: QuestionAnswerSubmission[];
}

export interface QuestionAnswerSubmission {
  questionSnapshotId: string;
  selectedAnswers: string[];
  responseTimeMs?: number;
}

// Baseado em DTOs.Unified.TestSubmissionResultDto
export interface TestSubmissionResultDto {
    testId: string;
    status: TestStatus;
    score?: number;
    rawScore?: number;
    maxPossibleScore?: number;
    correctAnswers: number;
    totalQuestions: number;
    durationSeconds?: number;
    message: string;
}

export interface TestQuestion {
  id: string;
  questionText: string;
  optionsJson: string | null; // Vem como string JSON do banco
  allowMultipleAnswers: boolean;
  maxAnswersAllowed: number | null;
  questionOrder: number;
  pointValue: number;
  estimatedTimeSeconds: number | null;
}

export interface TestInstanceV2 {
  id: string;
  testType: string;
  status: 'NotStarted' | 'InProgress' | 'Submitted' | 'Approved' | 'Rejected';
  startedAt: string | null;
  completedAt: string | null;
  timeLimitSeconds: number | null;
  questions: TestQuestion[];
  // Adicionado para permitir o acesso às respostas salvas
  questionResponses?: QuestionResponseDto[]; 
}

export interface AnswerPayload {
  questionSnapshotId: string;
  selectedAnswers: string[];
  responseTimeMs: number;
}

export interface SubmitTestPayload {
  testId: string;
  candidateId: string;
  answers: AnswerPayload[];
}

export interface Option {
  id: string
  label: string
}

export interface Question {
  id: string
  prompt: string
  options: Option[]
  type: 'single' | 'multi' | 'text' | 'number' | 'range'
  maxSelections?: number
  placeholder?: string
  isRequired: boolean
  pointValue?: number
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export type Answers = Record<string, string | string[] | number | null>

export interface Section {
  id: string
  title: string
  questions: Question[]
  order: number
  isCompleted: boolean
}

export interface Questionnaire {
  title: string
  sections: Section[]
  currentSection?: number
  responses?: Answers
  candidateId?: string
  startedAt?: string
  completedAt?: string
  isCompleted?: boolean
}