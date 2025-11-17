// src/hooks/useConsent.ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import {
  getConsentStatus,
  submitConsent,
  type SubmitConsentPayload,
  type ConsentStatusDto,
} from '@/api/consent'
import { getStoredCandidate } from '@/api/auth'
import type { ApiError } from '@/@types/tests'
import { onlyDigits } from '@/utils/cpfUtils'

/**
 * Interface que a Página (ConsentPage) passa para o hook.
 * A página continua simples, só se importa com um aceite.
 */
interface ConsentHookVariables {
  hasAccepted: boolean
}

/**
 * Hook para enviar o aceite de consentimento.
 */
export const useSubmitConsent = () => {
  const navigate = useNavigate()
  const candidate = getStoredCandidate()

  return useMutation<unknown, AxiosError<ApiError>, ConsentHookVariables>({
    mutationFn: async (variables) => {
      const safeCpf = candidate?.cpf ? onlyDigits(candidate.cpf) : null

      if (!safeCpf) {
        throw new Error(
          'CPF do candidato não encontrado. Faça login novamente.',
        )
      }

      // --- AQUI ESTÁ A CORREÇÃO ---
      // Traduz o 'hasAccepted: true' da página
      // para o payload granular que o backend espera.
      const payload: SubmitConsentPayload = {
        cpf: safeCpf,
        acceptPrivacyPolicy: variables.hasAccepted, // true
        acceptDataSharing: variables.hasAccepted,   // true
        acceptCreditAnalysis: variables.hasAccepted, // true
      }

      // Envia o payload completo
      return submitConsent(payload)
    },
    onSuccess: () => {
      toast.success('Termo aceito. Redirecionando...')
      if (candidate?.id) {
        navigate({
          to: '/selection-process/$candidateId',
          params: { candidateId: candidate.id },
        })
      } else {
        navigate({ to: '/' }) // Fallback
      }
    },
    onError: (error) => {
      console.error('Falha ao aceitar consentimento:', error)
      // Mensagem genérica, pois o erro 400 agora é 'incomplete consent'
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        'Houve um erro ao salvar seu aceite.'
      toast.error(errorMsg)
    },
  })
}

/**
 * Hook para buscar o status de consentimento.
 */
export const useConsentStatus = () => {
  const candidate = getStoredCandidate()
  const safeCpf = candidate?.cpf ? onlyDigits(candidate.cpf) : undefined

  return useQuery<ConsentStatusDto, AxiosError<ApiError>>({
    queryKey: ['consentStatus', safeCpf],
    queryFn: () => {
      if (!safeCpf) {
        throw new Error('CPF do candidato não encontrado para buscar status.')
      }
      return getConsentStatus(safeCpf)
    },
    enabled: !!safeCpf,
    staleTime: Infinity,
  })
}