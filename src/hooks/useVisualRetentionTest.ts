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

interface AnswerPayload {
    questionSnapshotId: string;
    selectedAnswers: string[];
    responseTimeMs: number;
}

interface UseTestFlowReturn {
    testId: string | null;
    isLoading: boolean;
    error: string | null;
    questions: Question[];
    createOrGetActiveTest: (candidateId: string, testType: TestType) => Promise<string | null>;
    startTest: (candidateId: string) => Promise<void>;
    fetchQuestions: (candidateId: string, testId: string) => Promise<void>;
    submitTest: (candidateId: string) => Promise<void>;
    submitAnswers: (candidateId: string, answers: AnswerPayload[]) => Promise<any>;
}

export function useVisualRetentionTest(): UseTestFlowReturn {
    const [testId, setTestId] = useState<string | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchQuestions(candidateId: string, testId: string) {
        setIsLoading(true);
        setError(null);

        try {
            const { data } = await apiClient.get<Question[]>(
                API_PATHS.TESTS_V2.GET_QUESTIONS(testId, candidateId)
            );

            setQuestions(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro ao buscar questões");
        } finally {
            setIsLoading(false);
        }
    }

    async function createOrGetActiveTest(
        candidateId: string,
        testTypeNum: TestType
    ): Promise<string | null> {
        setIsLoading(true);
        setError(null);

        try {
            const testTypeStr = testTypeNumberToStringMap[testTypeNum];
            if (!testTypeStr) throw new Error("Tipo de teste inválido");

            const { data: tests } = await apiClient.get<TestSummary[]>(
                API_PATHS.TESTS_V2.GET_ALL_FOR_CANDIDATE(candidateId)
            );

            const activeTest = tests.find(
                (t) => t.testType === testTypeStr && t.status === "InProgress"
            );

            if (activeTest) {
                setTestId(activeTest.id);
                await fetchQuestions(candidateId, activeTest.id);
                return activeTest.id;
            }

            const createBody = {
                candidateId,
                testType: testTypeStr,
            };

            const { data } = await apiClient.post(API_PATHS.TESTS_V2.CREATE, createBody);

            setTestId(data.id);

            // await apiClient.post(API_PATHS.TESTS_V2.START(data.id, candidateId));

            await fetchQuestions(candidateId, data.id);

            return data.id;
        } catch (err: any) {
            setError(err.response?.data?.message || "Erro no fluxo de teste");
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

    async function submitTest(candidateId: string) {
        if (!testId) throw new Error("TestId não definido");

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post(
                `/api/v2/tests/${testId}/submit`,
                {
                    testId,
                    candidateId,
                    answers: []
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Teste submetido com sucesso:", response.data);
            return response.data;

        } catch (err: any) {
            console.error("❌ Erro ao submeter teste:", err.response?.data || err);
            setError(err.response?.data?.message || "Erro ao submeter teste");
        } finally {
            setIsLoading(false);
        }
    }

    async function submitAnswers(candidateId: string, answers: AnswerPayload[]) {
        if (!testId) throw new Error("TestId não definido");

        setIsLoading(true);
        setError(null);

        try {
            const response = await apiClient.post(
                API_PATHS.TESTS_V2.SUBMIT_ANSWERS(testId, candidateId),
                answers,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("📌 RESPOSTA DO BACKEND (submitAnswers):", response.data);

            return response.data;
        } catch (err: any) {
            console.error("❌ ERRO submitAnswers:", err.response?.data || err);

            setError(err.response?.data?.message || "Erro ao enviar respostas");

            throw err;
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
        startTest,
        fetchQuestions,
        submitTest,
        submitAnswers
    };
}
