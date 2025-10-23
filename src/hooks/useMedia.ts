// src/hooks/useMedia.ts
import { useMutation, type UseMutationResult, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import apiClient from '../api/apiClient';
import { API_PATHS, VideoResponseType } from '@/api/apiPaths'; // Importar enum também
import { toast } from 'sonner';
import type { UploadVideoRequestPayload, VideoResponseDto, ApiError } from '@/@types/tests'; // Importar tipos V2

// Função API atualizada para V2
const uploadVideoApi = async (payload: UploadVideoRequestPayload): Promise<VideoResponseDto> => {
  const formData = new FormData();

  // Adiciona campos V2 ao FormData
  formData.append('testId', payload.testId);
  formData.append('candidateId', payload.candidateId);
  formData.append('questionNumber', payload.questionNumber.toString());
  formData.append('responseType', payload.responseType.toString()); // Envia o valor numérico do enum
  if (payload.questionSnapshotId) { // ID do Snapshot é opcional (obrigatório para interpretação, não para leitura)
    formData.append('questionSnapshotId', payload.questionSnapshotId);
  }
  formData.append('videoFile', payload.videoBlob, payload.fileName);

  // Endpoint V2
  const path = API_PATHS.TESTS_V2.UPLOAD_VIDEO(payload.testId);

  const { data } = await apiClient.post<VideoResponseDto>(path, formData, {
    // Axios geralmente define Content-Type: multipart/form-data automaticamente para FormData
    // headers: { 'Content-Type': 'multipart/form-data' }, // Desnecessário
     onUploadProgress: (progressEvent) => { // Feedback de progresso
        if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
            // Atualizar UI com progresso aqui...
        }
     }
  });
  return data;
};

// Hook atualizado
export const useUploadVideoResponse = (): UseMutationResult<VideoResponseDto, AxiosError<ApiError>, UploadVideoRequestPayload> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadVideoApi,
    onSuccess: (data, variables) => {
      console.log(`Vídeo ${variables.fileName} (Q${variables.questionNumber}, Type:${variables.responseType}) enviado:`, data.id);
      toast.success(`Resposta ${variables.responseType === VideoResponseType.Reading ? 'da leitura' : `da questão ${variables.questionNumber}`} enviada!`);
      // Invalida queries para atualizar a lista de vídeos e o status do teste
      queryClient.invalidateQueries({ queryKey: ['testInstance', variables.testId, variables.candidateId] });
      queryClient.invalidateQueries({ queryKey: ['testStatus', variables.testId, variables.candidateId] });
    },
    onError: (error, variables) => {
      console.error(`Falha no upload do vídeo "${variables.fileName}"`, error);
      const errorMsg = error.response?.data?.message || `Falha no upload do vídeo ${variables.responseType === VideoResponseType.Reading ? 'da leitura' : `da questão ${variables.questionNumber}`}.`;
      toast.error(errorMsg);
    },
  });
};

// Mantém o useUploadVideo original se ainda for usado para o endpoint legado /api/media/video
// Senão, pode remover o código antigo.
/*
interface UploadPayloadV1 { ... }
const uploadVideoV1 = async (...) => { ... API_PATHS.LEGACY_MEDIA.UPLOAD_VIDEO ... }
export const useUploadVideoV1 = () => { return useMutation({ mutationFn: uploadVideoV1, ... }); };
*/