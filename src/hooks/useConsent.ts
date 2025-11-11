// src/hooks/useConsent.ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { getConsentStatus, submitConsent } from '@/api/consent'
import { getStoredCandidate } from '@/api/auth'
import type { ApiError } from '@/@types/tests' // Seu tipo de erro Padrão

// Payload que o hook vai receber da página (ConsentPage)
interface ConsentVariables {
  acceptPrivacyPolicy: boolean
  acceptDataSharing: boolean
  acceptCreditAnalysis: boolean
}

/**
 * Hook para enviar o aceite de consentimento.
 * Usado pela ConsentPage.
 */
export const useSubmitConsent = () => {
  const navigate = useNavigate()
  const candidate = getStoredCandidate() // Pega os dados do localStorage

  return useMutation<unknown, AxiosError<ApiError>, ConsentVariables>({
    mutationFn: (variables) => {
      if (!candidate?.cpf) {
        throw new Error(
          'CPF do candidato não encontrado para enviar consentimento.',
        )
      }
      // Envia o payload que o backend espera
      return submitConsent({
        cpf: candidate.cpf,
        ...variables,
      })
    },
    onSuccess: () => {
      toast.success('Termo aceito. Redirecionando para os testes...')
      // Navega para a página de seleção de processo após o sucesso
      if (candidate?.id) {
        navigate({
          to: '/selection-process/$candidateId',
          params: { candidateId: candidate.id },
        })
      } else {
        navigate({ to: '/' }) // Fallback para login
      }
    },
    onError: (error) => {
      console.error('Falha ao aceitar consentimento:', error)
      const errorMsg =
        error.response?.data?.message || 'Houve um erro ao salvar seu aceite.'
      toast.error(errorMsg)
    },
  })
}

/**
 * Hook para buscar o status de consentimento (se necessário em outros lugares).
 * Este hook não é usado pela ConsentPage, mas é uma boa prática mantê-lo.
 */
export const useConsentStatus = () => {
  const candidate = getStoredCandidate()
  return useQuery({
    queryKey: ['consentStatus', candidate?.cpf],
    queryFn: getConsentStatus,
    enabled: !!candidate?.cpf, // Só executa se o CPF existir
    staleTime: Infinity, // Não precisa re-buscar
  })
}