import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Candidate {
  id: string;
  name: string;
  cpf: string;
  email: string;
  birthDate?: string;
  status: number;
  phone?: string;
  isPCD?: boolean | null;
  pcdDocumentFileName?: string | null;
  pcdDocumentUploadedAt?: string | null;
  pcdDocumentUrl?: string | null;
  createdAt?: string;
}
interface LoginData {
  token: string;
  candidate: Candidate;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (data: LoginData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));

  const isAuthenticated = !!token;


  const login = (data: LoginData) => {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('candidate', JSON.stringify(data.candidate));
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('candidate');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}