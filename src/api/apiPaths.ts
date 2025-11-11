// Define a URL base da API a partir das variáveis de ambiente
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Enum para TestType (como const)
export const TestType = {
    Portuguese: 0,
    Math: 1,
    Psychology: 2,
    VisualRetention: 3,
    Interview: 5,
} as const;

// Exporta o *tipo* para uso em outros lugares (isto é "apagável")
export type TestType = typeof TestType[keyof typeof TestType];


// Enum para VideoResponseType (como const e com valores corretos)
export const VideoResponseType = {
  Reading: 1,        // Corrigido de 0 para 1
  QuestionAnswer: 2, // Corrigido de 1 para 2
} as const;

// Exporta o *tipo*
export type VideoResponseType = typeof VideoResponseType[keyof typeof VideoResponseType];

// Objeto com os paths da API V2
export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/auth/login", // <- Endpoint V1 legado
        GET_PROGRESS: (candidateId: string) => `/api/auth/progress/${candidateId}`, // <- Endpoint V1 legado
    },
    // Nova Autenticação por Token (CPF + Email)
    CANDIDATE_AUTH: {
        REQUEST_TOKEN: "/api/candidate-auth/request-token", // POST { cpf, email }
        VALIDATE_TOKEN: "/api/candidate-auth/validate-token", // POST { cpf, tokenCode }
        LOCKOUT_STATUS: (cpf: string) => `/api/candidate-auth/lockout-status/${cpf}`, // GET
    },
    // Consentimento LGPD
    CONSENT: {
        GET_STATUS: (cpf: string) => `/api/consent/status/${cpf}`, // GET
        SUBMIT: "/api/consent", // POST { cpf, acceptPrivacyPolicy, acceptDataSharing, acceptCreditAnalysis }
        GET_POLICY: "/api/consent/privacy-policy", // GET
    },
    // Gerenciamento de Candidatos (mantido da v1, verificar se houve mudanças)
    CANDIDATE: {
        GET_BY_ID: (id: string) => `/api/candidate/${id}`, // GET
        CREATE: "/api/candidate", // POST
        UPDATE: (id: string) => `/api/candidate/${id}`, // PUT
        SEARCH: "/api/candidate/search", // GET com query params: pageNumber, pageSize, searchTerm
        GET_PROFILE: (id: string) => `/api/candidate/${id}/profile`, // GET
        UPDATE_STATUS: (id: string) => `/api/candidate/${id}/status`, // PATCH { status }
        GET_JOB: (id: string) => `/api/candidate/${id}/job`, // GET
    },
    // Gerenciamento de Vagas (mantido da v1, verificar se houve mudanças)
    JOB: {
        SEARCH: "/api/job", // GET com query params do JobSearchRequest
        GET_BY_ID: (id: string) => `/api/job/${id}`, // GET
        GET_STATISTICS: "/api/job/statistics", // GET
        APPLY: (id: string) => `/api/job/${id}/apply`, // POST { candidateId, coverLetter?, additionalDocuments? }
        GET_CANDIDATES: (id: string) => `/api/job/${id}/candidates`, // GET (recruiter only)
    },
    // API Unificada de Testes V2
    TESTS_V2: {
        CREATE: "/api/v2/tests", // POST { candidateId, testType, difficultyLevel? }
        GET_BY_ID: (testId: string, candidateId: string) => `/api/v2/tests/${testId}?candidateId=${candidateId}`, // GET
        GET_ALL_FOR_CANDIDATE: (candidateId: string, testType?: TestType) =>
            `/api/v2/tests/candidate/${candidateId}${testType !== undefined ? `?testType=${testType}` : ''}`, // GET
        START: (testId: string, candidateId: string) => `/api/v2/tests/${testId}/start?candidateId=${candidateId}`, // POST
        SUBMIT: (testId: string) => `/api/v2/tests/${testId}/submit`, // POST { testId, candidateId, answers: [{ questionSnapshotId, selectedAnswers, responseTimeMs? }] }
        GET_QUESTIONS: (testId: string, candidateId: string) => `/api/v2/tests/${testId}/questions?candidateId=${candidateId}`, // GET
        GET_STATUS: (testId: string, candidateId: string) => `/api/v2/tests/${testId}/status?candidateId=${candidateId}`, // GET
        CAN_START: (candidateId: string, testType: TestType) => `/api/v2/tests/candidate/${candidateId}/can-start/${testType}`, // GET

        // Respostas em Vídeo (para testes de Português, Matemática, Entrevista)
        UPLOAD_VIDEO: (testId: string) => `/api/v2/tests/${testId}/videos`, // POST FormData { testId, candidateId, questionSnapshotId?, questionNumber, responseType?, videoFile }
        GET_TEST_VIDEOS: (testId: string, candidateId: string) => `/api/v2/tests/${testId}/videos?candidateId=${candidateId}`, // GET
        GET_VIDEO_RESPONSE: (testId: string, videoId: string, candidateId: string) => `/api/v2/tests/${testId}/videos/${videoId}?candidateId=${candidateId}`, // GET
        GET_SECURE_VIDEO_URL: (testId: string, videoId: string, candidateId: string, expirationMinutes?: number) =>
            `/api/v2/tests/${testId}/videos/${videoId}/url?candidateId=${candidateId}${expirationMinutes ? `&expirationMinutes=${expirationMinutes}` : ''}`, // GET
        DELETE_VIDEO: (testId: string, videoId: string, candidateId: string) => `/api/v2/tests/${testId}/videos/${videoId}?candidateId=${candidateId}`, // DELETE

        // Respostas de Múltipla Escolha (para testes de Psicologia, Retenção Visual)
        SUBMIT_ANSWERS: (testId: string, candidateId: string) => `/api/v2/tests/${testId}/answers?candidateId=${candidateId}`, // POST [{ questionSnapshotId, selectedAnswers, responseTimeMs? }]
        GET_TEST_ANSWERS: (testId: string, candidateId: string) => `/api/v2/tests/${testId}/answers?candidateId=${candidateId}`, // GET
        UPDATE_ANSWER: (testId: string, responseId: string, candidateId: string) => `/api/v2/tests/${testId}/answers/${responseId}?candidateId=${candidateId}`, // PUT { questionSnapshotId, selectedAnswers, responseTimeMs? }
        DELETE_ANSWER: (testId: string, responseId: string, candidateId: string) => `/api/v2/tests/${testId}/answers/${responseId}?candidateId=${candidateId}`, // DELETE
    },
    QUESTIONNAIRE: {
        // Rota baseada no QuestionnaireController.cs
        SUBMIT_PSYCHOLOGY_RESPONSES: "/api/questionnaire/submit-psychology", // POST { candidateId, testId, fixedResponses }
    },
    TESTS: {
    PORTUGUESE: "/tests/portuguese", // Endpoint para buscar as questões
    SUBMIT_PORTUGUESE: "/candidate/portuguese", // Endpoint para enviar o áudio
  },
    // Endpoints de Status/Healthcheck (mantidos da v1)
    STATUS: {
        GET: "/api/status", // GET
        GET_PROTECTED: "/api/status/protected", // GET (Requires Auth)
    },
    // Endpoints Legados (Manter se necessário para compatibilidade ou remover)
    LEGACY_MEDIA: {
        UPLOAD_AUDIO: "/api/media/audio",
        UPLOAD_VIDEO: "/api/media/video",
        // ... outros endpoints de /api/media
    },
    LEGACY_TEST: {
        // ... endpoints de /api/test
    },
    // ... outros endpoints legados como QUESTIONNAIRE, PORTUGUESE_QUESTIONS, etc., se ainda forem usados.
};