// src/hooks/useTestQuery.ts
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import apiClient from '@/api/apiClient';
import { API_PATHS, TestType } from '@/api/apiPaths'; // Certifique-se que TestType está exportado de apiPaths
import { type TestInstanceDto, type ApiError, TestStatus } from '@/@types/tests';
import { fetchPortugueseTest } from "@/api/tests";

// Função para buscar a instância do teste (sem alterações aqui)
const fetchTestInstance = async (
    testId: string,
    candidateId: string
): Promise<TestInstanceDto> => {
    const path = API_PATHS.TESTS_V2.GET_BY_ID(testId, candidateId);
    const { data } = await apiClient.get<TestInstanceDto>(path);
    return data;
};

// Hook useTestQuery (sem alterações aqui)
export const useTestQuery = (
    testId: string | undefined,
    candidateId: string | undefined,
    options?: { enabled?: boolean }
): UseQueryResult<TestInstanceDto, AxiosError<ApiError>> => {
    // ... (código existente)
    return useQuery({
        queryKey: ['testInstance', testId, candidateId],
        queryFn: () => {
            if (!testId || !candidateId) {
                return Promise.reject(new Error("testId ou candidateId não fornecido para useTestQuery"));
            }
            return fetchTestInstance(testId, candidateId);
        },
        enabled: !!testId && !!candidateId && (options?.enabled !== false),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
    });
};


// Função getOrCreateTestApi (AJUSTADA)
const getOrCreateTestApi = async (candidateId: string, testType: TestType): Promise<TestInstanceDto> => {
    // --- CORREÇÃO GET: Enviar nome do enum na query string ---
    // Obtém o nome da string correspondente ao valor numérico do enum
    const testTypeName = (Object.keys(TestType) as (keyof typeof TestType)[]).find(
        (key) => TestType[key] === testType
    );
    const getAllPath = API_PATHS.TESTS_V2.GET_ALL_FOR_CANDIDATE(candidateId) + `?testType=${testTypeName}`; // Adiciona ?testType=NomeEnum

    // Tenta buscar primeiro
    try {
        console.log(`Buscando teste ${testTypeName} para ${candidateId} em ${getAllPath}`);
        const tests = await apiClient.get<TestInstanceDto[]>(getAllPath); // Usa o path ajustado

        const existingTest = tests.data.find(t => t.status !== TestStatus.Submitted); // Procura teste não submetido
        if (existingTest) {
            console.log(`Teste ${testTypeName} existente encontrado: ${existingTest.id}`);
            // Se GET_ALL_FOR_CANDIDATE não retorna todos os detalhes (ex: questions),
            // busca a versão completa. Se já retorna, pode otimizar e retornar direto.
            try {
                const fullTest = await fetchTestInstance(existingTest.id, candidateId);
                return fullTest;
            } catch (fetchFullError) {
                console.error(`Erro ao buscar detalhes completos do teste ${existingTest.id}, tentando criar um novo...`, fetchFullError);
                // Continua para a criação se buscar detalhes falhar
            }
        } else {
            console.log(`Nenhum teste ${testTypeName} ativo encontrado para ${candidateId}, tentando criar...`);
        }
    } catch (error: any) {
        // Log específico para erro 400 na busca, antes de tentar criar
        if (error.isAxiosError && error.response?.status === 400) {
            console.error(`Erro 400 ao buscar teste ${testTypeName} para ${candidateId}:`, error.response.data);
        } else {
            console.warn(`Erro ao buscar teste ${testTypeName} existente para ${candidateId}, tentando criar...`, error.message);
        }
        // Continua para a criação mesmo se a busca falhar (exceto se for um erro inesperado grave)
    }

    // --- CORREÇÃO POST: Enviar nome do enum no corpo ---
    console.log(`Criando novo teste ${testTypeName} para ${candidateId}`);
    // O payload agora envia o nome do enum como string
    const createPayload = { candidateId, testType: testTypeName };
    const createResponse = await apiClient.post<TestInstanceDto>(API_PATHS.TESTS_V2.CREATE, createPayload);

    console.log(`Teste ${testTypeName} criado com ID: ${createResponse.data.id}. Buscando detalhes...`);
    // Busca a versão completa após criar para garantir todos os dados (questões, etc.)
    const createdTestDetails = await fetchTestInstance(createResponse.data.id, candidateId);
    return createdTestDetails;
}

// Hook useGetOrCreateTestQuery (sem alterações na definição, mas usará a função API corrigida)
export const useGetOrCreateTestQuery = (
    candidateId: string | undefined,
    testType: TestType | undefined,
    options?: { enabled?: boolean }
): UseQueryResult<TestInstanceDto, AxiosError<ApiError>> => {
    return useQuery({
        queryKey: ['getOrCreateTest', candidateId, testType],
        queryFn: () => {
            if (!candidateId || testType === undefined) {
                return Promise.reject(new Error("candidateId ou testType não fornecido para useGetOrCreateTestQuery"));
            }
            // Chama a função corrigida
            return getOrCreateTestApi(candidateId, testType);
        },
        enabled: !!candidateId && testType !== undefined && (options?.enabled !== false),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

export function usePortugueseTestQuery() {
    return useQuery({
        queryKey: ["portuguese-test"],
        queryFn: fetchPortugueseTest,
    });
}