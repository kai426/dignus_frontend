// src/hooks/usePsychologyTest.ts
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/api/apiClient';
import { API_PATHS, TestType } from '@/api/apiPaths';
import type { TestInstanceV2, AnswerPayload } from '@/@types/tests';
import { toast } from 'sonner';

export const usePsychologyTest = (candidateId: string) => {
  const queryClient = useQueryClient();

  // 1. Busca ou Cria o Teste
  const fetchOrCreateTest = async (): Promise<TestInstanceV2> => {
    // PASSO A: Verifica se já existe um teste na lista
    let existingTestId: string | null = null;
    
    try {
      const { data: existingTests } = await apiClient.get<TestInstanceV2[]>(
        API_PATHS.TESTS_V2.GET_ALL_FOR_CANDIDATE(candidateId, TestType.Psychology)
      );

      if (existingTests && existingTests.length > 0) {
        existingTestId = existingTests[0].id;
      }
    } catch (err) {
      console.warn("Erro ao buscar lista, tentando criar novo...");
    }

    // PASSO B: Se existe, busca os DETALHES COMPLETOS (com as questões)
    if (existingTestId) {
      const { data: fullTest } = await apiClient.get<TestInstanceV2>(
        API_PATHS.TESTS_V2.GET_BY_ID(existingTestId, candidateId)
      );
      // setCurrentTestId(fullTest.id); // REMOVIDO
      return fullTest;
    }

    // PASSO C: Se não existe, CRIA um novo
    const { data: newTest } = await apiClient.post<TestInstanceV2>(
      API_PATHS.TESTS_V2.CREATE,
      {
        candidateId,
        testType: TestType.Psychology,
        difficultyLevel: "medium" 
      }
    );
    // setCurrentTestId(newTest.id); // REMOVIDO
    return newTest;
  };

  const { data: testInstance, isLoading, error, refetch } = useQuery({
    queryKey: ['psychology-test', candidateId],
    queryFn: fetchOrCreateTest,
    retry: false,
    staleTime: Infinity, 
    refetchOnWindowFocus: false,
  });

  // CORREÇÃO: Deriva o ID diretamente dos dados carregados
  const currentTestId = testInstance?.id;

  // 2. Iniciar o Teste (Start Timer)
  const startTestMutation = useMutation({
    mutationFn: async (testId: string) => {
      return apiClient.post(API_PATHS.TESTS_V2.START(testId, candidateId));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['psychology-test', candidateId] });
    }
  });

  // 3. Enviar Respostas (Endpoint /answers)
  const submitAnswersMutation = useMutation({
    mutationFn: async (answers: AnswerPayload[]) => {
      // Agora verifica a variável derivada, que sempre existirá se o teste carregou
      if (!currentTestId) throw new Error("Test ID not found");
      
      return apiClient.post(
        API_PATHS.TESTS_V2.SUBMIT_ANSWERS(currentTestId, candidateId),
        answers 
      );
    },
    onError: () => {
      toast.error("Erro ao salvar resposta. Verifique sua conexão.");
    }
  });

  // 4. Finalizar Teste (Endpoint /submit)
  const finishTestMutation = useMutation({
    mutationFn: async () => {
      if (!currentTestId) throw new Error("Test ID not found");

      return apiClient.post(API_PATHS.TESTS_V2.SUBMIT(currentTestId), {
        testId: currentTestId,
        candidateId,
        answers: [] 
      });
    },
    onSuccess: () => {
      toast.success("Teste finalizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ['psychology-test', candidateId] });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao finalizar o teste.");
    }
  });

  useEffect(() => {
    if (testInstance?.status === 'NotStarted' && testInstance.id && !startTestMutation.isPending) {
        startTestMutation.mutate(testInstance.id);
    }
  }, [testInstance?.status, testInstance?.id]);

  return {
    testInstance,
    isLoading,
    error,
    submitAnswer: submitAnswersMutation.mutateAsync,
    isSavingAnswer: submitAnswersMutation.isPending,
    finishTest: finishTestMutation.mutateAsync,
    isFinishing: finishTestMutation.isPending,
    refetch 
  };
};