// src/@types/tests.ts (ou onde preferir)
import { TestType, VideoResponseType } from "@/api/apiPaths"; // Importe os Enums

// Baseado em Dignus.Data.Models.TestStatus
export enum TestStatus {
    NotStarted = 0,
    InProgress = 1,
    Submitted = 2,
    Approved = 3, // Ou talvez 'Graded', 'Reviewed'? Verifique o uso no backend.
    Rejected = 4,
}

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

// Interface para a estrutura de erro esperada da API
export interface ApiError {
  error?: string;
  message?: string;
}