import apiClient from './apiClient'
import { API_PATHS } from './apiPaths'
import { getStoredCandidate } from './auth'

// Interface para o DTO de submissão do backend
interface SubmitConsentPayload {
  cpf: string
  acceptPrivacyPolicy: boolean
  acceptDataSharing: boolean
  acceptCreditAnalysis: boolean
}

// --- INÍCIO DA ADIÇÃO ---
// Interface para a resposta do status (DTO que faltava)
export interface ConsentStatusDto {
  hasAccepted: boolean // O backend V1 (legacy) usa 'hasConsented', mas o V2 usa 'hasAccepted'
  acceptedAt?: string
  privacyPolicyVersion?: string
  // Adicionando a propriedade do V1 caso o backend esteja misto
  hasConsented?: boolean 
}

/**
 * Busca o status de consentimento atual do candidato.
 */
export async function getConsentStatus(): Promise<ConsentStatusDto> {
  const candidate = getStoredCandidate()
  if (!candidate?.cpf) {
    throw new Error('Candidato não encontrado para checar consentimento.')
  }

  const path = API_PATHS.CONSENT.GET_STATUS(candidate.cpf)
  const { data } = await apiClient.get<ConsentStatusDto>(path)
  return data
}

/**
 * Envia o aceite do termo de consentimento.
 */
export async function submitConsent(
  payload: SubmitConsentPayload,
): Promise<unknown> {
  const path = API_PATHS.CONSENT.SUBMIT
  const { data } = await apiClient.post(path, payload)
  return data
}