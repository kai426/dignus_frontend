import { ChevronLeft } from "lucide-react";

export default function Topbar({
  onBack,
  hideBack = false,
  title = "Teste de Português",
}: {
  onBack?: () => void;
  hideBack?: boolean;
  title?: string;
}) {
  return (
    // Mobile: azul e texto branco; LG+: branco (como desktop)
    <header className="sticky top-0 z-10 w-full h-16 bg-[#0385D1] text-white md:bg-white md:text-gray-900 md:border-b-2 md:border-gray-200">
      <div className="relative flex h-full items-center px-4 md:px-6">
        {!hideBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 hover:opacity-90 text-white lg:text-gray-600 lg:hover:text-gray-800"
          >
            <ChevronLeft className="size-4" />
            {/* No mobile mantemos o texto pequeno; pode esconder se quiser só o ícone */}
            <span className="text-sm hidden sm:inline">Voltar ao menu</span>
          </button>
        )}

        <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[18px] sm:text-[19px] lg:text-[20px] font-semibold">
          {title}
        </h1>
      </div>
    </header>
  );
}
