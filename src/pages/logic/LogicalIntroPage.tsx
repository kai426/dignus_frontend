import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

type Props = {
  onBack?: () => void;
  onStart?: () => void;
};

export default function LogicalIntroPage({ onBack, onStart }: Props) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Topbar */}
      <header className="sticky top-0 z-10 w-full h-16 bg-[#0385D1] text-white md:bg-white md:text-gray-900 md:border-b md:border-gray-200">
        <div className="relative flex h-full items-center px-4 md:px-6">
          <button
            onClick={() => navigate({ to: "/selection-process" })}
            className="inline-flex items-center gap-2 text-white md:text-gray-600 md:hover:text-gray-800"
          >
            <ChevronLeft className="size-5" />
            <span className="hidden md:inline text-sm">Voltar ao menu</span>
          </button>
          <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold md:text-[20px]">
            Prova de Matemática
          </h1>
        </div>
      </header>

      {/* Card de instruções */}
      <main className="flex items-center justify-center px-6 py-8">
        <section className="w-full max-w-[620px] rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Como será o teste</h2>

          <p className="mx-auto mt-2 max-w-[500px] text-sm leading-relaxed text-gray-600">
            Você responderá <b>2 perguntas em vídeo</b>. Antes de cada pergunta haverá uma
            <b> contagem regressiva de 5 segundos</b>, e você terá <b>1min30</b> para responder.
            O tempo total estimado é de <b>3 minutos</b>.
          </p>

          <ul className="mx-auto mt-4 grid grid-cols-2 gap-2 text-[13px] text-gray-700">
            <li className="rounded-xl border border-gray-200 px-3 py-2">Sequências & padrões</li>
            <li className="rounded-xl border border-gray-200 px-3 py-2">Proporções & lógica</li>
          </ul>

          <div className="mx-auto mt-6 w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-[13px] leading-snug text-blue-800">
            Dica: pense em voz alta e explique o raciocínio utilizado.
          </div>

          <Button
            onClick={() => navigate({ to: "/logico/preview" })}
            className="mt-6 inline-flex rounded-lg bg-[#0385d1] px-6 py-2 text-white hover:bg-[#0271b2]"
          >
            Começar
          </Button>
        </section>
      </main>
    </div>
  );
}