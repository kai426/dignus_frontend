import apiClient from '@/api/apiClient';
import { API_PATHS } from '@/api/apiPaths';
import { useQuery } from '@tanstack/react-query';

// NOVO: Interfaces para tipar os dados que vêm do backend (baseado nos DTOs)
interface QuestionOption {
  id: string;
  label: string;
}

interface Question {
  id: string;
  prompt: string; // Mapeado do campo "Text" do backend
  options: QuestionOption[];
  type: 'single' | 'multi' | 'text';
}

// ALTERADO: A tipagem agora inclui a lista de questões
interface TestData {
  id: string;
  status: string;
  questions: Question[];
}

// ALTERADO: A função agora usa o API_PATHS
const fetchTest = async (candidateId: string, testType: string): Promise<TestData> => {
  const path = API_PATHS.TEST.GET_OR_CREATE_BY_TYPE(testType, candidateId);
  const { data } = await apiClient.get<TestData>(path);
  return data;
};

export const useTest = (candidateId: string, testType: string) => {
  return useQuery({
    queryKey: ['test', candidateId, testType],
    queryFn: () => fetchTest(candidateId, testType),
    enabled: !!candidateId && !!testType,
    // NOVO: Adiciona opções para evitar refetching constante durante o teste
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
};