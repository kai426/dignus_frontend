import type { Job } from "@/@types";
import type { Filters } from "@/features/FilterSheet";

// Importa a URL base do backend do arquivo .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchJobs = async ({
  searchQuery,
  filters,
  sortConfig,
}: {
  searchQuery: string;
  filters: Filters;
  sortConfig: { key: 'publishedAt' | 'title'; direction: 'asc' | 'desc' };
}): Promise<Job[]> => {
  // Monta os parâmetros de consulta (query string)
  const params = new URLSearchParams({
    searchQuery,
    sortKey: sortConfig.key,
    sortDirection: sortConfig.direction,
    ...(filters.company && { company: filters.company }),
    ...(filters.status && { status: filters.status }),
  });

  // Faz a chamada à API do backend
  const response = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar vagas do backend");
  }

  return response.json();
};