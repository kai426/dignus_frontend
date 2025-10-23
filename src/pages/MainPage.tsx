// src/pages/MainPage.tsx

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

// Componentes e Constantes
import JobCard from "@/components/JobCard";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FilterSheet, type Filters } from "@/features/FilterSheet";
import { jobs as initialJobsData } from "@/constant"; // Importe os dados para o estado inicial
import MainLayout from "@/layouts/MainLayout";

// Lógica da API
import { fetchJobs } from "@/api/jobs";

// Ícones
import { ChevronDown, ChevronUp, Filter, Search, Loader2 } from "lucide-react";

const MainPage = () => {
    // 1. ESTADOS PARA CONTROLAR A UI
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>({});
    const [sortConfig, setSortConfig] = useState<{ key: 'publishedAt' | 'title'; direction: 'asc' | 'desc' }>({
        key: 'publishedAt',
        direction: 'desc',
    });

    // 2. USEQUERY PARA BUSCAR E PROCESSAR OS DADOS
    const { data: displayedJobs, isLoading } = useQuery({
        queryKey: ['jobs', searchQuery, filters, sortConfig],
        queryFn: () => fetchJobs({ searchQuery, filters, sortConfig }),
        initialData: initialJobsData, // Evita um "flash" de carregamento na primeira renderização
        staleTime: Infinity, // Os dados só mudam quando a queryKey muda
    });

    // Label para o botão de ordenação
    const sortLabel = useMemo(() => {
        if (sortConfig.key === 'publishedAt') return 'Data de publicação';
        if (sortConfig.key === 'title') return 'Título';
        return 'Ordenar por';
    }, [sortConfig.key]);

    return (
        <MainLayout>
            {/* Header e StatCards (sem alterações) */}
            <header className="mb-6">
                <h1 className="text-[32px] font-semibold leading-9 text-[#1F2937]">Minhas candidaturas</h1>
                <p className="text-[#5B6470] mt-1">Confira todos os seus processos seletivos em andamento</p>
            </header>
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard label="Vagas em aberto" value="122" />
                <StatCard label="Aplicações recebidas" value="5962" />
                <StatCard label="Vagas prestes a expirar" value="12" />
                <StatCard label="Vagas congeladas" value="57" />
            </section>

            {/* 3. CONTROLES CONECTADOS AOS ESTADOS */}
            <section className="mb-6">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                    <div className="flex-1 relative">
                        <Search className="size-5 absolute left-3 top-1/2 -translate-y-1/2 text-black/40" />
                        <Input
                            placeholder="Buscar por cargo ou palavra-chave…"
                            className="h-[44px] pl-10 rounded-xl border-[#E2E6EB]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    
                    <FilterSheet activeFilters={filters} onApplyFilters={setFilters}>
                        <Button asChild variant="outline" className="h-[44px] rounded-xl border-[#E2E6EB]">
                            <div><Filter className="size-4 mr-2" />Filtrar</div>
                        </Button>
                    </FilterSheet>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-black/70">Ordenar por:</span>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="h-[44px] w-[180px] justify-between rounded-xl border-[#E2E6EB]">
                                    {sortLabel}
                                    <ChevronDown className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setSortConfig(prev => ({ ...prev, key: 'publishedAt' }))}>
                                    Data de publicação
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortConfig(prev => ({ ...prev, key: 'title' }))}>
                                    Título
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="outline"
                            size="icon"
                            className="h-[44px] w-[44px] rounded-xl border-[#E2E6EB]"
                            onClick={() => setSortConfig(prev => ({ ...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc' }))}
                        >
                            {sortConfig.direction === 'asc' ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                        </Button>
                    </div>
                </div>
            </section>

            {/* 4. RENDERIZAÇÃO CONDICIONAL DA LISTA */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 min-h-[300px]">
                {isLoading ? (
                    <div className="col-span-full flex justify-center items-center">
                        <Loader2 className="size-8 animate-spin text-gray-400" />
                    </div>
                ) : displayedJobs?.length > 0 ? (
                    displayedJobs.map((j) => (
                        <JobCard key={j.id} job={j} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-gray-500 pt-10">
                        Nenhuma vaga encontrada com os critérios selecionados.
                    </div>
                )}
            </section>

            <div className="mt-8 flex justify-end">
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900">Ver mais</button>
            </div>
        </MainLayout>
    );
};

export default MainPage;