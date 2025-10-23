import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface InterviewTestIntroPageProps {
  onBack?: () => void;
  onStart?: () => void;
}

const TOPICS = [
  "Comunicação verbal",
  "Clareza das respostas",
  "Presença e postura",
  "Confiança e naturalidade",
];

export default function InterviewTestIntroPage({
  onBack,
  onStart,
}: InterviewTestIntroPageProps) {
  //const HEADER_PX = 64;

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
            Entrevista de Vídeo
          </h1>
        </div>
      </header>

      <main
        className="flex items-center justify-center px-6 py-6 mt-10"
      >
        <section className="w-full max-w-[560px] rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Instruções</h2>

          <p className="mx-auto mt-2 max-w-[460px] text-sm leading-relaxed text-gray-500">
            Você terá até <span className="font-semibold text-gray-700">30 minutos</span> para
            5 perguntas em vídeo sobre diferentes aspectos do seu perfil profissional, como:
          </p>

          {/* Pills — 2 colunas */}
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
            className="mt-6 inline-flex rounded-lg bg-[#0385d1] px-6 py-2 text-white hover:bg-[#0271b2] cursor-pointer"
          >
            Avançar
          </Button>
        </section>
      </main>
    </div>
  );
}
