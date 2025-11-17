import axios, { AxiosError } from 'axios';
import { BASE_URL } from './apiPaths'; // Certifique-se que importa de apiPaths.ts
import { toast } from 'sonner'

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
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Se o corpo da requisição for FormData, remova o Content-Type para que o axios set automaticamente
    if (config.data instanceof FormData && config.headers) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    console.error("Erro no interceptor de requisição:", error);
    return Promise.reject(error);
  }
);

// --- Interceptor de Resposta (Response Interceptor) ---
// Lida com erros globais de forma centralizada
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError<ApiErrorResponse>) => {
    if (error.response) {
      const { status, data } = error.response
      const errorMessage = data?.message || 'Erro desconhecido da API'

      // --- INÍCIO DA MUDANÇA ---

      // Erro 401 (Não autorizado) ou 403 (Proibido)
      // Ambos indicam um problema de autenticação/permissão.
      // A melhor solução é limpar o estado local e forçar o login.
      if (status === 401 || status === 403) {
        console.error(
          `Erro ${status}: ${errorMessage}. Limpando sessão e redirecionando para login.`,
        )
        toast.error('Sua sessão é inválida ou expirou. Por favor, faça login novamente.')

        // Limpa o token antigo e os dados do candidato
        localStorage.removeItem('authToken')
        localStorage.removeItem('candidate')

        // Redireciona para a tela inicial de login (V1)
        // (O fluxo V1 usa a rota '/')
        window.location.href = '/'
      }
      // --- FIM DA MUDANÇA ---

      // Erro 500: Erro interno do servidor
      else if (status >= 500) {
        console.error('Erro interno do servidor (5xx).', errorMessage)
        toast.error('Ocorreu um erro no servidor. Tente novamente mais tarde.')
      }
      // Outros erros (400, 404, 409, etc.)
      else {
        console.warn(`Erro ${status}: ${errorMessage}`)
      }
    }
    // Lida com erros de rede
    else if (error.request) {
      console.error('Erro de rede ou timeout:', error.message)
      toast.error(
        'Não foi possível conectar ao servidor. Verifique sua conexão.',
      )
    }
    // Erro na configuração
    else {
      console.error(
        'Erro inesperado na configuração da requisição:',
        error.message,
      )
    }

    return Promise.reject(error)
  },
);

export default apiClient;