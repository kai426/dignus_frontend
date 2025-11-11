import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { AxiosError } from 'axios'
import apiClient from '../api/apiClient'
import { API_PATHS, VideoResponseType } from '@/api/apiPaths'
import { toast } from 'sonner'
import type {
  TestInstanceDto,
  SubmitTestRequestPayload,
  TestSubmissionResultDto,
  ApiError,
  VideoResponseDto, 
} from '@/@types/tests'

interface StartTestPayload {
  testId: string
  candidateId: string
}

// --- Funções API ---
const startTestApi = async ({
  testId,
  candidateId,
}: StartTestPayload): Promise<TestInstanceDto> => {
  const path = API_PATHS.TESTS_V2.START(testId, candidateId)
  const { data } = await apiClient.post<TestInstanceDto>(path)
  return data
}

const submitTestApi = async (
  payload: SubmitTestRequestPayload,
): Promise<TestSubmissionResultDto> => {
  const path = API_PATHS.TESTS_V2.SUBMIT(payload.testId)

  // CORREÇÃO (PascalCase): O backend espera o DTO em PascalCase.
  const backendPayload = {
    TestId: payload.testId,
    CandidateId: payload.candidateId,
    Answers: payload.answers.map((ans) => ({
      QuestionSnapshotId: ans.questionSnapshotId,
      SelectedAnswers: ans.selectedAnswers,
      ResponseTimeMs: ans.responseTimeMs,
    })),
  }

  const { data } = await apiClient.post<TestSubmissionResultDto>(
    path,
    backendPayload, // Envia o payload corrigido
  )
  return data
}

// API para upload de vídeo
const uploadVideoApi = async ({
  testId,
  formData,
}: {
  testId: string
  formData: FormData
}): Promise<VideoResponseDto> => {
  const path = API_PATHS.TESTS_V2.UPLOAD_VIDEO(testId)
  const { data } = await apiClient.post<VideoResponseDto>(path, formData, {
    // O axios define o Content-Type 'multipart/form-data' automaticamente
  })
  return data
}

// Payload que o hook de upload espera
export interface UploadVideoPayload {
  testId: string
  candidateId: string
  questionSnapshotId?: string | null // Obrigatório para interpretação, opcional para leitura
  questionNumber: number
  responseType: VideoResponseType
  videoBlob: Blob
  fileName: string
}

/**
 * Hook para fazer upload de um arquivo de vídeo.
 * Lida com o erro 415 corrigindo o payload do FormData.
 */
export const useUploadVideoResponse = (): UseMutationResult<
  VideoResponseDto,
  AxiosError<ApiError>,
  UploadVideoPayload
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: UploadVideoPayload) => {
      const formData = new FormData()

      // --- CORREÇÃO DO ERRO 415: Usar PascalCase ---
      // O backend espera UploadVideoRequest
      formData.append('TestId', payload.testId)
      formData.append('CandidateId', payload.candidateId)
      formData.append('QuestionNumber', payload.questionNumber.toString())
      formData.append('ResponseType', payload.responseType.toString())
      if (payload.questionSnapshotId) {
        formData.append('QuestionSnapshotId', payload.questionSnapshotId)
      }
      formData.append('VideoFile', payload.videoBlob, payload.fileName)
      // --- FIM DA CORREÇÃO ---

      return uploadVideoApi({ testId: payload.testId, formData })
    },
    onSuccess: (data, variables) => {
      const type =
        variables.responseType === VideoResponseType.Reading
          ? 'Leitura'
          : `Questão ${variables.questionNumber}`
      toast.success(`Vídeo (${type}) enviado com sucesso.`)
      // Invalida a query de status do teste para atualizar o progresso
      queryClient.invalidateQueries({
        queryKey: ['testStatus', variables.testId],
      })
    },
    onError: (error, variables) => {
      console.error(
        `Falha ao enviar vídeo da questão ${variables.questionNumber}:`,
        error,
      )
      toast.error(
        `Erro ao enviar vídeo. Tente novamente. (Erro: ${error.response?.status})`,
      )
    },
  })
}

// --- FIM DA LÓGICA DE UPLOAD ---

// --- HOOKS (Seu código existente, agora com useSubmitTest corrigido) ---
export const useStartTest = (): UseMutationResult<
  TestInstanceDto,
  AxiosError<ApiError>,
  StartTestPayload
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: startTestApi,
    onSuccess: (data) => {
      console.log(`Teste ${data.id} iniciado no backend com sucesso.`)
      toast.success('Teste iniciado!')
      queryClient.invalidateQueries({
        queryKey: ['testInstance', data.id, data.candidateId],
      })
      queryClient.invalidateQueries({
        queryKey: ['testStatus', data.id, data.candidateId],
      })
      queryClient.invalidateQueries({
        queryKey: ['candidateTests', data.candidateId],
      })
    },
    onError: (error, variables) => {
      console.error(
        `Falha ao iniciar o teste ${variables.testId} no backend:`,
        error,
      )
      const errorMsg =
        error.response?.data?.message ||
        'Não foi possível iniciar o teste. Tente novamente.'
      toast.error(errorMsg)
    },
  })
}

export const useSubmitTest = (): UseMutationResult<
  TestSubmissionResultDto,
  AxiosError<ApiError>,
  SubmitTestRequestPayload
> => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitTestApi, // Usa a API corrigida com PascalCase
    onSuccess: (data) => {
      console.log(
        `Teste ${data.testId} submetido com sucesso. Score: ${data.score}`,
      )
      toast.success(data.message || 'Teste enviado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['testInstance', data.testId] })
      queryClient.invalidateQueries({ queryKey: ['testStatus', data.testId] })
      queryClient.invalidateQueries({ queryKey: ['candidateTests'] })
    },
    onError: (error, variables) => {
      console.error(`Falha ao submeter o teste ${variables.testId}:`, error)
      const errorMsg =
        error.response?.data?.message ||
        'Erro ao enviar o teste. Tente novamente.'
      toast.error(errorMsg)
    },
  })
}
