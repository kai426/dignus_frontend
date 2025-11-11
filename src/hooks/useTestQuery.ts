// src/hooks/useTestQuery.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import apiClient from '@/api/apiClient'
import { API_PATHS, TestType } from '@/api/apiPaths'
import {
  type TestInstanceDto,
  type ApiError,
  TestStatus,
} from '@/@types/tests'
import { fetchPortugueseTest } from '@/api/tests'
import axios from 'axios' // Importe o axios para o helper isAxiosError

// Função para buscar a instância do teste (sem alterações)
const fetchTestInstance = async (
  testId: string,
  candidateId: string,
): Promise<TestInstanceDto> => {
  const path = API_PATHS.TESTS_V2.GET_BY_ID(testId, candidateId)
  const { data } = await apiClient.get<TestInstanceDto>(path)
  return data
}

// Hook useTestQuery (sem alterações)
export const useTestQuery = (
  testId: string | undefined,
  candidateId: string | undefined,
  options?: { enabled?: boolean },
): UseQueryResult<TestInstanceDto, AxiosError<ApiError>> => {
  return useQuery({
    queryKey: ['testInstance', testId, candidateId],
    queryFn: () => {
      if (!testId || !candidateId) {
        return Promise.reject(
          new Error('testId ou candidateId não fornecido para useTestQuery'),
        )
      }
      return fetchTestInstance(testId, candidateId)
    },
    enabled: !!testId && !!candidateId && options?.enabled !== false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
  })
}

// Função getOrCreateTestApi (AJUSTADA)
const getOrCreateTestApi = async (
  candidateId: string,
  testType: TestType,
): Promise<TestInstanceDto> => {
  // Obtém o nome da string correspondente ao valor numérico do enum
  const testTypeName = (
    Object.keys(TestType) as (keyof typeof TestType)[]
  ).find((key) => TestType[key] === testType)

  if (!testTypeName) {
    throw new Error(`Tipo de teste inválido: ${testType}`)
  }

  // O GET (que estava dando 403) usa ?testType=Portuguese (string)
  const getAllPath =
    API_PATHS.TESTS_V2.GET_ALL_FOR_CANDIDATE(candidateId) +
    `?testType=${testTypeName}`

  // Tenta buscar primeiro
  try {
    console.log(
      `Buscando teste ${testTypeName} para ${candidateId} em ${getAllPath}`,
    )
    const tests = await apiClient.get<TestInstanceDto[]>(getAllPath)

    const existingTest = tests.data.find(
      (t) => t.status !== TestStatus.Submitted,
    )
    if (existingTest) {
      console.log(
        `Teste ${testTypeName} existente encontrado: ${existingTest.id}`,
      )
      // Busca a versão completa
      const fullTest = await fetchTestInstance(existingTest.id, candidateId)
      return fullTest
    } else {
      console.log(
        `Nenhum teste ${testTypeName} ativo encontrado para ${candidateId}, tentando criar...`,
      )
    }
  } catch (error: any) {
    // Se o GET falhar (ex: 403 ou 404), ele continua para o bloco de criação
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      console.error(
        'Erro 403 ao buscar teste. Verifique se o token JWT é válido e corresponde ao candidateId.',
        error.message,
      )
      // NÃO TENTE CRIAR. Se o GET é proibido, o POST também será.
      // Re-lança o erro para o useQuery tratar.
      throw new Error(
        'Acesso negado ao buscar testes. O token pode não corresponder ao candidato.',
      )
    } else {
      console.warn(
        `Erro ao buscar teste ${testTypeName} existente para ${candidateId} (Status: ${error.response?.status}), tentando criar...`,
        error.message,
      )
    }
  }

  // Se a busca falhar ou não retornar nada, tenta criar
  console.log(`Criando novo teste ${testTypeName} para ${candidateId}`)

  // --- CORREÇÃO DO ERRO 500 ---
  // O backend espera PascalCase (CandidateId, TestType)
  // O backend espera o NÚMERO do enum para TestType no POST,
  // ou a STRING se o JsonStringEnumConverter estiver funcionando.
  // Vamos enviar PascalCase como o DTO espera.
  const createPayload = {
    CandidateId: candidateId, // <--- CORRIGIDO
    TestType: testType,       // <--- CORRIGIDO (Envia o número, ex: 0)
    // Se o backend esperar a string no POST, use:
    // TestType: testTypeName
  }
  // --- FIM DA CORREÇÃO ---

  try {
    const createResponse = await apiClient.post<TestInstanceDto>(
      API_PATHS.TESTS_V2.CREATE,
      createPayload,
    )

    console.log(
      `Teste ${testTypeName} criado com ID: ${createResponse.data.id}. Buscando detalhes...`,
    )
    // Busca a versão completa após criar
    const createdTestDetails = await fetchTestInstance(
      createResponse.data.id,
      candidateId,
    )
    return createdTestDetails
  } catch (postError) {
    console.error('Falha CRÍTICA ao criar o teste:', postError)
    throw postError
  }
}

// Hook useGetOrCreateTestQuery (sem alterações)
export const useGetOrCreateTestQuery = (
  candidateId: string | undefined,
  testType: TestType | undefined,
  options?: { enabled?: boolean },
): UseQueryResult<TestInstanceDto, AxiosError<ApiError>> => {
  return useQuery({
    queryKey: ['getOrCreateTest', candidateId, testType],
    queryFn: () => {
      if (!candidateId || testType === undefined) {
        return Promise.reject(
          new Error(
            'candidateId ou testType não fornecido para useGetOrCreateTestQuery',
          ),
        )
      }
      return getOrCreateTestApi(candidateId, testType)
    },
    enabled:
      !!candidateId && testType !== undefined && options?.enabled !== false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  })
}

// usePortugueseTestQuery (sem alterações)
export function usePortugueseTestQuery() {
  return useQuery({
    queryKey: ['portuguese-test'],
    queryFn: fetchPortugueseTest,
  })
}