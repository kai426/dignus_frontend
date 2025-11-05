import type { QuestionSnapshotDto } from "@/@types/tests";
import apiClient from "./apiClient";
import { API_PATHS } from "./apiPaths";

/**
 * Busca as questões para o teste de português.
 */
export async function fetchPortugueseTest(): Promise<QuestionSnapshotDto[]> {
  const { data } = await apiClient.get<QuestionSnapshotDto[]>(
    API_PATHS.TESTS.PORTUGUESE
  );
  return data;
}

type PortugueseSubmissionPayload = {
  candidateId: string;
  questionId: string;
  audioFile: Blob;
};

/**
 * Envia a resposta do teste de português (áudio).
 */
export async function submitPortugueseTest(
  payload: PortugueseSubmissionPayload
): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append("candidateId", payload.candidateId);
  formData.append("questionId", payload.questionId);
  formData.append("audioFile", payload.audioFile, "recording.webm");

  const { data } = await apiClient.post<{ message: string }>(
    API_PATHS.TESTS.SUBMIT_PORTUGUESE,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}