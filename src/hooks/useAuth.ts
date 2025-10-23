// src/hooks/useAuth.ts
import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { AxiosError } from 'axios';
import { onlyDigits } from "@/utils/cpfUtils";
import apiClient from '@/api/apiClient';
import { API_PATHS } from '@/api/apiPaths'; // Agora deve encontrar AUTH.LOGIN
import { toast } from 'sonner';

// Interfaces V1
interface Candidate {
  id: string;
  name: string;
  cpf: string;
  email: string;
  status: number;
}

interface LoginResponse {
  token: string;
  candidate: Candidate;
  expiresAt: string;
}

// Interface de Erro (pode ser genérica ou específica)
interface ApiError {
  message?: string; // Tenta usar a propriedade message se existir
  error?: string;   // Tenta usar a propriedade error se existir
  // Adicione outros campos se a API retornar
}

// Função de requisição V1
const loginRequest = async (cpf: string): Promise<LoginResponse> => {
  const payload = { cpf: onlyDigits(cpf) };
  // Acessa o endpoint legado /api/auth/login
  const { data } = await apiClient.post<LoginResponse>(API_PATHS.AUTH.LOGIN, payload);
  return data;
};

// Hook V1 - Único exportado
export const useLogin = (): UseMutationResult<LoginResponse, AxiosError<ApiError | string>, string> => {
  //                                                                        ^ Permite ApiError ou string no erro
  const navigate = useNavigate();

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      console.log("Login V1 bem-sucedido:", data);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("candidate", JSON.stringify(data.candidate));

      navigate({
        to: '/selection-process/$candidateId',
        params: { candidateId: data.candidate.id },
      });
    },
    onError: (error) => {
      let errorMessage = "Ocorreu um erro inesperado. Tente novamente.";

      if (error.response) {
        // CORREÇÃO: Verifica o status e o *tipo* da resposta antes de comparar
        // O backend V1 para 401 retorna apenas a string "Invalid CPF" no corpo
        if (error.response.status === 401 && typeof error.response.data === 'string' && error.response.data.includes("Invalid CPF")) {
           errorMessage = "CPF não encontrado ou inválido.";
        }
        // Tenta pegar a propriedade 'message' se a resposta for um objeto JSON
        else if (typeof error.response.data === 'object' && error.response.data?.message) {
            errorMessage = error.response.data.message;
        }
        // Se for uma string (diferente de "Invalid CPF"), usa a string
        else if (typeof error.response.data === 'string') {
            errorMessage = error.response.data;
        }
      } else if (error.request) {
        errorMessage = "Não foi possível conectar ao servidor. Verifique sua conexão.";
      }

      console.error("Falha no login V1:", error.message, error.response?.data);
      toast.error(errorMessage);
    },
  });
};

// NÃO exporte useRequestAuthToken e useValidateAuthToken daqui