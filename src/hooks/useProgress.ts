import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

// Tipagem baseada no DTO de progresso do backend (AuthDto.cs)
interface TestProgressDto {
  testType: string;
  status: "NotStarted" | "InProgress" | "Completed";
  isCompleted: boolean;
  score?: number;
  completedAt?: string;
}

interface ProgressDto {
  candidateId: string;
  completionPercentage: number;
  completedTests: number;
  totalTests: number;
  testProgress: Record<string, TestProgressDto>;
}

// Função que chama a API
const fetchProgress = async (candidateId: string): Promise<ProgressDto> => {
  const { data } = await apiClient.get(`/api/v2/tests/candidate/${candidateId}/progress`);
  return data;
};

// Hook que será usado na página
export const useCandidateProgress = (candidateId: string) => {
  return useQuery({
    // Chave única para o cache do Tanstack Query
    queryKey: ['progress', candidateId],
    queryFn: () => fetchProgress(candidateId),
    // A query só será executada se o candidateId for válido
    enabled: !!candidateId,
  });
};