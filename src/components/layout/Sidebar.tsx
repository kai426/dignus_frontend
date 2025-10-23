import { useState } from "react";
import { Link } from "@tanstack/react-router";
import bemolLogo from "@/assets/BemolRecruta_Assets/18x18px/MARCA_BEMOL.svg";
import { navItems } from "@/constant"; // agora traz { iconCollapsed, iconExpanded }
import UserProfile from "./UserProfile";

const COLLAPSED_W = "w-[76px] 2xl:w-[76px]";
const EXPANDED_W  = "2xl:w-72";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const activeLinkClass = "bg-white/15 ring-1 ring-white/20";

  return (
    <aside
      className={`hidden lg:flex flex-col justify-between h-full bg-[#0385D1] text-white rounded-r-3xl shadow-lg transition-all duration-300 ease-in-out ${
        isExpanded ? EXPANDED_W : COLLAPSED_W
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Topo: Logo */}
      <div>
        <div className={`flex h-20 items-center ${isExpanded ? "pl-6" : "justify-center"}`}>
          <img
            src={bemolLogo}
            alt="Bemol Logo"
            className={`transition-all duration-300 ${isExpanded ? "w-20" : "w-12"}`}
          />
        </div>

        {/* Navegação */}
        <nav className="mt-1">
          <ul className="flex flex-col gap-2.5 px-2 mt-10">
            {navItems.map((item) => (
              <li key={item.key}>
                <Link
                  to={item.to}
                  aria-label={item.label}
                  className={`group flex h-14 items-center rounded-xl transition-colors ${
                    isExpanded ? "gap-3 pl-4 pr-3 hover:bg-white/10" : "justify-center hover:bg-white/10"
                  }`}
                  activeProps={{ className: activeLinkClass }}
                >
                  {/* Ícone:
                      - colapsado: PNG já CONTÉM o círculo branco → apenas centralizar
                      - expandido: PNG “flat” (sem círculo) alinhado com o label
                  */}
                  <img
                    src={isExpanded ? item.iconExpanded : item.iconCollapsed}
                    alt={item.alt}
                    className={
                      isExpanded
                        ? // expandida: ícone ~24px, alinhado à esquerda
                          "h-6 w-6 shrink-0"
                        : // colapsada: ícone ~48px com círculo, perfeitamente centralizado
                          "h-10 w-10 shrink-0"
                    }
                    draggable={false}
                  />

                  {/* Rótulo (apenas quando expandida) */}
                  {isExpanded && (
                    <span className="min-w-0 font-medium text-[15px] tracking-[0.2px]">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Rodapé: Perfil */}
      <div className="p-3">
        <UserProfile isExpanded={isExpanded} />
      </div>
    </aside>
  );
};

export default Sidebar;
