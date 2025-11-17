import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface PortugueseTestIntroPageProps {
  onBack?: () => void;
  onStart?: () => void;
}

const TOPICS = [
  "Comunicação verbal",
  "Clareza na leitura",
  "Entonação e ritmo",
  "Confiança e naturalidade",
];

export default function PortugueseTestIntroPage({
  onBack,
  onStart,
}: PortugueseTestIntroPageProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <header className="sticky top-0 z-10 w-full h-16 bg-[#0385D1] text-white md:bg-white md:text-gray-900 md:border-b-2 md:border-gray-200">
        <div className="relative flex h-full items-center px-4 md:px-6">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-white md:text-gray-600 md:hover:text-gray-800"
          >
            <ChevronLeft className="size-5" />
            <span className="hidden md:inline text-sm">Voltar ao menu</span>
          </button>
          <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-white md:text-[20px] md:text-gray-900">
            Teste de Português
          </h1>
        </div>
      </header>

      {/* Conteúdo (inalterado) */}
      <main className="flex items-center justify-center px-6 py-6 mt-10">
        <section className="w-full max-w-[560px] rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Instruções</h2>

          <p className="mx-auto mt-2 max-w-[460px] text-sm leading-relaxed text-gray-500">
           Você responderá 3 perguntas em vídeo e fará uma leitura em vídeo de um texto. Antes de cada pergunta e antes da leitura, haverá uma contagem regressiva de 5 segundos, e você terá 1 minuto para cada resposta. O tempo total e
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3">
            {TOPICS.map((t) => (
              <span
                key={t}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-[13px] font-medium text-gray-700"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mx-auto mt-6 w-full rounded-lg border border-red-200 bg-red-100 px-4 py-3 text-[13px] leading-snug text-red-700">
            Assim que a gravação for iniciada, seu dispositivo solicitará permissão para acessar
            câmera e microfone. <br />
            Clique em <b>“Permitir”</b> para continuar com a atividade.
          </div>

          <Button
            onClick={onStart}
            className="mt-6 inline-flex rounded-lg bg-[#0385d1] px-6 py-2 text-white hover:bg-[#0271b2]"
          >
            Avançar
          </Button>
        </section>
      </main>
    </div>
  );
}
