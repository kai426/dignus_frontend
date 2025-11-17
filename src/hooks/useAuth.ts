import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import axios, { AxiosError } from 'axios'
import { onlyDigits } from '@/utils/cpfUtils'
import apiClient from '@/api/apiClient'
import { API_PATHS } from '@/api/apiPaths'
import { toast } from 'sonner'
import type { ConsentStatusDto } from '@/api/consent'

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

interface ApiError {
  message?: string
  error?: string
}

const loginRequest = async (cpf: string): Promise<LoginResponse> => {
  const payload = { cpf: onlyDigits(cpf) }
  const { data } = await apiClient.post<LoginResponse>(
    API_PATHS.AUTH.LOGIN,
    payload,
  )
  return data
}

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

      localStorage.setItem('authToken', data.token)
      localStorage.setItem('candidate', JSON.stringify(data.candidate))

      try {
        const consentPath = API_PATHS.CONSENT.GET_STATUS(data.candidate.cpf)
        const { data: consentStatus } =
          await apiClient.get<ConsentStatusDto>(consentPath)

        if (consentStatus.hasAccepted) {
          // 1. JÁ ACEITOU: Vai para os testes
          toast.success('Login bem-sucedido!')
          navigate({
            to: '/selection-process/$candidateId',
            params: { candidateId: data.candidate.id },
          })
        } else {
          // 2. TEM O REGISTRO, MAS NÃO ACEITOU: Força o consentimento
          // (Este caso pode não acontecer, mas é bom ter)
          toast.info('Por favor, aceite os termos para continuar.')
          navigate({
            to: '/consent',
          })
        }
      } catch (consentError) {
        // --- AQUI ESTÁ A CORREÇÃO ---
        // Verifica se o erro é um 404 (Não Encontrado)
        if (axios.isAxiosError(consentError) && consentError.response?.status === 404) {
          
          // 3. NÃO TEM O REGISTRO (404): É um novo usuário, força o consentimento
          // Isso NÃO é um erro fatal.
          console.log('Status 404 recebido (normal para novo usuário). Redirecionando para /consent.')
          toast.info('Por favor, aceite os termos para continuar.')
          navigate({
            to: '/consent',
          })
        } else {
          // 4. OUTRO ERRO (500, 401, etc.): É uma falha real.
          console.error('Falha ao verificar consentimento:', consentError)
          toast.error(
            'Erro ao verificar seu status de consentimento. Tente novamente.',
          )
          localStorage.removeItem('authToken') // Limpa o login
          localStorage.removeItem('candidate')
        }
      }
    },
    onError: (error) => {
      // (Sua lógica de erro de login original está correta)
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