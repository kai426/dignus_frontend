// src/api/consent.ts
import apiClient from './apiClient'
import { API_PATHS, CONSENT } from './apiPaths'
export interface SubmitConsentPayload {
  cpf: string
  acceptPrivacyPolicy: boolean
  acceptDataSharing: boolean
  acceptCreditAnalysis: boolean
}

/**
 * Payload da RESPOSTA do status de consentimento (GET /api/consent/status/{cpf})
 */
export interface ConsentStatusDto {
  hasAccepted: boolean // O 'GET' pode retornar um 'hasAccepted' consolidado
}

/**
 * Envia o aceite de consentimento para a API.
 */
export const submitConsent = async (payload: SubmitConsentPayload) => {
  // Esta chamada agora enviará o payload completo
  const { data } = await apiClient.post(CONSENT, payload)
  return data
}

/**
 * Busca o status de consentimento (se já foi dado).
 */
export const getConsentStatus = async (
  cpf: string,
): Promise<ConsentStatusDto> => {
  const path = API_PATHS.CONSENT.GET_STATUS(cpf)
  const { data } = await apiClient.get<ConsentStatusDto>(path)
  return data
}