// src/hooks/useAuth.ts
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { onlyDigits } from '@/utils/cpfUtils'
import apiClient from '@/api/apiClient'
import { API_PATHS } from '@/api/apiPaths'
import { toast } from 'sonner'
// Importa o DTO que acabamos de definir
import type { ConsentStatusDto } from '@/api/consent'

// Interfaces V1 (do seu arquivo original)
interface Candidate {
  id: string
  name: string
  cpf: string
  email: string
  status: number
}

interface LoginResponse {
  token: string
  candidate: Candidate
  expiresAt: string
}

// Interface de Erro
interface ApiError {
  message?: string
  error?: string
}

// Função de requisição V1 (Login SÓ POR CPF)
const loginRequest = async (cpf: string): Promise<LoginResponse> => {
  const payload = { cpf: onlyDigits(cpf) }
  const { data } = await apiClient.post<LoginResponse>(
    API_PATHS.AUTH.LOGIN,
    payload,
  )
  return data
}

// Hook V1 com a lógica de verificação de consentimento
export const useLogin = (): UseMutationResult<
  LoginResponse,
  AxiosError<ApiError | string>,
  string
> => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: async (data) => {
      console.log('Login V1 (CPF) bem-sucedido, salvando dados...', data)

      // 1. Salva os dados de login no localStorage
      localStorage.setItem('authToken', data.token)
      localStorage.setItem('candidate', JSON.stringify(data.candidate))

      try {
        // 2. LOGO APÓS o login, verifica o status de consentimento
        const consentPath = API_PATHS.CONSENT.GET_STATUS(data.candidate.cpf)
        const { data: consentStatus } =
          await apiClient.get<ConsentStatusDto>(consentPath)

        // 3. Navega condicionalmente
        // Verifica 'hasAccepted' (do backend novo) ou 'hasConsented' (do seu frontend)
        if (consentStatus.hasAccepted || consentStatus.hasConsented) {
          // Se JÁ consentiu, vai para os testes
          toast.success('Login bem-sucedido!')
          navigate({
            to: '/selection-process/$candidateId',
            params: { candidateId: data.candidate.id },
          })
        } else {
          // Se NÃO consentiu, força a ida para a página de consentimento
          toast.info('Por favor, aceite os termos para continuar.')
          navigate({
            to: '/consent',
          })
        }
      } catch (consentError) {
        // Trata erro na verificação do consentimento
        console.error('Falha ao verificar consentimento:', consentError)
        toast.error(
          'Erro ao verificar seu status de consentimento. Tente novamente.',
        )
        localStorage.removeItem('authToken') // Limpa o login
        localStorage.removeItem('candidate')
      }
    },
    onError: (error) => {
      // (Sua lógica de erro original)
      let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.'
      if (error.response) {
        if (
          error.response.status === 401 &&
          typeof error.response.data === 'string' &&
          error.response.data.includes('Invalid CPF')
        ) {
          errorMessage = 'CPF não encontrado ou inválido.'
        } else if (
          typeof error.response.data === 'object' &&
          error.response.data?.message
        ) {
          errorMessage = error.response.data.message
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        }
      } else if (error.request) {
        errorMessage =
          'Não foi possível conectar ao servidor. Verifique sua conexão.'
      }
      console.error('Falha no login V1:', error.message, error.response?.data)
      toast.error(errorMessage)
    },
  })
}