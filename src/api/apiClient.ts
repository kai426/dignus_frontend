import axios, { AxiosError } from 'axios';
import { BASE_URL } from './apiPaths'; // Certifique-se que importa de apiPaths.ts

// Cria a instância do Axios com configurações base
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // Aumentei um pouco o timeout para 15s
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interface para erro da API (opcional, ajuste conforme necessário)
interface ApiErrorResponse {
  error?: string;
  message?: string;
  lockedUntil?: string; // Para erros de lockout
  // Adicione outros campos se a API retornar mais detalhes
}

// --- Interceptor de Requisição (Request Interceptor) ---
// Adiciona o token de autenticação a cada requisição
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Nome da chave onde guarda o token JWT
    if (token && config.headers) {
      // Garante que o cabeçalho Authorization seja adicionado
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Retorna o erro para ser tratado pela chamada que o originou
    console.error("Erro no interceptor de requisição:", error);
    return Promise.reject(error);
  }
);

// --- Interceptor de Resposta (Response Interceptor) ---
// Lida com erros globais de forma centralizada
apiClient.interceptors.response.use(
  // Se a resposta for bem-sucedida, apenas a retorna
  (response) => {
    return response;
  },
  // Se ocorrer um erro, ele é tratado aqui
  (error: AxiosError<ApiErrorResponse>) => {
    // Verifica se o erro possui uma resposta do servidor
    if (error.response) {
      const { status, data } = error.response;
      const errorMessage = data?.message || "Erro desconhecido da API";
      const errorCode = data?.error || "UNKNOWN_API_ERROR";

      // Erro 401: Não autorizado (token inválido ou expirado)
      if (status === 401) {
        // Limpa o token antigo e redireciona para a página de login
        // Idealmente, você usaria o gerenciamento de estado (Zustand?) para limpar dados do usuário
        console.error("Erro 401: Não autorizado ou sessão expirada.", errorMessage);
        localStorage.removeItem('authToken');
        localStorage.removeItem('candidate'); // Limpa também dados do candidato
        // Redireciona para a tela inicial do fluxo de login (onde pede CPF/Email)
        // Certifique-se que '/auth/request-token' é a rota correta no seu frontend
        window.location.href = '/auth/request-token';
        // Você pode querer mostrar uma notificação (toast) aqui
        // toast.error("Sua sessão expirou. Por favor, faça login novamente.");

      }
      // Erro 403: Proibido (ex: IDOR - tentou acessar dados de outro candidato)
      else if (status === 403) {
           console.error("Erro 403: Acesso proibido.", errorMessage);
           // Talvez redirecionar para uma página de "não autorizado" ou mostrar um toast
           // toast.error("Você não tem permissão para acessar este recurso.");
      }
      // Erro 500: Erro interno do servidor
      else if (status >= 500) {
        console.error("Erro interno do servidor (5xx).", errorMessage);
        // Mostrar um toast genérico para erro de servidor
        // toast.error("Ocorreu um erro no servidor. Tente novamente mais tarde.");
      }
      // Outros erros (400, 404, 409, etc.) - serão tratados localmente pelo useMutation/useQuery
      else {
          console.warn(`Erro ${status}: ${errorCode} - ${errorMessage}`);
      }
    }
    // Lida com erros de rede (ex: timeout, servidor offline)
    else if (error.request) {
       console.error("Erro de rede ou timeout:", error.message);
       // Mostrar um toast genérico para erro de rede
       // toast.error("Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.");
    }
    // Erro na configuração do Axios ou outro erro inesperado
    else {
      console.error('Erro inesperado na configuração da requisição:', error.message);
    }

    // Retorna o erro para que possa ser tratado localmente também (ex: em um .catch() no TanStack Query)
    return Promise.reject(error);
  }
);

export default apiClient;