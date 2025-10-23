import apiClient from '@/api/apiClient';
import { API_PATHS } from '@/api/apiPaths';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

// Tipagem baseada no DTO `PsychologyTestSubmissionDto` do backend
interface SubmitQuestionnairePayload {
  candidateId: string;
  testId: string;
  fixedResponses: Record<string, string>;
}

const submitRequest = async (payload: SubmitQuestionnairePayload) => {
  const { data } = await apiClient.post(
    API_PATHS.QUESTIONNAIRE.SUBMIT_PSYCHOLOGY_RESPONSES,
    payload
  );
  return data;
};

export const useSubmitQuestionnaire = () => {
  return useMutation({
    mutationFn: submitRequest,
    onSuccess: () => {
      toast.success("Questionário enviado com sucesso!");
    },
    onError: (error) => {
      console.error("Falha ao enviar o questionário:", error);
      toast.error("Não foi possível enviar suas respostas. Tente novamente.");
    },
  });
};