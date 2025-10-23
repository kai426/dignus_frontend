/**
 * Verifica se o token de autenticação (JWT) existe no localStorage.
 * @returns {boolean} True se o token existir, false caso contrário.
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken'); // Nome da chave onde guarda o token JWT
  // Para uma verificação mais robusta, você pode decodificar o token
  // e checar a data de expiração (exp claim). Bibliotecas como 'jwt-decode' podem ajudar.
  // Exemplo básico: return !!token;
  return !!token;
};

/**
 * Obtém os dados do candidato armazenados no localStorage.
 * @returns {Candidate | null} Os dados do candidato ou null se não encontrados/inválidos.
 */
export const getStoredCandidate = (): Candidate | null => {
    const candidateData = localStorage.getItem('candidate');
    if (!candidateData) {
        return null;
    }
    try {
        // É importante fazer parse dentro de um try-catch
        return JSON.parse(candidateData) as Candidate;
    } catch (error) {
        console.error("Erro ao fazer parse dos dados do candidato:", error);
        localStorage.removeItem('candidate'); // Remove dados inválidos
        return null;
    }
};

// Interface Candidate (exemplo, ajuste conforme sua necessidade)
interface Candidate {
  id: string;
  name: string;
  cpf: string;
  email: string;
  status: number;
}