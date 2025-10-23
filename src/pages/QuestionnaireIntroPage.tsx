import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";

interface QuestionnaireIntroPageProps {
  durationMinutes?: number;
  questionCount?: number;
  topics?: string[];
  onBack?: () => void;
}

const DEFAULT_TOPICS = [
  "Resolução de problemas",
  "Liderança",
  "Adaptabilidade",
  "Gestão do tempo",
  "Trabalho em equipe",
  "Comunicação",
];

export default function QuestionnaireIntroPage({
  durationMinutes = 30,
  questionCount = 52,
  topics = DEFAULT_TOPICS,
}: QuestionnaireIntroPageProps) {
  const navigate = useNavigate();

  const { candidateId } = useParams({
    from: '/selection-process/$candidateId/questionario/intro',
  });

  const goBack = () => navigate({ 
    to: "/selection-process/$candidateId", 
    params: { candidateId } 
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* MOBILE azul | DESKTOP igual ao original (branco com borda) */}
      <header className="sticky top-0 z-10 w-full h-16 bg-[#0385D1] text-white md:bg-white md:text-gray-900 md:border-b-2 md:border-gray-200">
        <div className="relative flex h-full items-center px-4 md:px-6">
          <button
            onClick={goBack}
            className="inline-flex items-center gap-2 text-white md:text-gray-600 md:hover:text-gray-800"
          >
            <ChevronLeft className="size-5" />
            <span className="hidden md:inline text-sm">Voltar ao menu</span>
          </button>
          <h1 className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-[18px] font-semibold text-white md:text-[20px] md:text-gray-900">
            Questionário de Perfil
          </h1>
        </div>
      </header>

      <main className="flex items-start justify-center px-4 md:px-6 py-6 md:py-10">
        {/* MOBILE: largura menor; DESKTOP: volta ao 560px original */}
        <section className="w-full max-w-[440px] md:max-w-[560px] rounded-[20px] md:rounded-2xl border border-gray-200 bg-white p-5 md:p-8 text-center shadow-sm">
          <h2 className="text-[20px] md:text-xl font-semibold text-gray-900">Instruções</h2>

          <p className="mx-auto mt-2 max-w-[380px] md:max-w-[440px] text-[14px] md:text-sm leading-relaxed text-gray-600">
            Você terá <span className="font-semibold text-gray-800">{durationMinutes} minutos</span> para responder
            <span className="font-semibold text-gray-800"> {questionCount} perguntas</span> sobre diferentes aspectos do seu perfil, como:
          </p>

          {/* MOBILE: 2 col + 1ª/última col-span-2 | DESKTOP: 3 col, sem spans especiais */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            {topics.map((t, i) => {
              const span2 = i === 0 || i === topics.length - 1;
              return (
                <span
                  key={t}
                  className={[
                    "inline-flex items-center justify-center text-center",
                    "rounded-xl border border-gray-200 bg-white",
                    "px-4 py-3 text-[14px] font-medium text-gray-700",
                    span2 ? "col-span-2 md:col-span-1" : "",
                  ].join(" ")}
                >
                  {t}
                </span>
              );
            })}
          </div>

          {/* MOBILE: aviso neutro; DESKTOP: vermelho como antes */}
          <div className="mx-auto mt-6 w-full rounded-xl border bg-gray-100 border-gray-300 text-gray-700 md:bg-red-100 md:border-red-200 md:text-red-700 px-4 py-3 text-[13px] leading-snug">
            Responda de forma sincera e consciente.
            <br />
            As respostas serão analisadas pelo RH.
          </div>

          {/* MOBILE: full width; DESKTOP: tamanho do conteúdo (como antes) */}
          <Button
            onClick={() => navigate({ 
              to: "/selection-process/$candidateId/questionario",
              params: { candidateId }
            })}
            className="mt-6 w-full md:w-auto h-12 md:h-auto rounded-2xl md:rounded-lg text-[16px] md:text-[14px] font-semibold bg-[#0385D1] hover:bg-[#0271b2] text-white px-6 md:px-6 md:py-2 cursor-pointer"
          >
            Avançar
          </Button>
        </section>
      </main>
    </div>
  );
}
