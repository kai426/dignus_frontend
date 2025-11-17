import { useState } from "react";
import apiClient from "@/api/apiClient";
import { API_PATHS } from "@/api/apiPaths";

export const TestType = {
    Portuguese: 1,
    Psychology: 3,
    Math: 2,
    VisualRetention: 4,
    Interview: 5,
} as const;

export type TestType = typeof TestType[keyof typeof TestType];

export type VideoResponseType = "Reading" | "QuestionAnswer";

const testTypeNumberToStringMap: Record<number, string> = {
    [TestType.Portuguese]: "Portuguese",
    [TestType.Psychology]: "Psychology",
    [TestType.Math]: "Math",
    [TestType.VisualRetention]: "VisualRetention",
    [TestType.Interview]: "Interview",
};

interface Question {
    id: string;
    questionText: string;
    questionOrder: number;
}

interface TestSummary {
    id: string;
    testType: string;
    status: string;
}

interface UseTestFlowReturn {
    testId: string | null;
    isLoading: boolean;
    error: string | null;
    questions: Question[];
    createOrGetActiveTest: (candidateId: string, testType: TestType) => Promise<string | null>;
    startTest: (candidateId: string) => Promise<void>;
    fetchQuestions: (candidateId: string, testId: string) => Promise<void>;
    uploadVideo: (
        file: File | Blob,
        questionSnapshotId: string,
        questionNumber?: number,
        responseType?: VideoResponseType,
        candidateId?: string
    ) => Promise<any>;
    submitTest: (candidateId: string) => Promise<void>;
    createOrGetActivePortugueseTest: (candidateId: string) => Promise<any | null>
}

export function useTestFlow(): UseTestFlowReturn {
    const [testId, setTestId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchQuestions(candidateId: string, testId: string) {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await apiClient.get<Question[]>(API_PATHS.TESTS_V2.GET_QUESTIONS(testId, candidateId));
            setQuestions(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao buscar questões");
        } finally {
            setIsLoading(false);
        }
    }

    async function createOrGetActiveTest(candidateId: string, testTypeNum: TestType): Promise<string | null> {
        setIsLoading(true);
        setError(null);
        try {
            const testTypeStr = testTypeNumberToStringMap[testTypeNum];
            if (!testTypeStr) throw new Error("Tipo de teste inválido");

            const { data: tests } = await apiClient.get<TestSummary[]>(API_PATHS.TESTS_V2.GET_ALL_FOR_CANDIDATE(candidateId));
            const activeTest = tests.find((t) => t.testType === testTypeStr && t.status === "InProgress");
            if (activeTest) {
                setTestId(activeTest.id);
                await fetchQuestions(candidateId, activeTest.id);
                return activeTest.id;
            }

            const createBody = {
                candidateId,
                testType: testTypeStr,
                ...(testTypeNum === TestType.Portuguese && { difficultyLevel: "medium" }),
            };

            const { data } = await apiClient.post(API_PATHS.TESTS_V2.CREATE, createBody);
            setTestId(data.id);
            await apiClient.post(API_PATHS.TESTS_V2.START(data.id, candidateId));
            await fetchQuestions(candidateId, data.id);
            return data.id;
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro no fluxo de teste");
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    async function createOrGetActivePortugueseTest(candidateId: string): Promise<string | null> {
        setIsLoading(true);
        setError(null);

        try {
            const testTypeStr = testTypeNumberToStringMap[TestType.Portuguese];
            if (!testTypeStr) throw new Error("Tipo de teste inválido");

            // Busca todos os testes do candidato
            const { data: tests } = await apiClient.get<TestSummary[]>(
                API_PATHS.TESTS_V2.GET_ALL_FOR_CANDIDATE(candidateId)
            );

            // Tenta encontrar teste de Português
            let activeTest: TestSummary | undefined = tests.find(
                (t) => t.testType === testTypeStr && (t.status === "InProgress" || t.status === "NotStarted")
            );

            // Se não existir, cria um novo teste
            if (!activeTest) {
                const createBody = {
                    candidateId,
                    testType: testTypeStr,
                    difficultyLevel: "medium",
                };
                const { data } = await apiClient.post<TestSummary>(API_PATHS.TESTS_V2.CREATE, createBody);
                activeTest = data;
            }

            setTestId(activeTest.id);

            // Se o teste ainda não foi iniciado, inicia agora
            if (activeTest.status === "NotStarted") {
                await apiClient.post(API_PATHS.TESTS_V2.START(activeTest.id, candidateId));
                activeTest.status = "InProgress";
            }

            // Busca as perguntas do teste
            await fetchQuestions(candidateId, activeTest.id);

            return activeTest.id;

        } catch (err: any) {
            setError(err.response?.data?.message || "Erro no fluxo do teste de Português");
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    async function startTest(candidateId: string) {
        if (!testId) throw new Error("TestId não definido");
        setIsLoading(true);
        setError(null);
        try {
            await apiClient.post(API_PATHS.TESTS_V2.START(testId, candidateId));
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao iniciar teste");
        } finally {
            setIsLoading(false);
        }
    }

    async function uploadVideo(
        file: Blob | File,
        questionSnapshotId: string,
        questionNumber?: number,
        responseType?: VideoResponseType,
        candidateId?: string
    ) {
        if (!testId) throw new Error("TestId não definido");
        if (!candidateId) throw new Error("CandidateId não definido");

        setIsLoading(true);
        setError(null);

        try {
            if (!["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-ms-wmv"].includes(file.type)) {
                throw new Error("Formato de vídeo não suportado.");
            }

            const formData = new FormData();
            formData.append("questionSnapshotId", questionSnapshotId);
            if (questionNumber) formData.append("questionNumber", String(questionNumber));
            formData.append("videoFile", file, file instanceof File ? file.name : "resposta.mp4");
            if (responseType) formData.append("responseType", responseType);

            const response = await apiClient.post(
                `/api/v2/tests/${testId}/videos?candidateId=${candidateId}`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const total = progressEvent.total ?? 1;
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / total);
                        console.log(`Upload: ${percentCompleted}%`);
                    },
                }
            );

            console.log("✅ Vídeo enviado com sucesso:", response.data);

            // 🔹 Retorna só os dados essenciais que o submit precisa
            return {
                questionSnapshotId,
                responseType: responseType || "QuestionAnswer",
                questionOrder: questionNumber,
                blobUrl: response.data?.blobUrl || response.data?.url || response.data?.path || null,
            };
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Erro ao enviar vídeo");
            throw err; // garante que o uploadAllVideos capture o erro corretamente
        } finally {
            setIsLoading(false);
        }
    }


    async function submitTest(candidateId: string) {
        if (!testId) throw new Error("TestId não definido");
        setIsLoading(true);
        setError(null);
        try {
            const response = await apiClient.post(
                `/api/v2/tests/${testId}/submit`,
                { testId, candidateId },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("✅ Teste submetido com sucesso:", response.data);
            return response.data;
        } catch (err: any) {
            console.error("❌ Erro ao submeter teste:", err.response?.data || err);
            setError(err.response?.data?.message || "Erro ao submeter teste");
        } finally {
            setIsLoading(false);
        }
    }

    return {
        testId,
        isLoading,
        error,
        questions,
        createOrGetActiveTest,
        createOrGetActivePortugueseTest,
        startTest,
        fetchQuestions,
        uploadVideo,
        submitTest,
    };
}
