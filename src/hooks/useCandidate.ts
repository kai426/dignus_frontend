import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/apiClient';

// Tipagem do DTO do perfil do candidato
interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  status: number;
}

// Função que busca os dados
const fetchCandidateProfile = async (candidateId: string): Promise<CandidateProfile> => {
  const { data } = await apiClient.get(`/api/candidate/${candidateId}/profile`);
  return data;
};

// Hook de query para ser usado nos componentes
export const useCandidateProfile = (candidateId: string) => {
  return useQuery({
    queryKey: ['candidateProfile', candidateId], // Chave de cache única
    queryFn: () => fetchCandidateProfile(candidateId),
    enabled: !!candidateId, // Só executa a query se o ID existir
  });
};