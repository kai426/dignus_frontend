import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useMediaStore } from "@/store/useMediaStore";
import userAvatar from "@/assets/BemolRecruta_Assets/images/avatar.png";
import { getStoredCandidate } from "@/api/auth"; // 1. ADICIONE ESTA IMPORTAÇÃO

const UserProfile = ({ isExpanded }: { isExpanded: boolean }) => {
  const navigate = useNavigate();

  // 2. BUSQUE OS DADOS DO CANDIDATO DO LOCALSTORAGE
  const candidate = getStoredCandidate();

  const handleLogout = () => {
    // 1. Limpa os dados de autenticação do localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("candidate");

    // 2. Limpa o estado de mídia (desliga câmera/microfone se estiverem ativos)
    useMediaStore.getState().powerOff();

    // 3. Redireciona para a página de login (rota raiz)
    navigate({ to: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={`
            flex items-center w-full rounded-lg transition-colors hover:bg-black/10
            focus:outline-none focus:ring-2 focus:ring-white/40
            ${isExpanded ? "gap-3 p-2" : "justify-center h-12"}
          `}
        >
          <img
            src={userAvatar}
            alt="Avatar do usuário"
            className="size-10 shrink-0 rounded-full object-cover"
          />
          <div
            className={`
              overflow-hidden transition-opacity duration-200 text-left
              ${isExpanded ? "opacity-100" : "opacity-0 pointer-events-none"}
            `}
          >
            {/* 3. DADOS DINÂMICOS AQUI */}
            <p className="font-bold text-sm whitespace-nowrap">
              {candidate?.name ?? "Candidato"}
            </p>
            <p className="text-xs text-white/80 whitespace-nowrap">
              {candidate?.email ?? "..."}
            </p>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-64"
        align="end"
        side="top"
        sideOffset={12}
      >
        {/* 4. DADOS DINÂMICOS TAMBÉM NO HEADER DO DROPDOWN */}
        <div className="px-2 py-1.5">
          <p className="font-semibold text-sm truncate">
            {candidate?.name ?? "Candidato"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {candidate?.email ?? "..."}
          </p>
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;