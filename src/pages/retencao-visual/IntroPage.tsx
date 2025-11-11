import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";

export default function IntroPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
          <header className="sticky top-0 z-10 w-full h-16 bg-[#0385D1] text-white md:bg-white md:text-gray-900 md:border-b-2 md:border-gray-200">
            <div className="relative flex h-full items-center px-4 md:px-6">
              <button
                onClick={handleBack}
                className="inline-flex items-center gap-2 text-white md:text-gray-600 md:hover:text-gray-800"
              >
                <ChevronLeft className="size-5" />
                <span className="hidden md:inline text-sm">Voltar ao menu</span>
              </button>
              <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-white md:text-[20px] md:text-gray-900">
                Retenção Visual
              </h1>
            </div>
          </header>

      <main className="flex items-center justify-center px-6 py-8">
        <section className="w-full max-w-[560px] rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Instruções</h2>
          <p className="mx-auto mt-2 max-w-[460px] text-sm leading-relaxed text-gray-600">
            Você verá uma matriz 2×2 com a última célula faltando. Escolha a alternativa que
            <span className="font-medium text-gray-800"> completa logicamente</span> a matriz.
            Todos os elementos da questão são exibidos em <b>P&amp;B</b> — foque em
            <b> forma</b>, <b>padrão</b>, <b>quantidade</b> e <b>paridade</b>.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {["Forma", "Padrão", "Quantidade", "Paridade"].map((t) => (
              <span
                key={t}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-[13px] font-medium text-gray-700"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-6 w-full rounded-lg border border-red-200 bg-red-100 px-4 py-3 text-[13px] leading-snug text-red-800">
            Dica: ignore cores. Observe a sequência por linha/coluna e a relação entre
            <b> cheios</b> (●) e <b>anéis</b> (◎).
          </div>

          <Button
            onClick={() => navigate({ to: "/retencao-visual/teste" })}
            className="mt-6 inline-flex rounded-lg bg-[#0385d1] px-6 py-2 text-white hover:bg-[#0271b2]"
          >
            Começar
          </Button>
        </section>
      </main>
    </div>
  );
}
