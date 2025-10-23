// src/hooks/useTestActions.ts
import { useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import apiClient from '../api/apiClient';
import { API_PATHS } from '@/api/apiPaths';
import { toast } from 'sonner';
import { fetchPortugueseTest } from "@/api/tests";
import type { TestInstanceDto, SubmitTestRequestPayload, TestSubmissionResultDto, ApiError } from '@/@types/tests';

interface StartTestPayload {
  testId: string;
  candidateId: string;
}

// --- Funções API ---
const startTestApi = async ({ testId, candidateId }: StartTestPayload): Promise<TestInstanceDto> => {
  // Passa candidateId como query param na V2, sem corpo na requisição
  const path = API_PATHS.TESTS_V2.START(testId, candidateId);
  const { data } = await apiClient.post<TestInstanceDto>(path); // POST sem corpo
  return data;
};

const submitTestApi = async (payload: SubmitTestRequestPayload): Promise<TestSubmissionResultDto> => {
    const path = API_PATHS.TESTS_V2.SUBMIT(payload.testId);
    const { data } = await apiClient.post<TestSubmissionResultDto>(path, payload);
    return data;
}

// --- Hooks ---
export const useStartTest = (): UseMutationResult<TestInstanceDto, AxiosError<ApiError>, StartTestPayload> => {
  const queryClient = useQueryClient(); // Para invalidar cache

  return useMutation({
    mutationFn: startTestApi,
    onSuccess: (data) => {
      console.log(`Teste ${data.id} iniciado no backend com sucesso.`);
      toast.success("Teste iniciado!");
      // Invalida a query específica desta instância de teste para refletir o novo status
      queryClient.invalidateQueries({ queryKey: ['testInstance', data.id, data.candidateId] });
      // Pode invalidar a query de status também
      queryClient.invalidateQueries({ queryKey: ['testStatus', data.id, data.candidateId] });
       // E a lista geral de testes do candidato
      queryClient.invalidateQueries({ queryKey: ['candidateTests', data.candidateId] });
    },
    onError: (error, variables) => {
      console.error(`Falha ao iniciar o teste ${variables.testId} no backend:`, error);
      const errorMsg = error.response?.data?.message || "Não foi possível iniciar o teste. Tente novamente.";
      toast.error(errorMsg);
    },
  });
};

// Hook para submeter teste (adicionado da resposta anterior, caso não o tenha)
export const useSubmitTest = (): UseMutationResult<TestSubmissionResultDto, AxiosError<ApiError>, SubmitTestRequestPayload> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: submitTestApi,
        onSuccess: (data) => {
            console.log(`Teste ${data.testId} submetido com sucesso. Score: ${data.score}`);
            toast.success(data.message || "Teste enviado com sucesso!");
            // Invalida queries após submissão
             queryClient.invalidateQueries({ queryKey: ['testInstance', data.testId] });
             queryClient.invalidateQueries({ queryKey: ['testStatus', data.testId] });
             queryClient.invalidateQueries({ queryKey: ['candidateTests'] }); // Invalida a lista geral
             // Redirecionar aqui...
        },
        onError: (error, variables) => {
            console.error(`Falha ao submeter o teste ${variables.testId}:`, error);
            const errorMsg = error.response?.data?.message || "Erro ao enviar o teste. Tente novamente.";
            toast.error(errorMsg);
        }
    });
};

export function useSubmitPortugueseTest() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: submitPortugueseTest,
    onSuccess: () => {
      toast.success("Teste de português enviado com sucesso!");
      // Navega para a próxima etapa ou página de conclusão
      navigate({ to: "/main" }); // Exemplo
    },
    onError: (error) => {
      console.error("Erro ao enviar teste de português:", error);
      toast.error("Não foi possível enviar sua resposta. Tente novamente.");
    },
  });
}

// Mantenha os hooks de query (useTestStatus, useTestQuestions) aqui ou mova para useTestQuery.ts
// Exemplo:
// export { useTestStatus, useTestQuestions } from './useTestQuery'; // Se mover